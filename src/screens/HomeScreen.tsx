import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useAppDispatch } from '../hooks/redux';
import { logoutUser } from '../store/slices/authSlice';
import { GLOBAL, TYPOGRAPHY } from '../constants/globalStyle';
import { useLocation } from '../hooks/useLocation';

const HomeScreen = React.memo(() => {
  const { navigate } = useAppNavigation();
  const dispatch = useAppDispatch();

  const {
    locationState,
    getCurrentLocation,
    getFormattedLocation,
    permissionState,
    requestAllPermissions,
  } = useLocation();

  const handleTestOnboarding = useCallback(() => {
    navigate('Onboarding');
  }, [navigate]);

  const handleLocationScreen = useCallback(() => {
    navigate('Location');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const handleRequestLocationPermission = useCallback(async () => {
    const granted = await requestAllPermissions();
    
    // The requestAllPermissions function already handles showing alerts for denied/blocked states
    // So we don't need to show additional popups here
    if (granted) {
      // Permission was granted, wait a bit for state to update then get location
      setTimeout(() => {
        getCurrentLocation();
      }, 300);
    }
  }, [requestAllPermissions, getCurrentLocation]);

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

  return (
    <View
      style={[
        GLOBAL.flex,
        {
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          backgroundColor: '#F1F8E9',
        },
      ]}
    >
      <Text
        style={[TYPOGRAPHY.heading, { marginBottom: 40, color: '#2E7D32' }]}
      >
        🌱 FarmAI
      </Text>

      {locationState.coordinates ? (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            padding: 20,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            width: '100%',
            maxWidth: 300,
          }}
        >
          <Text
            style={[
              TYPOGRAPHY.subheading,
              { textAlign: 'center', marginBottom: 15, color: '#2E7D32' },
            ]}
          >
            📍 Your Location
          </Text>

          <Text
            style={[TYPOGRAPHY.body, { textAlign: 'center', marginBottom: 10 }]}
          >
            {getFormattedLocation()}
          </Text>

          <Text
            style={[
              TYPOGRAPHY.caption,
              { textAlign: 'center', color: '#4CAF50', fontWeight: '600' },
            ]}
          >
            Accuracy: {locationState.accuracy}
          </Text>
        </View>
      ) : locationState.isLoading ? (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            padding: 20,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            width: '100%',
            maxWidth: 300,
          }}
        >
          <Text
            style={[TYPOGRAPHY.body, { textAlign: 'center', color: '#FF6B35' }]}
          >
            🔄 Getting your location...
          </Text>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            padding: 20,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            width: '100%',
            maxWidth: 300,
          }}
        >
          <Text
            style={[TYPOGRAPHY.body, { textAlign: 'center', color: '#9E9E9E', marginBottom: 15 }]}
          >
            📍 Location not available
          </Text>
          <Button
            title="Enable Location"
            onPress={handleRequestLocationPermission}
            color="#2E7D32"
          />
        </View>
      )}

      <View style={{ marginTop: 30, gap: 10 }}>
        <Button
          title="📍 Location Screen"
          onPress={handleLocationScreen}
          color="#2E7D32"
        />
        <Button 
          title="Test Onboarding Screen" 
          onPress={handleTestOnboarding}
          color="#2E7D32"
        />
        <Button 
          title="Logout" 
          onPress={handleLogout}
          color="#D32F2F"
        />
      </View>

    </View>
  );
});

export default HomeScreen;
