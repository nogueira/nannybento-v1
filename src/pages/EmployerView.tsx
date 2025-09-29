import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { api } from '@/lib/api-client';
import { TimeLog } from '@shared/types';
import { calculateWorkSessions, formatDuration, getWeeklyChartData, getMonthlyChartData, WorkSession } from '@/lib/time-helpers';
import { toast } from 'sonner';
import { BarChart, CalendarDays, Clock, Coffee, FileText, Hourglass, Loader2, MapPin, Utensils } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { DataCard } from '@/components/DataCard';
import { HoursChart } from '@/components/HoursChart';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
const statusConfig = {
  'clocked-out': { text: 'Saída', color: 'text-gray-600' },
  'clocked-in': { text: 'Entrada', color: 'text-green-600' },
  'on-break': { text: 'Pausa', color: 'text-yellow-600' },
  'on-lunch': { text: 'Almoço', color: 'text-orange-600' },
};
export function EmployerView() {
  const { currentUser, setCurrentUser } = useUserStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [workSessions, setWorkSessions] = useState<WorkSession[]>([]);
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser('carla');
    } else if (currentUser !== 'carla') {
      navigate('/');
    }
  }, [currentUser, setCurrentUser, navigate]);
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const allLogs = await api<TimeLog[]>('/api/timelogs/all');
        const sessions = calculateWorkSessions(allLogs);
        setWorkSessions(sessions);
      } catch (error) {
        toast.error('Falha ao carregar os dados de ponto.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  const summaryStats = useMemo(() => {
    return workSessions.reduce(
      (acc, session) => {
        acc.totalWorkDuration += session.workDuration;
        acc.totalOvertime += session.overtime;
        return acc;
      },
      { totalWorkDuration: 0, totalOvertime: 0 }
    );
  }, [workSessions]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>);
  }
  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 dark:text-white">
          Dashboard do Empregador
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-300 mt-2">
          Visão geral das atividades de Dilma.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DataCard title="Total de Horas Trabalhadas" value={formatDuration(summaryStats.totalWorkDuration)} icon={<Clock className="w-5 h-5" />} isLoading={isLoading} />
        <DataCard title="Total de Horas Extras" value={formatDuration(summaryStats.totalOvertime)} icon={<Hourglass className="w-5 h-5" />} isLoading={isLoading} />
        <DataCard title="Total de Dias Trabalhados" value={workSessions.length} icon={<CalendarDays className="w-5 h-5" />} isLoading={isLoading} />
      </div>
      <Tabs defaultValue="reports">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports"><FileText className="w-4 h-4 mr-2" />Relatórios Detalhados</TabsTrigger>
          <TabsTrigger value="charts"><BarChart className="w-4 h-4 mr-2" />Gráficos</TabsTrigger>
        </TabsList>
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Ponto por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              {workSessions.length > 0 ?
              <Accordion type="single" collapsible className="w-full">
                  {workSessions.map((session) =>
                <AccordionItem value={session.date.toISOString()} key={session.date.toISOString()}>
                      <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4 items-center">
                          <span className="font-semibold text-lg">{format(session.date, "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                          <div className="flex gap-4 text-sm">
                            <span><Clock className="inline w-4 h-4 mr-1" />{formatDuration(session.workDuration, true)}</span>
                            <span><Hourglass className="inline w-4 h-4 mr-1" />{formatDuration(session.overtime, true)}</span>
                            <span><Coffee className="inline w-4 h-4 mr-1" />{formatDuration(session.breakDuration, true)}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Horário</TableHead>
                              <TableHead>Evento</TableHead>
                              <TableHead className="text-right">Localização</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {session.logs.map((log) =>
                        <TableRow key={log.id}>
                                <TableCell>{format(parseISO(log.timestamp), 'HH:mm:ss')}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={cn("border-current", statusConfig[log.status].color)}>
                                    {statusConfig[log.status].text}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <a href={`https://www.google.com/maps/search/?api=1&query=${log.coordinates.latitude},${log.coordinates.longitude}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-500 hover:underline">
                                    <MapPin className="w-4 h-4 mr-1" /> Ver no Mapa
                                  </a>
                                </TableCell>
                              </TableRow>
                        )}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                )}
                </Accordion> :
              <div className="text-center text-gray-500 py-8">
                  Nenhum registro de trabalho encontrado.
                </div>
              }
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="charts" className="mt-6 space-y-6">
            <HoursChart data={getWeeklyChartData(workSessions)} title="Resumo da Semana Atual" description="Horas trabalhadas e horas extras nos últimos 7 dias." />
            <HoursChart data={getMonthlyChartData(workSessions)} title="Resumo do Mês Atual" description="Total de horas trabalhadas e extras por semana no mês." />
        </TabsContent>
      </Tabs>
    </div>);
}