import { useState, useCallback } from 'react';
import { GeolocationCoordinates } from '@shared/types';
interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | Error | null;
  coordinates: GeolocationCoordinates | null;
}
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    coordinates: null,
  });
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const getGeolocation = useCallback((): Promise<GeolocationCoordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error('Geolocation is not supported by your browser.');
        setState({ loading: false, error, coordinates: null });
        reject(error);
        return;
      }
      setState({ loading: true, error: null, coordinates: null });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: GeolocationCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setState({ loading: false, error: null, coordinates: coords });
          resolve(coords);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setShowPermissionModal(true);
          }
          setState({ loading: false, error, coordinates: null });
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);
  return { ...state, getGeolocation, showPermissionModal, setShowPermissionModal };
}