import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useToast } from '../components/Toast';
import {
  COLORS,
  GLOBAL,
  MARGIN,
  PADDING,
  SPACING,
  TYPOGRAPHY,
  BUTTON,
  CARD,
  RADIUS,
  TEXT_ALIGN,
  WIDTH,
  HEIGHT,
  BORDER,
  SHADOW,
  GAP,
} from '../constants/globalStyle';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  image: string;
  isLastStep: boolean;
}

const languages = [
  { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'english', name: 'English', flag: '🇺🇸' },
  { code: 'bengali', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'telugu', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'marathi', name: 'मराठी', flag: '🇮🇳' },
  { code: 'tamil', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gujarati', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kannada', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'malayalam', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'punjabi', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Great Product Deals',
    description:
      'Discover amazing farming products and equipment at the best prices for your agricultural needs.',
    image:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
    isLastStep: false,
  },
  {
    id: 2,
    title: 'Supportive Farming Community',
    description:
      'Connect with fellow farmers, share knowledge, and get expert advice from our supportive community.',
    image:
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
    isLastStep: false,
  },
  {
    id: 3,
    title: 'Smart Crop Monitoring',
    description:
      'Monitor your crops with AI-powered insights and real-time data analysis for better yields.',
    image:
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=400&h=300&fit=crop',
    isLastStep: true,
  },
];

const OnboardingScreen: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');

  const currentStepData =
    currentStep > 0 ? onboardingSteps[currentStep - 1] : null;

  const handleNext = () => {
    if (currentStep < 3) {
      // Total steps: 0,1,2,3 (4 steps)
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding completed - proceed to authentication
      showToast('Welcome to FarmAI!', { type: 'success' });
      // Navigate to login/register screen for authentication
      navigate('Login');
    }
  };

  const handleSkip = () => {
    showToast('Onboarding skipped', { type: 'info' });
    // Skip onboarding but still require authentication
    navigate('Login');
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    showToast(`Language set to ${language === 'hindi' ? 'Hindi' : 'English'}`, {
      type: 'success',
    });
  };

  const renderLanguageSelection = () => (
    <View
      style={[CARD.base, MARGIN.bottom(20), { width: '100%', maxWidth: 400 }]}
    >
      <Text
        style={[
          TYPOGRAPHY.custom({ fontSize: 28, color: COLORS.text }),
          MARGIN.bottom(8),
          TEXT_ALIGN.center,
        ]}
      >
        Namaste!
      </Text>
      <Text
        style={[
          TYPOGRAPHY.custom({ fontSize: 16, color: COLORS.textSecondary }),
          MARGIN.bottom(20),
          TEXT_ALIGN.center,
        ]}
      >
        Select your Plantix language
      </Text>

      <View style={GAP.sm}>
        {languages.map((language, index) => (
          <TouchableOpacity
            key={language.code}
            style={[
              GLOBAL.flexRow,
              GLOBAL.alignCenter,
              GLOBAL.justifyBetween,
              PADDING.customLTRB(16, 12, 16, 12),
              { borderRadius: RADIUS.lg },
              {
                backgroundColor:
                  selectedLanguage === language.code ? '#E3F2FD' : COLORS.white,
                borderWidth: 1,
                borderColor:
                  selectedLanguage === language.code
                    ? COLORS.primary
                    : COLORS.border,
              },
              MARGIN.bottom(8),
            ]}
            onPress={() => handleLanguageSelect(language.code)}
          >
            <View style={GLOBAL.flexGrow}>
              <Text
                style={[
                  TYPOGRAPHY.custom({ fontSize: 16, color: COLORS.text }),
                  MARGIN.bottom(2),
                ]}
              >
                {language.name}
              </Text>
              <Text
                style={[
                  TYPOGRAPHY.custom({
                    fontSize: 14,
                    color: COLORS.textSecondary,
                  }),
                ]}
              >
                Farming in your language
              </Text>
            </View>

            <View
              style={[
                { width: 20, height: 20 },
                { borderRadius: 10 },
                BORDER.base,
                {
                  borderColor:
                    selectedLanguage === language.code
                      ? COLORS.primary
                      : COLORS.border,
                  backgroundColor:
                    selectedLanguage === language.code
                      ? COLORS.primary
                      : COLORS.white,
                },
                GLOBAL.alignCenter,
                GLOBAL.justifyCenter,
              ]}
            >
              {selectedLanguage === language.code && (
                <View
                  style={[
                    { width: 8, height: 8 },
                    { borderRadius: 4 },
                    { backgroundColor: COLORS.white },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderOnboardingStep = () => {
    const imageStepIndex = currentStep - 1;
    const stepData = onboardingSteps[imageStepIndex];

    return (
      <View
        style={[
          GLOBAL.alignCenter,
          MARGIN.bottom(20),
          { width: '100%', maxWidth: 400 },
        ]}
      >
        <View
          style={[
            { width: 300, height: 300 },
            { borderRadius: 150 },
            { overflow: 'hidden' },
            MARGIN.bottom(20),
            { backgroundColor: '#E8F5E8' },
            GLOBAL.alignCenter,
            GLOBAL.justifyCenter,
          ]}
        >
          <Image
            source={{ uri: stepData.image }}
            style={[{ width: '100%', height: '100%' }]}
            resizeMode="cover"
          />
        </View>

        <Text
          style={[
            TYPOGRAPHY.custom({
              fontSize: 24,
              color: COLORS.text,
              fontWeight: 'bold',
            }),
            MARGIN.bottom(12),
            TEXT_ALIGN.center,
          ]}
        >
          {stepData.title}
        </Text>

        <Text
          style={[
            TYPOGRAPHY.custom({
              color: COLORS.textSecondary,
              fontSize: 16,
            }),
            { lineHeight: 24 },
            MARGIN.bottom(20),
            TEXT_ALIGN.center,
            PADDING.horizontal(16),
          ]}
        >
          {stepData.description}
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    if (currentStep === 0) {
      return renderLanguageSelection();
    } else if (currentStep === 1) {
      return renderOnboardingStep();
    } else if (currentStep === 2) {
      return renderOnboardingStep();
    } else if (currentStep === 3) {
      return renderOnboardingStep();
    }
  };

  return (
    <View style={[GLOBAL.flex, { backgroundColor: COLORS.white }]}>
      <ScrollView
        contentContainerStyle={[
          GLOBAL.flexGrow,
          GLOBAL.justifyCenter,
          GLOBAL.alignCenter,
          PADDING.horizontal(20),
          PADDING.top(40),
          PADDING.bottom(100),
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[GLOBAL.alignCenter, MARGIN.bottom(20)]}>
          <View
            style={[
              { width: 60, height: 60 },
              { borderRadius: 30 },
              { backgroundColor: '#4CAF50' },
              GLOBAL.alignCenter,
              GLOBAL.justifyCenter,
              MARGIN.bottom(10),
            ]}
          >
            <Text
              style={[TYPOGRAPHY.custom({ fontSize: 24, color: COLORS.white })]}
            >
              🌱
            </Text>
          </View>
        </View>

        {renderContent()}
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View
        style={[
          GLOBAL.absolute,
          { bottom: 0, left: 0, right: 0 },
          { backgroundColor: COLORS.white },
          PADDING.horizontal(20),
          PADDING.vertical(20),
          PADDING.bottom(40),
          BORDER.top,
          GLOBAL.flexRow,
          GLOBAL.justifyBetween,
          GLOBAL.alignCenter,
        ]}
      >
        <TouchableOpacity
          style={PADDING.customLTRB(16, 12, 16, 12)}
          onPress={handleSkip}
        >
          <Text
            style={[
              TYPOGRAPHY.custom({
                color: COLORS.textSecondary,
                fontSize: 16,
              }),
            ]}
          >
            Skip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            BUTTON.base,
            {
              backgroundColor: COLORS.primary,
              borderRadius: RADIUS.lg,
              minWidth: 120,
            },
            SHADOW.md,
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              TYPOGRAPHY.custom({
                color: COLORS.white,
                fontSize: 16,
              }),
            ]}
          >
            {currentStep === 4 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
