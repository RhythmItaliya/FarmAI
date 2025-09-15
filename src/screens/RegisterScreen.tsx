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
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { registerUser, clearError } from '../store/slices/authSlice';
import { ErrorHandler } from '../utils/errorHandler';
import { useToast } from '../components/Toast';
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
} from '../constants/globalStyle';

const RegisterScreen: React.FC = () => {
  const { navigate } = useAppNavigation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    state => state.auth
  );
  const { showToast } = useToast();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, { type: 'error' });
      dispatch(clearError());
    }
  }, [error, dispatch, showToast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', { type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', { type: 'error' });
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', {
        type: 'error',
      });
      return;
    }

    if (username.length < 3) {
      showToast('Username must be at least 3 characters long', {
        type: 'error',
      });
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      showToast('Username can only contain letters, numbers, and underscores', {
        type: 'error',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', { type: 'error' });
      return;
    }

    try {
      const result = await dispatch(
        registerUser({ username, email, password })
      ).unwrap();

      showToast('Registration successful! Check your email for OTP.', {
        type: 'success',
      });
      navigate('OTPVerification', {
        email: result.user.email,
        username: result.user.username,
      });
    } catch (error) {
      ErrorHandler.logError(error, 'RegisterScreen');
    }
  };

  const handleLogin = () => {
    navigate('Login');
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
            Create Account
          </Text>
          <Text
            style={[
              TYPOGRAPHY.body,
              TEXT_ALIGN.center,
              { color: COLORS.textSecondary },
              MARGIN.horizontal(16),
            ]}
          >
            Sign up to get started
          </Text>
        </View>

        <View style={[CARD.base, MARGIN.bottom(32)]}>
          <View style={MARGIN.bottom(20)}>
            <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(10)]}>
              Username
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
              placeholder="Enter username"
              placeholderTextColor={COLORS.gray}
              value={formData.username}
              onChangeText={value => handleInputChange('username', value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={MARGIN.bottom(20)}>
            <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(10)]}>
              Email Address
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
              placeholder="Enter your email"
              placeholderTextColor={COLORS.gray}
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={MARGIN.bottom(20)}>
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
              value={formData.password}
              onChangeText={value => handleInputChange('password', value)}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={MARGIN.bottom(24)}>
            <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(10)]}>
              Confirm Password
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
              placeholder="Confirm your password"
              placeholderTextColor={COLORS.gray}
              value={formData.confirmPassword}
              onChangeText={value =>
                handleInputChange('confirmPassword', value)
              }
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[BUTTON.base, MARGIN.bottom(8), isLoading && DISABLED.view]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={BUTTON.text}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[GLOBAL.alignCenter, MARGIN.top(8)]}>
          <View style={[GLOBAL.flexRow, GLOBAL.alignCenter]}>
            <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
