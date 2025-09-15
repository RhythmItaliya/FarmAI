import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import { ErrorHandler } from '../utils/errorHandler';
import {
  COLORS,
  FONT_FAMILY,
  GLOBAL,
  MARGIN,
  PADDING,
  SPACING,
  TYPOGRAPHY,
  BUTTON,
  CARD,
  RADIUS,
  SHADOW,
  WIDTH,
  HEIGHT,
  TEXT_ALIGN,
  DISABLED,
} from '../constants/globalStyle';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    state => state.auth
  );

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Navigate to home when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Home');
    }
  }, [isAuthenticated, navigation]);

  // Show error alert when there's an error
  useEffect(() => {
    if (error) {
      ErrorHandler.showAlert({ message: error });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const result = await dispatch(
        loginUser({ usernameOrEmail: email, password })
      ).unwrap();

      // If user requires verification, navigate to OTP screen
      if (result.requiresVerification) {
        navigation.navigate('OTPVerification', {
          email: result.user.email,
          username: result.user.username,
        });
      }
    } catch (error) {
      // Error is handled by useEffect above
      ErrorHandler.logError(error, 'LoginScreen');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={[GLOBAL.flex, { backgroundColor: COLORS.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          GLOBAL.flexGrow,
          GLOBAL.justifyCenter,
          PADDING.horizontalMd,
          PADDING.verticalLg,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[GLOBAL.alignCenter, MARGIN.bottom(32)]}>
          <Text style={[TYPOGRAPHY.heading, MARGIN.bottom(12)]}>
            Welcome Back
          </Text>
          <Text
            style={[
              TYPOGRAPHY.body,
              TEXT_ALIGN.center,
              { color: COLORS.textSecondary },
              MARGIN.horizontal(16),
            ]}
          >
            Sign in to your account
          </Text>
        </View>

        <View style={[CARD.base, MARGIN.bottom(32)]}>
          <View style={MARGIN.bottom(20)}>
            <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(10)]}>
              Username or Email
            </Text>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: RADIUS.md,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.md,
                  fontFamily: FONT_FAMILY.regular,
                  fontSize: 16,
                  color: COLORS.text,
                  backgroundColor: COLORS.surface,
                  minHeight: 48,
                },
              ]}
              placeholder="Enter username or email"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={MARGIN.bottom(24)}>
            <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(10)]}>
              Password
            </Text>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: RADIUS.md,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.md,
                  fontFamily: FONT_FAMILY.regular,
                  fontSize: 16,
                  color: COLORS.text,
                  backgroundColor: COLORS.surface,
                  minHeight: 48,
                },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[BUTTON.base, MARGIN.bottom(20), isLoading && DISABLED.view]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={BUTTON.text}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[GLOBAL.alignCenter, MARGIN.top(8)]}>
          <View style={[GLOBAL.flexRow, GLOBAL.alignCenter]}>
            <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
