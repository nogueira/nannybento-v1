import { TimeLog } from '@shared/types';
import {
  differenceInMilliseconds,
  parseISO,
  startOfDay,
  isSameDay,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
export interface WorkSession {
  date: Date;
  logs: TimeLog[];
  workDuration: number; // in milliseconds
  breakDuration: number; // in milliseconds
  overtime: number; // in milliseconds
}
const STANDARD_WORK_DAY_MS = 8 * 60 * 60 * 1000; // 8 hours
export function calculateWorkSessions(logs: TimeLog[]): WorkSession[] {
  if (!logs || logs.length === 0) return [];
  const logsByDay = logs.reduce((acc, log) => {
    const day = startOfDay(parseISO(log.timestamp)).toISOString();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(log);
    return acc;
  }, {} as Record<string, TimeLog[]>);
  return Object.values(logsByDay).map((dayLogs) => {
    // Sort logs chronologically
    const sortedLogs = dayLogs.sort((a, b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime());
    let workDuration = 0;
    let breakDuration = 0;
    let lastClockIn: Date | null = null;
    let lastBreakStart: Date | null = null;
    sortedLogs.forEach((log) => {
      const timestamp = parseISO(log.timestamp);
      switch (log.status) {
        case 'clocked-in':
          if (lastBreakStart) {
            breakDuration += differenceInMilliseconds(timestamp, lastBreakStart);
            lastBreakStart = null;
          }
          lastClockIn = timestamp;
          break;
        case 'on-lunch':
        case 'on-break':
          if (lastClockIn) {
            workDuration += differenceInMilliseconds(timestamp, lastClockIn);
          }
          lastBreakStart = timestamp;
          lastClockIn = null;
          break;
        case 'clocked-out':
          if (lastClockIn) {
            workDuration += differenceInMilliseconds(timestamp, lastClockIn);
          }
          lastClockIn = null;
          lastBreakStart = null; // Reset on clock-out
          break;
      }
    });
    const overtime = Math.max(0, workDuration - STANDARD_WORK_DAY_MS);
    return {
      date: startOfDay(parseISO(sortedLogs[0].timestamp)),
      logs: sortedLogs,
      workDuration,
      breakDuration,
      overtime,
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());
}
export function formatDuration(ms: number, short = false): string {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (short) {
    if (hours === 0 && minutes === 0) return '0m';
    return `${hours > 0 ? `${hours}h` : ''} ${minutes > 0 ? `${minutes}m` : ''}`.trim();
  }
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}
export function formatHours(ms: number): number {
    return ms / (1000 * 60 * 60);
}
export function getWeeklyChartData(sessions: WorkSession[]) {
    if (!sessions.length) return [];
    const firstDay = sessions[sessions.length - 1].date;
    const lastDay = sessions[0].date;
    const weekStart = startOfWeek(lastDay, { locale: ptBR });
    const weekEnd = endOfWeek(lastDay, { locale: ptBR });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    return daysInWeek.map(day => {
        const session = sessions.find(s => isSameDay(s.date, day));
        return {
            name: format(day, 'EEE', { locale: ptBR }),
            date: format(day, 'dd/MM'),
            Horas: session ? formatHours(session.workDuration) : 0,
            "Horas Extras": session ? formatHours(session.overtime) : 0,
        };
    });
}
export function getMonthlyChartData(sessions: WorkSession[]) {
    if (!sessions.length) return [];
    const lastDay = sessions[0].date;
    const monthStart = startOfMonth(lastDay);
    const monthEnd = endOfMonth(lastDay);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const dataByWeek: Record<string, { total: number; overtime: number }> = {};
    sessions.forEach(session => {
        if (session.date >= monthStart && session.date <= monthEnd) {
            const week = format(startOfWeek(session.date, { locale: ptBR }), 'dd/MM');
            if (!dataByWeek[week]) {
                dataByWeek[week] = { total: 0, overtime: 0 };
            }
            dataByWeek[week].total += session.workDuration;
            dataByWeek[week].overtime += session.overtime;
        }
    });
    return Object.entries(dataByWeek).map(([week, data]) => ({
        name: `Sem ${week}`,
        Horas: formatHours(data.total),
        "Horas Extras": formatHours(data.overtime),
    })).reverse();
}