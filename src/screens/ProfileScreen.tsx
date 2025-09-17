import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch } from '@/hooks/redux';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useGlobalLocation } from '@/hooks/useGlobalLocation';
import { logoutUser } from '@/common/store/slices/authSlice';
import { AppLayout } from '@/common/components';
import {
  COLORS,
  TYPOGRAPHY,
  PADDING,
  MARGIN,
  GLOBAL,
  SPACING,
  RADIUS,
  CARD,
  BUTTON,
} from '@/constants/globalStyle';

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { navigate } = useAppNavigation();
  const { locationState, getFormattedLocation, isLocationAvailable } =
    useGlobalLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const menuItems = [
    {
      title: 'Edit Profile',
      icon: 'edit',
      onPress: () => navigate('EditProfile'),
    },
    {
      title: 'Settings',
      icon: 'settings',
      onPress: () => navigate('Settings'),
    },
    { title: 'Help & Support', icon: 'help', onPress: () => navigate('Help') },
    { title: 'About', icon: 'info', onPress: () => navigate('About') },
  ];

  return (
    <AppLayout title="Profile" activeTab="profile">
      <ScrollView
        style={[GLOBAL.flex]}
        contentContainerStyle={[PADDING.md]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[CARD.base, MARGIN.bottom(20), GLOBAL.alignCenter]}>
          <View
            style={[
              {
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: COLORS.primary,
                ...GLOBAL.justifyCenter,
                ...GLOBAL.alignCenter,
                marginBottom: SPACING.md,
              },
            ]}
          >
            <Icon name="person" size={32} color={COLORS.white} />
          </View>
          <Text style={[TYPOGRAPHY.heading, MARGIN.bottom(4)]}>
            John Farmer
          </Text>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary }]}>
            john.farmer@example.com
          </Text>
        </View>

        {/* Location Info */}
        <View style={[CARD.base, MARGIN.bottom(16)]}>
          <View style={[GLOBAL.flexRow, GLOBAL.alignCenter, MARGIN.bottom(12)]}>
            <Icon
              name="location-on"
              size={20}
              color={COLORS.primary}
              style={{ marginRight: SPACING.sm }}
            />
            <Text style={[TYPOGRAPHY.subheading, { color: COLORS.primary }]}>
              Current Location
            </Text>
          </View>
          {isLocationAvailable && locationState.coordinates ? (
            <View>
              <Text style={[TYPOGRAPHY.body, MARGIN.bottom(4)]}>
                {getFormattedLocation()}
              </Text>
              <Text
                style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}
              >
                Accuracy: {locationState.accuracy}
              </Text>
              <Text
                style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}
              >
                Status: {locationState.isWatching ? 'Tracking' : 'Static'}
              </Text>
            </View>
          ) : (
            <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary }]}>
              Location not available
            </Text>
          )}
        </View>

        {/* Menu Items */}
        <View style={[CARD.base]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              style={[
                GLOBAL.flexRow,
                GLOBAL.alignCenter,
                GLOBAL.justifyBetween,
                PADDING.vertical(16),
                {
                  borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: COLORS.border,
                },
              ]}
            >
              <View style={[GLOBAL.flexRow, GLOBAL.alignCenter]}>
                <Icon
                  name={item.icon}
                  size={20}
                  color={COLORS.text}
                  style={{ marginRight: SPACING.md }}
                />
                <Text style={[TYPOGRAPHY.body]}>{item.title}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            BUTTON.base,
            {
              backgroundColor: COLORS.error,
              marginTop: SPACING.lg,
            },
          ]}
          onPress={handleLogout}
        >
          <Text style={[BUTTON.text]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
};

export default ProfileScreen;
