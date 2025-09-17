import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { loginUser, clearError } from '@/common/store/slices/authSlice';
import { ErrorHandler } from '@/common/utils/errorHandler';
import { useToast } from '@/components/Toast';
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
  TEXT_ALIGN,
  DISABLED,
} from '@/constants/globalStyle';

const LoginScreen: React.FC = () => {
  const { navigate } = useAppNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isLoading, error, isAuthenticated, requiresVerification, user } =
    useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle navigation after successful login
  useEffect(() => {
    if (isAuthenticated && !requiresVerification) {
      // User is logged in and verified - navigate to home
      navigate('Home');
    } else if (requiresVerification) {
      // User needs verification - navigate to OTP screen
      navigate('OTPVerification', {
        email: user?.email,
        username: user?.username,
      });
    }
  }, [
    isAuthenticated,
    requiresVerification,
    user?.email,
    user?.username,
    navigate,
  ]);

  // Prevent authenticated users from accessing login screen
  useEffect(() => {
    if (isAuthenticated && !requiresVerification) {
      navigate('Home');
    }
  }, [isAuthenticated, requiresVerification, navigate]);

  useEffect(() => {
    if (error) {
      showToast(error, { type: 'error' });
      dispatch(clearError());
    }
  }, [error, dispatch, showToast]);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please fill in all fields', { type: 'error' });
      return;
    }

    if (email.trim().length === 0 || password.trim().length === 0) {
      showToast('Please enter valid credentials', { type: 'error' });
      return;
    }

    try {
      const result = await dispatch(
        loginUser({ usernameOrEmail: email, password })
      ).unwrap();

      const needsVerification =
        !!result?.requiresVerification ||
        (result?.user && result.user.isActive === false);

      if (needsVerification) {
        showToast('Verification required. Check your email for OTP.', {
          type: 'info',
        });
        return;
      }

      if (result?.accessToken) {
        showToast('Welcome back!', { type: 'success' });
      }
    } catch (error) {
      ErrorHandler.logError(error, 'LoginScreen');
    }
  };

  const handleRegister = () => {
    navigate('Register');
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
