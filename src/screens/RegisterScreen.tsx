import React, { useState } from 'react';
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
  GAP,
} from '../constants/globalStyle';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Registration successful!');
      // Navigate to login screen
      navigation.navigate('Login');
    }, 1500);
  };

  const handleLogin = () => {
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
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[GLOBAL.alignCenter, MARGIN.bottom(24)]}>
          <Text style={[TYPOGRAPHY.heading, MARGIN.bottom(8)]}>
            Create Account
          </Text>
          <Text
            style={[
              TYPOGRAPHY.body,
              TEXT_ALIGN.center,
              { color: COLORS.textSecondary },
            ]}
          >
            Sign up to get started
          </Text>
        </View>

        <View style={[CARD.base, MARGIN.bottom(24)]}>
          <View style={[GLOBAL.flexRow, GAP.sm, MARGIN.bottom(16)]}>
            <View style={[GLOBAL.flex, MARGIN.right(8)]}>
              <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(8)]}>
                First Name
              </Text>
              <TextInput
                style={[
                  {
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: RADIUS.md,
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.sm,
                    fontFamily: FONT_FAMILY.regular,
                    fontSize: 16,
                    color: COLORS.text,
                    backgroundColor: COLORS.surface,
                  },
                ]}
                placeholder="First name"
                placeholderTextColor={COLORS.gray}
                value={formData.firstName}
                onChangeText={value => handleInputChange('firstName', value)}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            <View style={[GLOBAL.flex, MARGIN.left(8)]}>
              <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(8)]}>
                Last Name
              </Text>
              <TextInput
                style={[
                  {
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: RADIUS.md,
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.sm,
                    fontFamily: FONT_FAMILY.regular,
                    fontSize: 16,
                    color: COLORS.text,
                    backgroundColor: COLORS.surface,
                  },
                ]}
                placeholder="Last name"
                placeholderTextColor={COLORS.gray}
                value={formData.lastName}
                onChangeText={value => handleInputChange('lastName', value)}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={MARGIN.bottom(16)}>
            <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(8)]}>
              Email Address
            </Text>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: RADIUS.md,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm,
                  fontFamily: FONT_FAMILY.regular,
                  fontSize: 16,
                  color: COLORS.text,
                  backgroundColor: COLORS.surface,
                },
                MARGIN.bottom(16),
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

          <View style={MARGIN.bottom(16)}>
            <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(8)]}>
              Password
            </Text>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: RADIUS.md,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm,
                  fontFamily: FONT_FAMILY.regular,
                  fontSize: 16,
                  color: COLORS.text,
                  backgroundColor: COLORS.surface,
                },
                MARGIN.bottom(16),
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
            <Text style={[TYPOGRAPHY.bodyBold, MARGIN.bottom(8)]}>
              Confirm Password
            </Text>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: RADIUS.md,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm,
                  fontFamily: FONT_FAMILY.regular,
                  fontSize: 16,
                  color: COLORS.text,
                  backgroundColor: COLORS.surface,
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
            style={[BUTTON.base, MARGIN.bottom(16), isLoading && DISABLED.view]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={BUTTON.text}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[GLOBAL.alignCenter, MARGIN.top(16)]}>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
