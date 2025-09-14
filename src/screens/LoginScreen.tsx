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
} from '../constants/globalStyle';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Login successful!');
      // Navigate to main app
      navigation.navigate('Home');
    }, 1500);
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
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[GLOBAL.alignCenter, MARGIN.bottom(24)]}>
          <Text style={[TYPOGRAPHY.heading, MARGIN.bottom(8)]}>
            Welcome Back
          </Text>
          <Text
            style={[
              TYPOGRAPHY.body,
              TEXT_ALIGN.center,
              { color: COLORS.textSecondary },
            ]}
          >
            Sign in to your account
          </Text>
        </View>

        <View style={[CARD.base, MARGIN.bottom(24)]}>
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
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={MARGIN.bottom(24)}>
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
            style={[BUTTON.base, MARGIN.bottom(16), isLoading && DISABLED.view]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={BUTTON.text}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[GLOBAL.alignCenter, MARGIN.bottom(16)]}>
            <Text style={[TYPOGRAPHY.body, { color: COLORS.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[GLOBAL.alignCenter, MARGIN.top(16)]}>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
