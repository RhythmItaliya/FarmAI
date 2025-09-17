import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import {
  COLORS,
  TYPOGRAPHY,
  GLOBAL,
  SPACING,
  RADIUS,
  SHADOW,
} from '@/constants/globalStyle';

interface BottomBarProps {
  activeTab?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

const tabs: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    route: 'Home',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'person',
    route: 'Profile',
  },
];

const BottomBar: React.FC<BottomBarProps> = ({ activeTab = 'home' }) => {
  const { navigate } = useAppNavigation();

  const handleTabPress = (tab: TabItem) => {
    // Immediate navigation for tab switching
    navigate(tab.route);
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white }}>
      <View
        style={[
          {
            backgroundColor: COLORS.white,
            paddingHorizontal: SPACING.sm,
            paddingVertical: SPACING.sm,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            ...SHADOW.sm,
          },
        ]}
      >
        <View
          style={[GLOBAL.flexRow, GLOBAL.justifyBetween, GLOBAL.alignCenter]}
        >
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;

            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabPress(tab)}
                activeOpacity={0.7}
                style={[
                  {
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: SPACING.sm,
                    borderRadius: RADIUS.sm,
                    backgroundColor: isActive
                      ? 'rgba(46, 125, 50, 0.1)'
                      : 'transparent',
                    transform: [{ scale: isActive ? 1.02 : 1 }],
                  },
                ]}
              >
                <Icon
                  name={tab.icon}
                  size={24}
                  color={isActive ? COLORS.primary : COLORS.gray}
                />
                <Text
                  style={[
                    TYPOGRAPHY.custom({
                      fontSize: 10,
                      color: isActive ? COLORS.primary : COLORS.gray,
                      fontWeight: isActive ? '600' : '400',
                    }),
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BottomBar;
