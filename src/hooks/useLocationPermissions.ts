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
      } else if (result === RESULTS.DENIED) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required for FarmAI to provide accurate farming recommendations. You can enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => RNPermissions.openSettings(),
            },
          ]
        );
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Blocked',
          'Location permission has been blocked. Please enable it in Settings to use FarmAI features.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => RNPermissions.openSettings(),
            },
          ]
        );
      } else if (result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          'Location Unavailable',
          'Location services are not available on this device. Please check your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => RNPermissions.openSettings(),
            },
          ]
        );
      }
      return false;
    } catch (error) {
      console.error('Error requesting fine location permission:', error);
      Alert.alert(
        'Error',
        'Failed to request location permission. Please try again.'
      );
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
      } else if (result === RESULTS.DENIED) {
        Alert.alert(
          'Background Location Required',
          'Background location access is needed for continuous farm monitoring. You can enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => RNPermissions.openSettings(),
            },
          ]
        );
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Background Location Blocked',
          'Background location permission has been blocked. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => RNPermissions.openSettings(),
            },
          ]
        );
      } else if (result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          'Background Location Unavailable',
          'Background location services are not available on this device. Please check your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => RNPermissions.openSettings(),
            },
          ]
        );
      }
      return false;
    } catch (error) {
      console.error('Error requesting background location permission:', error);
      Alert.alert(
        'Error',
        'Failed to request background location permission. Please try again.'
      );
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
