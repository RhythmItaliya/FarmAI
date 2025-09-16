import React, { useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useAppDispatch } from '../hooks/redux';
import { logoutUser } from '../store/slices/authSlice';
import {
  GLOBAL,
  TYPOGRAPHY,
  COLORS,
  CARD,
  MARGIN,
  GAP,
} from '../constants/globalStyle';

const HomeScreen = React.memo(() => {
  const { navigate } = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleGoToSub = useCallback(() => {
    navigate('HomeSub');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const handleTestOnboarding = useCallback(() => {
    navigate('Onboarding');
  }, [navigate]);

  return (
    <View
      style={[
        GLOBAL.flex,
        {
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        },
      ]}
    >
      <Text style={[TYPOGRAPHY.heading, { marginBottom: 30 }]}>
        Home Screen
      </Text>

      <Button title="Go to Home Sub Screen" onPress={handleGoToSub} />
      <Button title="Test Onboarding Screen" onPress={handleTestOnboarding} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
});

export default HomeScreen;
