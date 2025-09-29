import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Coffee, LogIn, LogOut, MapPin, Play, Pause, Loader2, Settings, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useGeolocation } from '@/hooks/useGeolocation';
import { api } from '@/lib/api-client';
import { TimeLog, TimeLogStatus, GeolocationCoordinates } from '@shared/types';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTimer } from '@/hooks/useTimer';
import { useNotifications } from '@/hooks/useNotifications';
import { SettingsModal } from '@/components/SettingsModal';
import { GeolocationPermissionModal } from '@/components/GeolocationPermissionModal';
const statusConfig = {
  'clocked-out': { text: 'Fora do expediente', color: 'bg-gray-500', icon: <LogOut className="w-4 h-4 mr-2" /> },
  'clocked-in': { text: 'Trabalhando', color: 'bg-green-500', icon: <LogIn className="w-4 h-4 mr-2" /> },
  'on-break': { text: 'Em pausa', color: 'bg-yellow-500', icon: <Coffee className="w-4 h-4 mr-2" /> },
  'on-lunch': { text: 'Em almoço', color: 'bg-orange-500', icon: <Utensils className="w-4 h-4 mr-2" /> },
};
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
export function BabysitterView() {
  const [status, setStatus] = useState<TimeLogStatus>('clocked-out');
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getGeolocation, loading: geoLoading, showPermissionModal, setShowPermissionModal } = useGeolocation();
  const { currentUser, setCurrentUser } = useUserStore();
  const navigate = useNavigate();
  const { scheduleNotification } = useNotifications();
  const latestLogTimestamp = logs.length > 0 ? logs[0].timestamp : null;
  const sessionTimer = useTimer(status === 'clocked-out' ? null : latestLogTimestamp);
  useEffect(() => {
    if (!currentUser) {
      setCurrentUser('dilma');
    } else if (currentUser !== 'dilma') {
      navigate('/');
    }
  }, [currentUser, setCurrentUser, navigate]);
  const fetchTodayData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statusData, logsData] = await Promise.all([
        api<{ status: TimeLogStatus }>('/api/timelogs/status'),
        api<TimeLog[]>('/api/timelogs/today'),
      ]);
      setStatus(statusData.status || 'clocked-out');
      setLogs(logsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error) {
      toast.error('Falha ao carregar dados de hoje.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchTodayData();
  }, [fetchTodayData]);
  const handleAction = async (newStatus: TimeLogStatus) => {
    setIsLoading(true);
    let coordinates: GeolocationCoordinates;
    let geoWarning = false;
    try {
      coordinates = await getGeolocation();
    } catch (error) {
      // Geolocation failed, use default coordinates and set a warning flag
      coordinates = { latitude: 0, longitude: 0, accuracy: 0 };
      geoWarning = true;
      const geoPositionError = error as GeolocationPositionError;
      // The hook handles showing the permission modal, so we only toast for other errors.
      if (geoPositionError.code && geoPositionError.code !== geoPositionError.PERMISSION_DENIED) {
        let errorMessage = 'Falha ao obter localização.';
        if (geoPositionError.code === geoPositionError.POSITION_UNAVAILABLE) {
          errorMessage = 'Informação de localização indisponível.';
        } else if (geoPositionError.code === geoPositionError.TIMEOUT) {
          errorMessage = 'Tempo esgotado para obter a localização.';
        }
        toast.error(errorMessage);
      }
      console.error("Geolocation error:", error);
    }
    try {
      const newLog: Omit<TimeLog, 'id'> = {
        userId: 'dilma',
        status: newStatus,
        timestamp: new Date().toISOString(),
        coordinates,
      };
      const createdLog = await api<TimeLog>('/api/timelogs', {
        method: 'POST',
        body: JSON.stringify(newLog),
      });
      toast.success(`Ponto registrado com sucesso: ${statusConfig[newStatus].text}`);
      if (geoWarning) {
        toast.warning('O ponto foi registrado sem a localização precisa.');
      }
      if (newStatus === 'clocked-in') {
        scheduleNotification('Lembrete: Fim do expediente em 8 horas.', EIGHT_HOURS_MS);
      }
      setStatus(newStatus);
      setLogs(prev => [createdLog, ...prev]);
    } catch (apiError) {
      toast.error('Falha ao registrar o ponto. Tente novamente.');
      console.error("API Error:", apiError);
    } finally {
      setIsLoading(false);
    }
  };
  const isClockedIn = status === 'clocked-in';
  const isClockedOut = status === 'clocked-out';
  const isOnBreak = status === 'on-break';
  const isOnLunch = status === 'on-lunch';
  const isActionLoading = isLoading || geoLoading;
  return (
    <div className="space-y-8">
      <GeolocationPermissionModal isOpen={showPermissionModal} onClose={() => setShowPermissionModal(false)} />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Registro de Ponto</span>
              {!isClockedOut && (
                <Badge variant="secondary" className="text-lg font-mono tracking-wider">
                  {sessionTimer}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn("text-white", statusConfig[status].color)}>
                {statusConfig[status].icon}
                {statusConfig[status].text}
              </Badge>
              <SettingsModal>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </SettingsModal>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isClockedOut && (
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white h-24 text-xl col-span-full transition-all duration-200 ease-in-out hover:scale-105 active:scale-95" onClick={() => handleAction('clocked-in')} disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><LogIn className="w-8 h-8 mr-4" />Entrada</>}
              </Button>
            )}
            {isClockedIn && (
              <>
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white h-24 text-xl transition-all duration-200 ease-in-out hover:scale-105 active:scale-95" onClick={() => handleAction('on-lunch')} disabled={isActionLoading}>
                  {isActionLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Utensils className="w-8 h-8 mr-4" />Iniciar Almoço</>}
                </Button>
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white h-24 text-xl transition-all duration-200 ease-in-out hover:scale-105 active:scale-95" onClick={() => handleAction('on-break')} disabled={isActionLoading}>
                  {isActionLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Pause className="w-8 h-8 mr-4" />Pausa</>}
                </Button>
                <Button size="lg" variant="destructive" className="h-24 text-xl col-span-full transition-all duration-200 ease-in-out hover:scale-105 active:scale-95" onClick={() => handleAction('clocked-out')} disabled={isActionLoading}>
                  {isActionLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><LogOut className="w-8 h-8 mr-4" />Saída</>}
                </Button>
              </>
            )}
            {isOnBreak && (
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white h-24 text-xl col-span-full transition-all duration-200 ease-in-out hover:scale-105 active:scale-95" onClick={() => handleAction('clocked-in')} disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Play className="w-8 h-8 mr-4" />Retornar</>}
              </Button>
            )}
            {isOnLunch && (
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white h-24 text-xl col-span-full transition-all duration-200 ease-in-out hover:scale-105 active:scale-95" onClick={() => handleAction('clocked-in')} disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Play className="w-8 h-8 mr-4" />Terminar Almoço</>}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Clock className="w-5 h-5 mr-2" />Registros de Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horário</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead className="text-right">Localização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{format(new Date(log.timestamp), 'HH:mm:ss')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("border-current",
                          log.status === 'clocked-in' ? 'text-green-600' :
                          log.status === 'on-break' ? 'text-yellow-600' :
                          log.status === 'on-lunch' ? 'text-orange-600' :
                          'text-gray-600'
                        )}>
                          {statusConfig[log.status].text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {log.coordinates.latitude === 0 && log.coordinates.longitude === 0 ? (
                          <span className="text-gray-400 italic">Não disponível</span>
                        ) : (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${log.coordinates.latitude},${log.coordinates.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-500 hover:underline"
                          >
                            <MapPin className="w-4 h-4 mr-1" /> Ver no Mapa
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                      Nenhum registro encontrado para hoje.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}