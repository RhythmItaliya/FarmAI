import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { initializeAuth } from '../store/slices/authSlice';
import { COLORS, GLOBAL, TYPOGRAPHY } from '../constants/globalStyle';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isInitialized, isLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!isInitialized || isLoading) {
    return (
      <View
        style={[
          GLOBAL.flex,
          GLOBAL.justifyCenter,
          GLOBAL.alignCenter,
          { backgroundColor: COLORS.background },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
