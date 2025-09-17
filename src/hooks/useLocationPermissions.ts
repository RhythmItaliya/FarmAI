import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import RNPermissions, {
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';

export interface LocationPermissionState {
  fineLocation: string;
  backgroundLocation: string;
  isLocationEnabled: boolean;
  isBackgroundEnabled: boolean;
  isLoading: boolean;
}

export const useLocationPermissions = () => {
  const [permissionState, setPermissionState] =
    useState<LocationPermissionState>({
      fineLocation: RESULTS.UNAVAILABLE,
      backgroundLocation: RESULTS.UNAVAILABLE,
      isLocationEnabled: false,
      isBackgroundEnabled: false,
      isLoading: true,
    });

  // Get the appropriate permissions based on platform
  const getPermissions = () => {
    if (Platform.OS === 'ios') {
      return {
        fineLocation: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        backgroundLocation: PERMISSIONS.IOS.LOCATION_ALWAYS,
      };
    } else {
      return {
        fineLocation: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        backgroundLocation: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      };
    }
  };

  // Check all location permissions
  const checkPermissions = useCallback(async () => {
    try {
      setPermissionState(prev => ({ ...prev, isLoading: true }));

      const permissions = getPermissions();
      const [fineLocationResult, backgroundLocationResult] = await Promise.all([
        RNPermissions.check(permissions.fineLocation),
        RNPermissions.check(permissions.backgroundLocation),
      ]);

      setPermissionState({
        fineLocation: fineLocationResult,
        backgroundLocation: backgroundLocationResult,
        isLocationEnabled: fineLocationResult === RESULTS.GRANTED,
        isBackgroundEnabled: backgroundLocationResult === RESULTS.GRANTED,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
      setPermissionState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Request fine location permission
  const requestFineLocation = useCallback(async (): Promise<boolean> => {
    try {
      const permissions = getPermissions();
      const result = await RNPermissions.request(permissions.fineLocation);

      setPermissionState(prev => ({
        ...prev,
        fineLocation: result,
        isLocationEnabled: result === RESULTS.GRANTED,
      }));

      if (result === RESULTS.GRANTED) {
        // On iOS, also request full accuracy
        if (Platform.OS === 'ios') {
          try {
            await RNPermissions.requestLocationAccuracy({
              purposeKey: 'full-accuracy',
            });
          } catch (accuracyError) {
            console.log('Full accuracy request failed:', accuracyError);
          }
        }
        return true;
      }

      // No alerts or settings redirects - just return false
      return false;
    } catch (error) {
      console.error('Error requesting fine location permission:', error);
      return false;
    }
  }, []);

  // Request background location permission
  const requestBackgroundLocation = useCallback(async (): Promise<boolean> => {
    try {
      const permissions = getPermissions();
      const result = await RNPermissions.request(
        permissions.backgroundLocation
      );

      setPermissionState(prev => ({
        ...prev,
        backgroundLocation: result,
        isBackgroundEnabled: result === RESULTS.GRANTED,
      }));

      if (result === RESULTS.GRANTED) {
        return true;
      }

      // No alerts or settings redirects - just return false
      return false;
    } catch (error) {
      console.error('Error requesting background location permission:', error);
      return false;
    }
  }, []);

  // Request all location permissions
  const requestAllPermissions = useCallback(async (): Promise<boolean> => {
    const fineLocationGranted = await requestFineLocation();
    if (fineLocationGranted) {
      return await requestBackgroundLocation();
    }
    return false;
  }, [requestFineLocation, requestBackgroundLocation]);

  // Open device settings
  const openSettings = useCallback(() => {
    RNPermissions.openSettings();
  }, []);

  // Check if we need to request background location
  const shouldRequestBackgroundLocation = useCallback((): boolean => {
    return (
      permissionState.isLocationEnabled && !permissionState.isBackgroundEnabled
    );
  }, [permissionState.isLocationEnabled, permissionState.isBackgroundEnabled]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    permissionState,
    checkPermissions,
    requestFineLocation,
    requestBackgroundLocation,
    requestAllPermissions,
    openSettings,
    shouldRequestBackgroundLocation,
  };
};
