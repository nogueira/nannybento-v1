import { useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
function formatElapsedTime(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}
export function useTimer(startTime: string | null) {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  useEffect(() => {
    if (!startTime) {
      setElapsedTime('00:00:00');
      return;
    }
    const start = parseISO(startTime);
    const intervalId = setInterval(() => {
      const now = new Date();
      const seconds = Math.floor((now.getTime() - start.getTime()) / 1000);
      setElapsedTime(formatElapsedTime(seconds));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [startTime]);
  return elapsedTime;
}