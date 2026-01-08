import { useState, useCallback } from 'react';

interface LocationState {
  lat: number | null;
  lng: number | null;
  address: string | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    address: null,
    error: null,
    loading: false,
    permissionDenied: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        let address: string | null = null;
        try {
          address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        } catch {
        }

        setLocation({
          lat: latitude,
          lng: longitude,
          address,
          error: null,
          loading: false,
          permissionDenied: false,
        });
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message,
          permissionDenied: error.code === error.PERMISSION_DENIED,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const checkPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'denied') {
          setLocation(prev => ({ ...prev, permissionDenied: true }));
        }
        return result.state;
      } catch {
        return 'prompt';
      }
    }
    return 'prompt';
  }, []);

  return {
    ...location,
    requestLocation,
    checkPermission,
  };
}
