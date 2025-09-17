import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useLocationPermissions } from './useLocationPermissions';
import locationService, {
  LocationCoordinates,
  LocationError,
} from '../services/LocationService';

export interface LocationState {
  coordinates: LocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  accuracy: string | null;
  isWatching: boolean;
}

export const useLocation = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    coordinates: null,
    isLoading: false,
    error: null,
    accuracy: null,
    isWatching: false,
  });

  const { permissionState, requestAllPermissions } =
    useLocationPermissions();

  // Get current location with permission check
  const getCurrentLocation =
    useCallback(async (): Promise<LocationCoordinates | null> => {
      if (!permissionState.isLocationEnabled) {
        // Request permission using native mobile dialog
        const granted = await requestAllPermissions();
        
        // Only show popup if permission was actually denied/blocked
        if (!granted) {
          // Show popup to go to settings if permission is still not granted
          Alert.alert(
            'Location Permission Required',
            'FarmAI needs location access to provide accurate farming recommendations. Please enable location permission in Settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Go to Settings',
                onPress: () => {
                  // Import RNPermissions here to avoid circular dependency
                  import('react-native-permissions').then(({ default: RNPermissions }) => {
                    RNPermissions.openSettings();
                  });
                },
              },
            ]
          );
          return null;
        }
      }

      setLocationState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const location = await locationService.getLocationWithPermissionCheck();

        if (location) {
          setLocationState(prev => ({
            ...prev,
            coordinates: location,
            accuracy: locationService.getAccuracyValue(location.accuracy),
            isLoading: false,
            error: null,
          }));
          return location;
        } else {
          setLocationState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Failed to get location',
          }));
          return null;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setLocationState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return null;
      }
    }, [permissionState.isLocationEnabled, requestAllPermissions]);

  // Start watching location changes
  const startWatchingLocation = useCallback(async () => {
    if (!permissionState.isLocationEnabled) {
      // Request permission using native mobile dialog
      const granted = await requestAllPermissions();
      
      // Only show popup if permission was actually denied/blocked
      if (!granted) {
        // Show popup to go to settings if permission is still not granted
        Alert.alert(
          'Location Permission Required',
          'FarmAI needs location access to monitor your farm location. Please enable location permission in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Go to Settings',
              onPress: () => {
                // Import RNPermissions here to avoid circular dependency
                import('react-native-permissions').then(({ default: RNPermissions }) => {
                  RNPermissions.openSettings();
                });
              },
            },
          ]
        );
        return;
      }
    }

    if (locationState.isWatching) {
      console.warn('Location watching is already active');
      return;
    }

    setLocationState(prev => ({ ...prev, isWatching: true, error: null }));

    locationService.startWatchingLocation(
      (location: LocationCoordinates) => {
        setLocationState(prev => ({
          ...prev,
          coordinates: location,
          accuracy: locationService.getAccuracyValue(location.accuracy),
          error: null,
        }));
      },
      (error: LocationError) => {
        setLocationState(prev => ({
          ...prev,
          error: error.message,
          isWatching: false,
        }));
      }
    );
  }, [
    permissionState.isLocationEnabled,
    locationState.isWatching,
    requestAllPermissions,
  ]);

  // Stop watching location changes
  const stopWatchingLocation = useCallback(() => {
    locationService.stopWatchingLocation();
    setLocationState(prev => ({ ...prev, isWatching: false }));
  }, []);

  // Clear location data
  const clearLocation = useCallback(() => {
    setLocationState({
      coordinates: null,
      isLoading: false,
      error: null,
      accuracy: null,
      isWatching: false,
    });
  }, []);

  // Get formatted location string
  const getFormattedLocation = useCallback((): string => {
    if (!locationState.coordinates) {
      return 'No location available';
    }
    return locationService.formatLocation(locationState.coordinates);
  }, [locationState.coordinates]);

  // Calculate distance to another location
  const calculateDistance = useCallback(
    (targetLat: number, targetLon: number): number | null => {
      if (!locationState.coordinates) {
        return null;
      }
      return locationService.calculateDistance(
        locationState.coordinates.latitude,
        locationState.coordinates.longitude,
        targetLat,
        targetLon
      );
    },
    [locationState.coordinates]
  );

  // Auto-get location when permissions are granted
  useEffect(() => {
    if (
      permissionState.isLocationEnabled &&
      !locationState.coordinates &&
      !locationState.isLoading
    ) {
      getCurrentLocation();
    }
  }, [
    permissionState.isLocationEnabled,
    locationState.coordinates,
    locationState.isLoading,
    getCurrentLocation,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      locationService.stopWatchingLocation();
    };
  }, []);

    return {
    locationState,
    getCurrentLocation,
    startWatchingLocation,
    stopWatchingLocation,
    clearLocation,
    getFormattedLocation,
    calculateDistance,
    // Permission state
    permissionState,
    requestAllPermissions,
  };
};
