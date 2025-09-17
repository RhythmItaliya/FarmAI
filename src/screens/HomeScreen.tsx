import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  AppState,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  COLORS,
  GLOBAL,
  TYPOGRAPHY,
  CARD,
  SPACING,
  PADDING,
  MARGIN,
  RADIUS,
  TEXT_ALIGN,
  GAP,
} from '@/constants/globalStyle';
import { AppLayout } from '@/common/components';
import { useGlobalLocation } from '@/hooks/useGlobalLocation';
import {
  CropRecommendationCard,
  CropRecommendation,
} from '@/components/CropRecommendationCard';

const HomeScreen = React.memo(() => {
  const {
    locationState,
    getFormattedLocation,
    requestLocationPermissions,
    permissionState,
    isLocationAvailable,
    getCurrentLocation,
    checkPermissions,
  } = useGlobalLocation();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sample crop recommendations data
  const cropRecommendations: CropRecommendation[] = [
    {
      id: 'wheat',
      name: 'Wheat',
      variety: 'Durum Wheat',
      season: 'Winter',
      suitability: 95,
      yield: 'High',
      duration: '120 days',
      icon: 'eco',
      color: '#4CAF50',
      description: 'Perfect for your soil type and climate',
      benefits: ['High yield', 'Disease resistant', 'Good market price'],
    },
    {
      id: 'corn',
      name: 'Corn',
      variety: 'Sweet Corn',
      season: 'Summer',
      suitability: 88,
      yield: 'Medium',
      duration: '90 days',
      icon: 'local-florist',
      color: '#FF9800',
      description: 'Excellent choice for summer planting',
      benefits: ['Fast growing', 'Drought tolerant', 'High demand'],
    },
    {
      id: 'soybean',
      name: 'Soybean',
      variety: 'Roundup Ready',
      season: 'Spring',
      suitability: 92,
      yield: 'High',
      duration: '100 days',
      icon: 'park',
      color: '#2196F3',
      description: 'Ideal for crop rotation',
      benefits: ['Nitrogen fixing', 'Low maintenance', 'Good profit'],
    },
  ];

  // Check permissions when app becomes active
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // Refresh permissions when app becomes active
        checkPermissions();
        if (permissionState.isLocationEnabled) {
          getCurrentLocation();
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [checkPermissions, getCurrentLocation, permissionState.isLocationEnabled]);

  const handleCardPress = async (cardType: string) => {
    // Check if location is available
    if (!isLocationAvailable || !permissionState.isLocationEnabled) {
      setIsRefreshing(true);

      try {
        // Directly request location permissions without any alerts
        const granted = await requestLocationPermissions();

        // Wait a moment for state to update
        setTimeout(async () => {
          // Re-check permissions and get location
          await checkPermissions();
          if (permissionState.isLocationEnabled) {
            await getCurrentLocation();
          }
          setIsRefreshing(false);
        }, 500);
      } catch (error) {
        setIsRefreshing(false);
        console.log('Location permission request failed:', error);
      }
      return;
    }

    // Navigate to detailed screen with weekly data
    console.log(`Navigate to ${cardType} details`);
    // You can add navigation logic here
  };

  // Handle crop recommendation card press
  const handleCropCardPress = (crop: CropRecommendation) => {
    console.log(`Navigate to ${crop.name} details`);
    // You can add navigation logic here
  };

  // Handle get planting guide press
  const handleGetPlantingGuide = (crop: CropRecommendation) => {
    console.log(`Get planting guide for ${crop.name}`);
    // You can add navigation logic here
  };

  // Check if location is properly available
  const hasLocationPermission =
    permissionState.isLocationEnabled && isLocationAvailable;
  const isLocationLoading = locationState.isLoading || isRefreshing;

  const cardData = [
    {
      id: 'weather',
      title: 'Weather',
      subtitle: 'Today, 17 Sept',
      mainValue: hasLocationPermission
        ? '24°C'
        : isLocationLoading
        ? '...'
        : '--°C',
      secondaryValue: hasLocationPermission
        ? 'Clear • 24°C / 20°C'
        : isLocationLoading
        ? 'Loading...'
        : 'Location required',
      icon: 'wb-sunny',
      iconColor: hasLocationPermission ? '#FFD700' : COLORS.gray,
      borderColor: hasLocationPermission ? '#FFD700' : COLORS.gray,
      location: hasLocationPermission
        ? getFormattedLocation()
        : isLocationLoading
        ? 'Getting location...'
        : 'Tap to enable location',
      needsLocation: true,
    },
    {
      id: 'spraying',
      title: 'Spraying Conditions',
      subtitle: 'Current Status',
      mainValue: hasLocationPermission
        ? 'Moderate'
        : isLocationLoading
        ? '...'
        : '--',
      secondaryValue: hasLocationPermission
        ? 'until 10 pm'
        : isLocationLoading
        ? 'Loading...'
        : 'Location required',
      icon: 'warning',
      iconColor: hasLocationPermission ? '#8D6E63' : COLORS.gray,
      borderColor: hasLocationPermission ? '#FFB3BA' : COLORS.gray,
      location: hasLocationPermission
        ? 'Field A'
        : isLocationLoading
        ? 'Getting location...'
        : 'Tap to enable location',
      needsLocation: true,
    },
    {
      id: 'soil',
      title: 'Soil Health',
      subtitle: 'pH Level',
      mainValue: hasLocationPermission
        ? '6.5'
        : isLocationLoading
        ? '...'
        : '--',
      secondaryValue: hasLocationPermission
        ? 'Good condition'
        : isLocationLoading
        ? 'Loading...'
        : 'Location required',
      icon: 'grass',
      iconColor: hasLocationPermission ? '#4CAF50' : COLORS.gray,
      borderColor: hasLocationPermission ? '#8BC34A' : COLORS.gray,
      location: hasLocationPermission
        ? 'Field B'
        : isLocationLoading
        ? 'Getting location...'
        : 'Tap to enable location',
      needsLocation: true,
    },
    {
      id: 'crop',
      title: 'Crop Status',
      subtitle: 'Wheat Field',
      mainValue: hasLocationPermission
        ? 'Healthy'
        : isLocationLoading
        ? '...'
        : '--',
      secondaryValue: hasLocationPermission
        ? 'Growth: 85%'
        : isLocationLoading
        ? 'Loading...'
        : 'Location required',
      icon: 'eco',
      iconColor: hasLocationPermission ? '#2196F3' : COLORS.gray,
      borderColor: hasLocationPermission ? '#2196F3' : COLORS.gray,
      location: hasLocationPermission
        ? 'Field C'
        : isLocationLoading
        ? 'Getting location...'
        : 'Tap to enable location',
      needsLocation: true,
    },
  ];

  return (
    <AppLayout title="FarmAI" activeTab="home" showBackButton={false}>
      <View style={[GLOBAL.flex, { backgroundColor: COLORS.background }]}>
        {/* Horizontal Scrolling Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[PADDING.horizontalMd, PADDING.verticalMd]}
          style={[GLOBAL.flex]}
        >
          {cardData.map((card, index) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => handleCardPress(card.id)}
              style={[
                {
                  width: 280,
                  height: 200,
                  backgroundColor: COLORS.white,
                  borderRadius: RADIUS.lg,
                  borderWidth: 1,
                  borderColor: card.borderColor,
                  marginRight: index < cardData.length - 1 ? SPACING.md : 0,
                },
              ]}
            >
              {/* Card Header */}
              <View
                style={[
                  PADDING.md,
                  { borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
                ]}
              >
                <Text
                  style={[
                    TYPOGRAPHY.caption,
                    { color: COLORS.textSecondary, marginBottom: SPACING.xs },
                  ]}
                >
                  {card.subtitle}
                </Text>
                <Text style={[TYPOGRAPHY.subheading, { color: COLORS.text }]}>
                  {card.title}
                </Text>
              </View>

              {/* Card Content */}
              <View style={[PADDING.md, GLOBAL.flex, GLOBAL.justifyBetween]}>
                <View
                  style={[
                    GLOBAL.flexRow,
                    GLOBAL.justifyBetween,
                    GLOBAL.alignCenter,
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        TYPOGRAPHY.heading,
                        { fontSize: 28, color: COLORS.text },
                      ]}
                    >
                      {card.mainValue}
                    </Text>
                    <Text
                      style={[
                        TYPOGRAPHY.caption,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      {card.secondaryValue}
                    </Text>
                  </View>
                  <View
                    style={[
                      {
                        backgroundColor: card.iconColor + '20',
                        borderRadius: 25,
                        width: 50,
                        height: 50,
                      },
                      GLOBAL.alignCenter,
                      GLOBAL.justifyCenter,
                    ]}
                  >
                    <Icon name={card.icon} size={24} color={card.iconColor} />
                  </View>
                </View>

                {/* Location/Status Footer */}
                <View
                  style={[
                    GLOBAL.flexRow,
                    GLOBAL.alignCenter,
                    {
                      backgroundColor:
                        card.needsLocation && !hasLocationPermission
                          ? '#FFE0B2'
                          : COLORS.lightGray,
                      padding: SPACING.sm,
                      borderRadius: RADIUS.sm,
                      marginTop: SPACING.sm,
                    },
                  ]}
                >
                  <Icon
                    name={
                      card.needsLocation && !hasLocationPermission
                        ? 'location-off'
                        : 'location-on'
                    }
                    size={16}
                    color={
                      card.needsLocation && !hasLocationPermission
                        ? '#8D6E63'
                        : COLORS.textSecondary
                    }
                    style={MARGIN.right(SPACING.xs)}
                  />
                  <Text
                    style={[
                      TYPOGRAPHY.caption,
                      {
                        color:
                          card.needsLocation && !hasLocationPermission
                            ? '#8D6E63'
                            : COLORS.textSecondary,
                        flex: 1,
                        fontWeight:
                          card.needsLocation && !hasLocationPermission
                            ? '600'
                            : 'normal',
                      },
                    ]}
                  >
                    {card.location}
                  </Text>
                  <Icon
                    name={
                      card.needsLocation && !hasLocationPermission
                        ? 'add'
                        : 'chevron-right'
                    }
                    size={16}
                    color={
                      card.needsLocation && !hasLocationPermission
                        ? '#8D6E63'
                        : COLORS.textSecondary
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Crop Recommendations Section */}
        <View style={[PADDING.horizontalMd, PADDING.bottom(SPACING.lg)]}>
          <View
            style={[
              GLOBAL.flexRow,
              GLOBAL.justifyBetween,
              GLOBAL.alignCenter,
              PADDING.bottom(SPACING.md),
            ]}
          >
            <Text
              style={[TYPOGRAPHY.heading, { color: COLORS.text, fontSize: 22 }]}
            >
              Crop Recommendations
            </Text>
            <TouchableOpacity style={[GLOBAL.flexRow, GLOBAL.alignCenter]}>
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  { color: COLORS.primary, marginRight: SPACING.xs },
                ]}
              >
                View All
              </Text>
              <Icon name="chevron-right" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: SPACING.md }}
          >
            {cropRecommendations.map((crop, index) => (
              <View
                key={crop.id}
                style={{
                  marginRight:
                    index < cropRecommendations.length - 1 ? SPACING.md : 0,
                }}
              >
                <CropRecommendationCard
                  crop={crop}
                  onPress={handleCropCardPress}
                  onGetGuide={handleGetPlantingGuide}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Stats Row */}
        <View style={[PADDING.horizontalMd, PADDING.bottom(SPACING.lg)]}>
          <View style={[GLOBAL.flexRow, GLOBAL.justifyBetween]}>
            <View style={[GLOBAL.alignCenter]}>
              <Text
                style={[
                  TYPOGRAPHY.heading,
                  { color: COLORS.text, fontSize: 20 },
                ]}
              >
                7
              </Text>
              <Text
                style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}
              >
                Fields
              </Text>
            </View>
            <View style={[GLOBAL.alignCenter]}>
              <Text
                style={[
                  TYPOGRAPHY.heading,
                  { color: COLORS.text, fontSize: 20 },
                ]}
              >
                85%
              </Text>
              <Text
                style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}
              >
                Health
              </Text>
            </View>
            <View style={[GLOBAL.alignCenter]}>
              <Text
                style={[
                  TYPOGRAPHY.heading,
                  { color: COLORS.text, fontSize: 20 },
                ]}
              >
                3
              </Text>
              <Text
                style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}
              >
                Alerts
              </Text>
            </View>
            <View style={[GLOBAL.alignCenter]}>
              <Text
                style={[
                  TYPOGRAPHY.heading,
                  { color: COLORS.text, fontSize: 20 },
                ]}
              >
                12
              </Text>
              <Text
                style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}
              >
                Tasks
              </Text>
            </View>
          </View>
        </View>
      </View>
    </AppLayout>
  );
});

export default HomeScreen;
