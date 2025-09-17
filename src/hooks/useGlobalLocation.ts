/**
 * useGlobalLocation - Hook to access global location state and actions throughout the app.
 *
 * This hook provides access to the global location state managed by GlobalLocationProvider.
 * Location is automatically fetched and updated when permissions are granted.
 *
 * Usage Example:
 *
 * import { useGlobalLocation } from '@/hooks/useGlobalLocation';
 *
 * const MyComponent = () => {
 *   const {
 *     locationState,
 *     isLocationAvailable,
 *     getFormattedLocation,
 *     requestLocationPermissions
 *   } = useGlobalLocation();
 *
 *   return (
 *     <View>
 *       {isLocationAvailable ? (
 *         <Text>{getFormattedLocation()}</Text>
 *       ) : (
 *         <Button title="Enable Location" onPress={requestLocationPermissions} />
 *       )}
 *     </View>
 *   );
 * };
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/common/store';
import {
  setLocation,
  setLocationLoading,
  setLocationError,
  setLocationAccuracy,
  setLocationWatching,
  setLocationAvailable,
  clearLocation,
  updateLocation,
} from '@/common/store/slices/locationSlice';
import { useLocationPermissions } from './useLocationPermissions';
import locationService, {
  LocationCoordinates,
  LocationError,
} from '@/services/LocationService';

export const useGlobalLocation = () => {
  const dispatch = useDispatch();
  const locationState = useSelector((state: RootState) => state.location);
  const { permissionState, requestAllPermissions, checkPermissions } =
    useLocationPermissions();

  // Get current location and update global state
  const getCurrentLocation =
    useCallback(async (): Promise<LocationCoordinates | null> => {
      if (!permissionState.isLocationEnabled) {
        dispatch(setLocationAvailable(false));
        return null;
      }

      dispatch(setLocationLoading(true));
      dispatch(setLocationError(null));

      try {
        const location = await locationService.getLocationWithPermissionCheck();

        if (location) {
          const accuracy = locationService.getAccuracyValue(location.accuracy);
          dispatch(
            updateLocation({
              coordinates: location,
              accuracy,
            })
          );
          return location;
        } else {
          dispatch(setLocationError('Failed to get location'));
          dispatch(setLocationAvailable(false));
          return null;
        }
      } catch (error: any) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        dispatch(setLocationError(errorMessage));
        dispatch(setLocationAvailable(false));
        return null;
      } finally {
        dispatch(setLocationLoading(false));
      }
    }, [permissionState.isLocationEnabled, dispatch]);

  // Start watching location changes
  const startWatchingLocation = useCallback(() => {
    if (!permissionState.isLocationEnabled || locationState.isWatching) {
      return;
    }

    dispatch(setLocationWatching(true));
    dispatch(setLocationError(null));

    locationService.startWatchingLocation(
      (location: LocationCoordinates) => {
        const accuracy = locationService.getAccuracyValue(location.accuracy);
        dispatch(
          updateLocation({
            coordinates: location,
            accuracy,
            isWatching: true,
          })
        );
      },
      (error: LocationError) => {
        dispatch(setLocationError(error.message));
        dispatch(setLocationWatching(false));
      }
    );
  }, [permissionState.isLocationEnabled, locationState.isWatching, dispatch]);

  // Stop watching location changes
  const stopWatchingLocation = useCallback(() => {
    locationService.stopWatchingLocation();
    dispatch(setLocationWatching(false));
  }, [dispatch]);

  // Request location permissions
  const requestLocationPermissions = useCallback(async (): Promise<boolean> => {
    const granted = await requestAllPermissions();
    await checkPermissions();

    if (granted) {
      // Wait a bit for state to update, then get location
      setTimeout(() => {
        getCurrentLocation();
      }, 300);
    }

    return granted;
  }, [requestAllPermissions, checkPermissions, getCurrentLocation]);

  // Clear location data
  const clearLocationData = useCallback(() => {
    dispatch(clearLocation());
    stopWatchingLocation();
  }, [dispatch, stopWatchingLocation]);

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

  return {
    // Location state
    locationState,

    // Permission state
    permissionState,

    // Actions
    getCurrentLocation,
    startWatchingLocation,
    stopWatchingLocation,
    requestLocationPermissions,
    clearLocationData,
    getFormattedLocation,
    calculateDistance,
    checkPermissions,

    // Computed values
    isLocationAvailable: locationState.isLocationAvailable,
    hasLocation: !!locationState.coordinates,
    isLocationLoading: locationState.isLoading,
    locationError: locationState.error,
    locationAccuracy: locationState.accuracy,
    isWatchingLocation: locationState.isWatching,
  };
};
