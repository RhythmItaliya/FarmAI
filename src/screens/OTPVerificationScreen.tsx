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
import { verifyOTP, resendOTP, clearError } from '../store/slices/authSlice';
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
  TEXT_ALIGN,
  DISABLED,
} from '../constants/globalStyle';

interface OTPVerificationScreenProps {
  navigation: any;
  route: {
    params: {
      email: string;
      username: string;
    };
  };
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector(state => state.auth);

  const { email, username } = route.params;

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Show error alert when there's an error
  useEffect(() => {
    if (error) {
      ErrorHandler.showAlert({ message: error });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Navigate to home when authenticated
  useEffect(() => {
    if (user?.isActive) {
      navigation.navigate('Home');
    }
  }, [user?.isActive, navigation]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await dispatch(verifyOTP({ email, otp })).unwrap();
      Alert.alert('Success', 'Account verified successfully!');
    } catch (error) {
      // Error is handled by useEffect above
      ErrorHandler.logError(error, 'OTPVerificationScreen');
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) {
      Alert.alert('Wait', `Please wait ${resendTimer} seconds before requesting a new OTP`);
      return;
    }

    try {
      await dispatch(resendOTP(email)).unwrap();
      setResendTimer(120); // 2 minutes timer
      Alert.alert('Success', 'New OTP sent to your email');
    } catch (error) {
      // Error is handled by useEffect above
      ErrorHandler.logError(error, 'OTPVerificationScreen');
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
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
            <Text style={[
              TYPOGRAPHY.body,
              { 
                color: resendTimer > 0 ? COLORS.gray : COLORS.primary 
              }
            ]}>
              {resendTimer > 0 
                ? `Resend OTP in ${resendTimer}s` 
                : 'Resend OTP'
              }
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
