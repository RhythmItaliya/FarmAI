import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
} from '@/constants/globalStyle';
import { AppLayout } from '@/common/components';
import { useGlobalLocation } from '@/hooks/useGlobalLocation';

interface DetailScreenProps {
  route: {
    params: {
      cardType: string;
      title: string;
    };
  };
  navigation: any;
}

const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { cardType, title } = route.params;
  const { locationState, getFormattedLocation } = useGlobalLocation();

  // Mock weekly data - you can replace with real API calls
  const getWeeklyData = (type: string) => {
    const baseData = {
      weather: [
        {
          day: 'Mon',
          temp: '24°C',
          condition: 'Clear',
          icon: 'wb-sunny',
          color: '#FFD700',
        },
        {
          day: 'Tue',
          temp: '26°C',
          condition: 'Partly Cloudy',
          icon: 'cloud',
          color: '#9E9E9E',
        },
        {
          day: 'Wed',
          temp: '22°C',
          condition: 'Rain',
          icon: 'grain',
          color: '#2196F3',
        },
        {
          day: 'Thu',
          temp: '25°C',
          condition: 'Clear',
          icon: 'wb-sunny',
          color: '#FFD700',
        },
        {
          day: 'Fri',
          temp: '28°C',
          condition: 'Hot',
          icon: 'wb-sunny',
          color: '#FF6B35',
        },
        {
          day: 'Sat',
          temp: '23°C',
          condition: 'Cloudy',
          icon: 'cloud',
          color: '#9E9E9E',
        },
        {
          day: 'Sun',
          temp: '21°C',
          condition: 'Light Rain',
          icon: 'grain',
          color: '#2196F3',
        },
      ],
      spraying: [
        {
          day: 'Mon',
          condition: 'Good',
          time: '6AM-8AM',
          icon: 'check-circle',
          color: '#4CAF50',
        },
        {
          day: 'Tue',
          condition: 'Moderate',
          time: '7AM-9AM',
          icon: 'warning',
          color: '#FF9800',
        },
        {
          day: 'Wed',
          condition: 'Poor',
          time: 'Not Recommended',
          icon: 'cancel',
          color: '#F44336',
        },
        {
          day: 'Thu',
          condition: 'Good',
          time: '6AM-8AM',
          icon: 'check-circle',
          color: '#4CAF50',
        },
        {
          day: 'Fri',
          condition: 'Excellent',
          time: '5AM-9AM',
          icon: 'star',
          color: '#2196F3',
        },
        {
          day: 'Sat',
          condition: 'Moderate',
          time: '7AM-9AM',
          icon: 'warning',
          color: '#FF9800',
        },
        {
          day: 'Sun',
          condition: 'Good',
          time: '6AM-8AM',
          icon: 'check-circle',
          color: '#4CAF50',
        },
      ],
      soil: [
        {
          day: 'Mon',
          ph: '6.5',
          moisture: '65%',
          icon: 'grass',
          color: '#4CAF50',
        },
        {
          day: 'Tue',
          ph: '6.3',
          moisture: '62%',
          icon: 'grass',
          color: '#4CAF50',
        },
        {
          day: 'Wed',
          ph: '6.7',
          moisture: '68%',
          icon: 'grass',
          color: '#4CAF50',
        },
        {
          day: 'Thu',
          ph: '6.4',
          moisture: '64%',
          icon: 'grass',
          color: '#4CAF50',
        },
        {
          day: 'Fri',
          ph: '6.6',
          moisture: '66%',
          icon: 'grass',
          color: '#4CAF50',
        },
        {
          day: 'Sat',
          ph: '6.5',
          moisture: '65%',
          icon: 'grass',
          color: '#4CAF50',
        },
        {
          day: 'Sun',
          ph: '6.4',
          moisture: '63%',
          icon: 'grass',
          color: '#4CAF50',
        },
      ],
      crop: [
        {
          day: 'Mon',
          health: '85%',
          growth: 'Good',
          icon: 'eco',
          color: '#4CAF50',
        },
        {
          day: 'Tue',
          health: '87%',
          growth: 'Excellent',
          icon: 'eco',
          color: '#4CAF50',
        },
        {
          day: 'Wed',
          health: '83%',
          growth: 'Good',
          icon: 'eco',
          color: '#4CAF50',
        },
        {
          day: 'Thu',
          health: '86%',
          growth: 'Good',
          icon: 'eco',
          color: '#4CAF50',
        },
        {
          day: 'Fri',
          health: '88%',
          growth: 'Excellent',
          icon: 'eco',
          color: '#4CAF50',
        },
        {
          day: 'Sat',
          health: '84%',
          growth: 'Good',
          icon: 'eco',
          color: '#4CAF50',
        },
        {
          day: 'Sun',
          health: '85%',
          growth: 'Good',
          icon: 'eco',
          color: '#4CAF50',
        },
      ],
    };
    return baseData[type as keyof typeof baseData] || [];
  };

  const weeklyData = getWeeklyData(cardType);

  const getCurrentLocation = () => {
    return locationState.coordinates
      ? getFormattedLocation()
      : 'Location not available';
  };

  return (
    <AppLayout title={title} activeTab="home" showBackButton={true}>
      <ScrollView style={[GLOBAL.flex, { backgroundColor: COLORS.background }]}>
        {/* Current Status Card */}
        <View style={[PADDING.md]}>
          <View
            style={[
              CARD.base,
              {
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor:
                  cardType === 'weather'
                    ? '#FFD700'
                    : cardType === 'spraying'
                    ? '#FFB3BA'
                    : cardType === 'soil'
                    ? '#8BC34A'
                    : '#2196F3',
                borderRadius: RADIUS.lg,
              },
            ]}
          >
            <View style={[PADDING.lg]}>
              <Text
                style={[TYPOGRAPHY.subheading, { marginBottom: SPACING.sm }]}
              >
                Current Status
              </Text>
              <View
                style={[
                  GLOBAL.flexRow,
                  GLOBAL.justifyBetween,
                  GLOBAL.alignCenter,
                ]}
              >
                <View>
                  <Text style={[TYPOGRAPHY.heading, { fontSize: 24 }]}>
                    {cardType === 'weather'
                      ? '24°C'
                      : cardType === 'spraying'
                      ? 'Moderate'
                      : cardType === 'soil'
                      ? '6.5 pH'
                      : '85%'}
                  </Text>
                  <Text
                    style={[
                      TYPOGRAPHY.caption,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    {getCurrentLocation()}
                  </Text>
                </View>
                <Icon
                  name={
                    cardType === 'weather'
                      ? 'wb-sunny'
                      : cardType === 'spraying'
                      ? 'warning'
                      : cardType === 'soil'
                      ? 'grass'
                      : 'eco'
                  }
                  size={40}
                  color={
                    cardType === 'weather'
                      ? '#FFD700'
                      : cardType === 'spraying'
                      ? '#8D6E63'
                      : cardType === 'soil'
                      ? '#4CAF50'
                      : '#2196F3'
                  }
                />
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Data */}
        <View style={[PADDING.horizontalMd]}>
          <Text
            style={[
              TYPOGRAPHY.subheading,
              { color: COLORS.text, marginBottom: SPACING.md },
            ]}
          >
            7-Day Forecast
          </Text>

          {weeklyData.map((day, index) => (
            <View
              key={index}
              style={[
                CARD.base,
                MARGIN.bottom(SPACING.sm),
                {
                  backgroundColor: COLORS.white,
                  borderRadius: RADIUS.md,
                },
              ]}
            >
              <View
                style={[
                  PADDING.md,
                  GLOBAL.flexRow,
                  GLOBAL.justifyBetween,
                  GLOBAL.alignCenter,
                ]}
              >
                <View style={[GLOBAL.flexRow, GLOBAL.alignCenter]}>
                  <View
                    style={[
                      {
                        backgroundColor: day.color + '20',
                        borderRadius: 20,
                        width: 40,
                        height: 40,
                      },
                      GLOBAL.alignCenter,
                      GLOBAL.justifyCenter,
                      MARGIN.right(SPACING.md),
                    ]}
                  >
                    <Icon name={day.icon} size={20} color={day.color} />
                  </View>
                  <View>
                    <Text style={[TYPOGRAPHY.bodyBold]}>{day.day}</Text>
                    {cardType === 'weather' && (
                      <>
                        <Text
                          style={[
                            TYPOGRAPHY.caption,
                            { color: COLORS.textSecondary },
                          ]}
                        >
                          {day.condition}
                        </Text>
                        <Text style={[TYPOGRAPHY.body, { color: day.color }]}>
                          {day.temp}
                        </Text>
                      </>
                    )}
                    {cardType === 'spraying' && (
                      <>
                        <Text style={[TYPOGRAPHY.body, { color: day.color }]}>
                          {day.condition}
                        </Text>
                        <Text
                          style={[
                            TYPOGRAPHY.caption,
                            { color: COLORS.textSecondary },
                          ]}
                        >
                          {day.time}
                        </Text>
                      </>
                    )}
                    {cardType === 'soil' && (
                      <>
                        <Text style={[TYPOGRAPHY.body, { color: day.color }]}>
                          pH: {day.ph}
                        </Text>
                        <Text
                          style={[
                            TYPOGRAPHY.caption,
                            { color: COLORS.textSecondary },
                          ]}
                        >
                          Moisture: {day.moisture}
                        </Text>
                      </>
                    )}
                    {cardType === 'crop' && (
                      <>
                        <Text style={[TYPOGRAPHY.body, { color: day.color }]}>
                          Health: {day.health}
                        </Text>
                        <Text
                          style={[
                            TYPOGRAPHY.caption,
                            { color: COLORS.textSecondary },
                          ]}
                        >
                          Growth: {day.growth}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={COLORS.textSecondary}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={[PADDING.md, PADDING.bottom(SPACING.xl)]}>
          <TouchableOpacity
            style={[
              {
                backgroundColor: COLORS.primary,
                borderRadius: RADIUS.md,
                padding: SPACING.md,
              },
              GLOBAL.alignCenter,
            ]}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: COLORS.white }]}>
              View Detailed Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default DetailScreen;
