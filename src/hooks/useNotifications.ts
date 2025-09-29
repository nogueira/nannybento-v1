import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
type NotificationPermission = 'default' | 'granted' | 'denied';
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      const storedPreference = localStorage.getItem('notificationsEnabled');
      if (storedPreference === 'true' && Notification.permission === 'granted') {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
        localStorage.setItem('notificationsEnabled', 'false');
      }
    }
  }, []);
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Este navegador não suporta notificações.');
      return false;
    }
    const status = await Notification.requestPermission();
    setPermission(status);
    if (status === 'granted') {
      toast.success('Notificações ativadas!');
      setIsEnabled(true);
      localStorage.setItem('notificationsEnabled', 'true');
      return true;
    } else {
      toast.warning('Permissão para notificações negada.');
      setIsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
      return false;
    }
  }, []);
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && isEnabled) {
      new Notification(title, {
        body: 'PontoNanny - Controle de Ponto Inteligente',
        icon: '/favicon.ico',
        ...options,
      });
    }
  }, [permission, isEnabled]);
  const scheduleNotification = useCallback((title: string, delayMs: number, options?: NotificationOptions) => {
    if (permission === 'granted' && isEnabled) {
      setTimeout(() => {
        sendNotification(title, options);
      }, delayMs);
    }
  }, [permission, isEnabled, sendNotification]);
  const toggleNotifications = useCallback(async (enabled: boolean) => {
    if (enabled) {
      await requestPermission();
    } else {
      setIsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
      toast.info('Notificações desativadas.');
    }
  }, [requestPermission]);
  return {
    permission,
    isEnabled,
    requestPermission,
    sendNotification,
    scheduleNotification,
    toggleNotifications,
  };
}