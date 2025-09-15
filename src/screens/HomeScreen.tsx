import React, { useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useAppDispatch } from '../hooks/redux';
import { logoutUser } from '../store/slices/authSlice';
import { GLOBAL, PADDING, TYPOGRAPHY } from '../constants/globalStyle';

const HomeScreen = React.memo(() => {
  const { navigate } = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleGoToSub = useCallback(() => {
    navigate('HomeSub');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return (
    <View style={[GLOBAL.flex, PADDING.md]}>
      <Text style={TYPOGRAPHY.heading}>Home Screen</Text>
      <Button title="Go to Home Sub Screen" onPress={handleGoToSub} />
      <View style={{ height: 12 }} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
});

export default HomeScreen;
