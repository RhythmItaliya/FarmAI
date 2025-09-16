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
import {
  verifyOTP,
  resendOTP,
  clearError,
  clearAuth,
} from '../store/slices/authSlice';
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

interface OTPVerificationScreenProps {
  route?: {
    params?: {
      email?: string;
      username?: string;
    };
  };
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  route,
}) => {
  const { navigate } = useAppNavigation();
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isLoading, error, user, isAuthenticated, requiresVerification } =
    useAppSelector(state => state.auth);

  const email = route?.params?.email || user?.email || '';
  const username = route?.params?.username || user?.username || '';

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, { type: 'error' });
      dispatch(clearError());
    }
  }, [error, dispatch, showToast]);

  useEffect(() => {
    if (isAuthenticated && !requiresVerification) {
      navigate('Onboarding');
    }
  }, [isAuthenticated, requiresVerification, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      showToast('Please enter a valid 6-digit OTP', { type: 'error' });
      return;
    }

    if (!email) {
      showToast('Email not found. Please try logging in again.', {
        type: 'error',
      });
      return;
    }

    try {
      const result = await dispatch(verifyOTP({ email, otp })).unwrap();
      showToast('Account verified successfully!', { type: 'success' });
    } catch (error) {
      ErrorHandler.logError(error, 'OTPVerificationScreen');
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) {
      showToast(
        `Please wait ${resendTimer} seconds before requesting a new OTP`,
        { type: 'info' }
      );
      return;
    }

    if (!email) {
      showToast('Email not found. Please try logging in again.', {
        type: 'error',
      });
      return;
    }

    try {
      await dispatch(resendOTP(email)).unwrap();
      setResendTimer(120);
      showToast('New OTP sent to your email', { type: 'success' });
    } catch (error) {
      ErrorHandler.logError(error, 'OTPVerificationScreen');
    }
  };

  const handleBackToLogin = () => {
    dispatch(clearAuth());
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
            Verify Your Account
          </Text>
          <Text
            style={[
              TYPOGRAPHY.body,
              TEXT_ALIGN.center,
              { color: COLORS.textSecondary },
              MARGIN.horizontal(16),
            ]}
          >
            We've sent a 6-digit verification code to:
          </Text>
          <Text
            style={[
              TYPOGRAPHY.bodyBold,
              { color: COLORS.primary },
              MARGIN.bottom(16),
            ]}
          >
            {email}
          </Text>
          <Text
            style={[
              TYPOGRAPHY.body,
              TEXT_ALIGN.center,
              { color: COLORS.textSecondary },
              MARGIN.horizontal(16),
            ]}
          >
            Please enter the code below to verify your account.
          </Text>
        </View>

        <View style={[CARD.base, MARGIN.bottom(32)]}>
          <View style={MARGIN.bottom(24)}>
            <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(10)]}>
              Verification Code
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
                  fontSize: 24,
                  color: COLORS.text,
                  backgroundColor: COLORS.surface,
                  minHeight: 56,
                  textAlign: 'center',
                  letterSpacing: 8,
                },
              ]}
              placeholder="000000"
              placeholderTextColor={COLORS.gray}
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[BUTTON.base, MARGIN.bottom(20), isLoading && DISABLED.view]}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            <Text style={BUTTON.text}>
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[GLOBAL.alignCenter, MARGIN.bottom(8)]}
            onPress={handleResendOTP}
            disabled={resendTimer > 0}
          >
            <Text
              style={[
                TYPOGRAPHY.body,
                {
                  color: resendTimer > 0 ? COLORS.gray : COLORS.primary,
                },
              ]}
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[GLOBAL.alignCenter, MARGIN.top(8)]}>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary }]}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTPVerificationScreen;
