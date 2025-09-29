export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type TimeLogStatus = 'clocked-in' | 'clocked-out' | 'on-break' | 'on-lunch';
export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}
export interface TimeLog {
  id: string;
  userId: 'dilma'; // Fixed user for this app
  status: TimeLogStatus;
  timestamp: string; // ISO 8601 format
  coordinates: GeolocationCoordinates;
}
export interface TimeLogReport {
    totalWorkDuration: number;
    totalBreakDuration: number;
    totalOvertime: number;
    totalDaysWorked: number;
    sessions: {
        date: string;
        workDuration: number;
        breakDuration: number;
        overtime: number;
        logs: TimeLog[];
    }[];
}