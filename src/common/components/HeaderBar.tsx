import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppSelector } from '@/hooks/redux';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import {
  COLORS,
  TYPOGRAPHY,
  GLOBAL,
  SPACING,
  SHADOW,
} from '@/constants/globalStyle';

interface HeaderBarProps {
  title?: string;
  showBackButton?: boolean;
  showUserInfo?: boolean;
  rightComponent?: React.ReactNode;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title = 'FarmAI',
  showBackButton = false,
  showUserInfo = true,
  rightComponent,
}) => {
  const { user } = useAppSelector(state => state.auth);
  const { goBack, navigate } = useAppNavigation();

  const handleProfilePress = () => {
    navigate('Profile');
  };

  const handleNotificationPress = () => {
    navigate('Notifications');
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.primary }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent={false}
      />
      <View
        style={[
          {
            backgroundColor: COLORS.primary,
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.sm,
            ...SHADOW.sm,
          },
        ]}
      >
        <View
          style={[GLOBAL.flexRow, GLOBAL.justifyBetween, GLOBAL.alignCenter]}
        >
          {/* Left Section */}
          <View style={[GLOBAL.flexRow, GLOBAL.alignCenter]}>
            {showBackButton && (
              <TouchableOpacity
                onPress={goBack}
                style={[
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    ...GLOBAL.justifyCenter,
                    ...GLOBAL.alignCenter,
                    marginRight: SPACING.sm,
                  },
                ]}
              >
                <Icon name="arrow-back" size={20} color={COLORS.white} />
              </TouchableOpacity>
            )}

            <View>
              <Text
                style={[
                  TYPOGRAPHY.custom({
                    fontSize: 20,
                    color: COLORS.white,
                    fontWeight: 'bold',
                  }),
                ]}
              >
                {title}
              </Text>
              {showUserInfo && user && (
                <Text
                  style={[
                    TYPOGRAPHY.custom({
                      fontSize: 12,
                      color: 'rgba(255, 255, 255, 0.8)',
                    }),
                  ]}
                >
                  Welcome, {user.username}
                </Text>
              )}
            </View>
          </View>

          {/* Right Section */}
          <View style={[GLOBAL.flexRow, GLOBAL.alignCenter]}>
            {rightComponent || (
              <>
                <TouchableOpacity
                  onPress={handleNotificationPress}
                  style={[
                    {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      ...GLOBAL.justifyCenter,
                      ...GLOBAL.alignCenter,
                      marginRight: SPACING.sm,
                    },
                  ]}
                >
                  <Icon name="notifications" size={20} color={COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleProfilePress}
                  style={[
                    {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      ...GLOBAL.justifyCenter,
                      ...GLOBAL.alignCenter,
                    },
                  ]}
                >
                  <Icon name="person" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HeaderBar;
