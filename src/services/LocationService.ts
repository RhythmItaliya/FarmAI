import { Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useLocationPermissions } from '../hooks/useLocationPermissions';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface LocationError {
  code: number;
  message: string;
}

class LocationService {
  private watchId: number | null = null;
  private isWatching = false;

  /**
   * Get current location using built-in mobile accuracy settings
   */
  async getCurrentLocation(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      const options: Geolocation.GeoOptions = {
        enableHighAccuracy: true, // Let mobile OS handle accuracy settings
        timeout: 15000, // 15 seconds timeout
        maximumAge: 10000, // Accept cached location up to 10 seconds old
        showLocationDialog: true, // Show location dialog if needed
        forceRequestLocation: true, // Force request even if cached
      };

      Geolocation.getCurrentPosition(
        position => {
          const location: LocationCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
            timestamp: position.timestamp,
          };
          resolve(location);
        },
        error => {
          const locationError: LocationError = {
            code: error.code,
            message: error.message,
          };
          reject(locationError);
        },
        options
      );
    });
  }

  /**
   * Start watching location changes using built-in mobile accuracy settings
   */
  startWatchingLocation(
    onLocationUpdate: (location: LocationCoordinates) => void,
    onError?: (error: LocationError) => void
  ): void {
    if (this.isWatching) {
      console.warn('Location watching is already active');
      return;
    }

    const options: Geolocation.GeoWatchOptions = {
      enableHighAccuracy: true, // Let mobile OS handle accuracy settings
      distanceFilter: 10, // Use default mobile distance filter
      interval: 1000, // Update every 1 second
      fastestInterval: 1000, // Use default mobile fastest interval
      showLocationDialog: true,
      forceRequestLocation: true,
    };

    this.watchId = Geolocation.watchPosition(
      position => {
        const location: LocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
          timestamp: position.timestamp,
        };
        onLocationUpdate(location);
      },
      error => {
        const locationError: LocationError = {
          code: error.code,
          message: error.message,
        };
        if (onError) {
          onError(locationError);
        }
      },
      options
    );

    this.isWatching = true;
  }

  /**
   * Stop watching location changes
   */
  stopWatchingLocation(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isWatching = false;
    }
  }

  /**
   * Check if location services are enabled
   */
  async checkLocationServices(): Promise<boolean> {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        {
          enableHighAccuracy: false,
          timeout: 1000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Get location with permission check
   */
  async getLocationWithPermissionCheck(): Promise<LocationCoordinates | null> {
    try {
      // Check if location services are enabled
      const servicesEnabled = await this.checkLocationServices();
      if (!servicesEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to use FarmAI features.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Geolocation.requestAuthorization('whenInUse'),
            },
          ]
        );
        return null;
      }

      // Get current location with high accuracy
      const location = await this.getCurrentLocation();
      return location;
    } catch (error: any) {
      console.error('Error getting location:', error);

      if (error.code === 1) {
        // Permission denied
        Alert.alert(
          'Location Permission Required',
          'FarmAI needs location permission to provide accurate farming recommendations. Please enable location access in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Geolocation.requestAuthorization('whenInUse'),
            },
          ]
        );
      } else if (error.code === 2) {
        // Position unavailable
        Alert.alert(
          'Location Unavailable',
          'Unable to get your current location. Please check your GPS settings and try again.',
          [{ text: 'OK' }]
        );
      } else if (error.code === 3) {
        // Timeout
        Alert.alert(
          'Location Timeout',
          'Location request timed out. Please try again.',
          [{ text: 'OK' }]
        );
      }

      return null;
    }
  }

  /**
   * Format location coordinates for display
   */
  formatLocation(location: LocationCoordinates): string {
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  /**
   * Calculate distance between two coordinates (in meters)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Get accuracy as raw value (let mobile OS handle accuracy)
   */
  getAccuracyValue(accuracy: number): string {
    return `${accuracy.toFixed(1)}m`;
  }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService;
