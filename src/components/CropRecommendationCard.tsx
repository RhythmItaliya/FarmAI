import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  COLORS,
  GLOBAL,
  TYPOGRAPHY,
  SPACING,
  PADDING,
  MARGIN,
  RADIUS,
} from '@/constants/globalStyle';

export interface CropRecommendation {
  id: string;
  name: string;
  variety: string;
  season: string;
  suitability: number;
  yield: string;
  duration: string;
  icon: string;
  color: string;
  description: string;
  benefits: string[];
}

interface CropRecommendationCardProps {
  crop: CropRecommendation;
  onPress?: (crop: CropRecommendation) => void;
  onGetGuide?: (crop: CropRecommendation) => void;
}

export const CropRecommendationCard: React.FC<CropRecommendationCardProps> = ({
  crop,
  onPress,
  onGetGuide,
}) => {
  const handleCardPress = () => {
    onPress?.(crop);
  };

  const handleGetGuidePress = () => {
    onGetGuide?.(crop);
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={[
        {
          width: 300,
          backgroundColor: COLORS.white,
          borderRadius: RADIUS.lg,
          borderWidth: 1,
          borderColor: COLORS.lightGray,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
      ]}
    >
      {/* Header with crop icon and suitability */}
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
                backgroundColor: crop.color + '20',
                borderRadius: 20,
                width: 40,
                height: 40,
              },
              GLOBAL.alignCenter,
              GLOBAL.justifyCenter,
              MARGIN.right(SPACING.sm),
            ]}
          >
            <Icon name={crop.icon} size={20} color={crop.color} />
          </View>
          <View>
            <Text style={[TYPOGRAPHY.subheading, { color: COLORS.text }]}>
              {crop.name}
            </Text>
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
              {crop.variety}
            </Text>
          </View>
        </View>
        <View style={[GLOBAL.alignCenter]}>
          <Text
            style={[TYPOGRAPHY.heading, { color: crop.color, fontSize: 18 }]}
          >
            {crop.suitability}%
          </Text>
          <Text
            style={[
              TYPOGRAPHY.caption,
              { color: COLORS.textSecondary, fontSize: 10 },
            ]}
          >
            Match
          </Text>
        </View>
      </View>

      {/* Description */}
      <View style={[PADDING.horizontalMd, PADDING.bottom(SPACING.sm)]}>
        <Text
          style={[
            TYPOGRAPHY.caption,
            { color: COLORS.textSecondary, lineHeight: 16 },
          ]}
        >
          {crop.description}
        </Text>
      </View>

      {/* Crop Details */}
      <View style={[PADDING.horizontalMd, PADDING.bottom(SPACING.sm)]}>
        <View
          style={[
            GLOBAL.flexRow,
            GLOBAL.justifyBetween,
            PADDING.vertical(SPACING.xs),
          ]}
        >
          <View style={[GLOBAL.flexRow, GLOBAL.alignCenter]}>
            <Icon
              name="schedule"
              size={14}
              color={COLORS.textSecondary}
              style={MARGIN.right(SPACING.xs)}
            />
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
              {crop.duration}
            </Text>
          </View>
          <View style={[GLOBAL.flexRow, GLOBAL.alignCenter]}>
            <Icon
              name="trending-up"
              size={14}
              color={COLORS.textSecondary}
              style={MARGIN.right(SPACING.xs)}
            />
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
              {crop.yield} Yield
            </Text>
          </View>
        </View>
        <View
          style={[
            GLOBAL.flexRow,
            GLOBAL.alignCenter,
            PADDING.vertical(SPACING.xs),
          ]}
        >
          <Icon
            name="wb-sunny"
            size={14}
            color={COLORS.textSecondary}
            style={MARGIN.right(SPACING.xs)}
          />
          <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
            {crop.season} Season
          </Text>
        </View>
      </View>

      {/* Benefits */}
      <View style={[PADDING.horizontalMd, PADDING.bottom(SPACING.md)]}>
        <View style={[GLOBAL.flexRow, GLOBAL.flexWrap]}>
          {crop.benefits.map((benefit, benefitIndex) => (
            <View
              key={benefitIndex}
              style={[
                {
                  backgroundColor: crop.color + '15',
                  paddingHorizontal: SPACING.sm,
                  paddingVertical: SPACING.xs,
                  borderRadius: RADIUS.sm,
                  marginRight: SPACING.xs,
                  marginBottom: SPACING.xs,
                },
              ]}
            >
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  { color: crop.color, fontSize: 10 },
                ]}
              >
                {benefit}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Button */}
      <View style={[PADDING.horizontalMd, PADDING.bottom(SPACING.md)]}>
        <TouchableOpacity
          onPress={handleGetGuidePress}
          style={[
            {
              backgroundColor: crop.color,
              paddingVertical: SPACING.sm,
              borderRadius: RADIUS.md,
            },
            GLOBAL.alignCenter,
          ]}
        >
          <Text
            style={[
              TYPOGRAPHY.caption,
              { color: COLORS.white, fontWeight: '600' },
            ]}
          >
            Get Planting Guide
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CropRecommendationCard;
