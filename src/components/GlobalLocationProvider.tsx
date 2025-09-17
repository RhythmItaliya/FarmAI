import React, { useEffect, useCallback } from 'react';
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
import { useLocationPermissions } from '@/hooks/useLocationPermissions';
import locationService, {
  LocationCoordinates,
  LocationError,
} from '@/services/LocationService';

interface GlobalLocationProviderProps {
  children: React.ReactNode;
}

const GlobalLocationProvider: React.FC<GlobalLocationProviderProps> = ({
  children,
}) => {
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

  // Auto-get location when permissions are granted
  useEffect(() => {
    if (
      permissionState.isLocationEnabled &&
      !locationState.coordinates &&
      !locationState.isLoading &&
      !locationState.error
    ) {
      getCurrentLocation();
    }
  }, [
    permissionState.isLocationEnabled,
    locationState.coordinates,
    locationState.isLoading,
    locationState.error,
    getCurrentLocation,
  ]);

  // Auto-start watching location when permissions are granted and we have initial location
  useEffect(() => {
    if (
      permissionState.isLocationEnabled &&
      locationState.coordinates &&
      !locationState.isWatching &&
      !locationState.isLoading
    ) {
      // Start watching after a short delay to ensure initial location is set
      const timer = setTimeout(() => {
        startWatchingLocation();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    permissionState.isLocationEnabled,
    locationState.coordinates,
    locationState.isWatching,
    locationState.isLoading,
    startWatchingLocation,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatchingLocation();
    };
  }, [stopWatchingLocation]);

  // Provide location context to children
  return <>{children}</>;
};

export default GlobalLocationProvider;
