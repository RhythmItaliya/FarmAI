import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import {
  isTablet,
  isFoldable,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  deviceType,
  platform,
  orientation,
  isIOS,
  isAndroid,
  isWeb,
  isMobile,
  responsiveSpacing,
  responsiveFontSize,
} from '../utils/responsive';

/**
 * COLORS palette for the project.
 * Usage: style={{ color: COLORS.primary }}
 */
export const COLORS = {
  primary: '#2E7D32', // Forest Green (main brand color)
  secondary: '#8BC34A', // Light Green (accent color)
  background: '#F1F8E9', // Light green-gray (clean, natural)
  surface: '#FFFFFF', // Card/modal backgrounds
  white: '#FFFFFF', // Pure white
  text: '#1B5E20', // Dark green (readable)
  textSecondary: '#4CAF50', // Medium green
  error: '#D32F2F', // Red for errors
  warning: '#FF9800', // Orange for warnings
  success: '#4CAF50', // Green for success
  info: '#2196F3', // Blue for info
  disabled: '#C8E6C9', // Light green-gray
  border: '#C8E6C9', // Soft green border
  card: '#FFFFFF', // Card backgrounds
  gray: '#9E9E9E', // Neutral gray
  lightGray: '#F5F5F5', // Very light gray
  darkGray: '#424242', // Dark gray

  // Gradients (for react-native-linear-gradient)
  primaryGradient: ['#2E7D32', '#4CAF50'], // Forest green to medium green
  secondaryGradient: ['#8BC34A', '#CDDC39'], // Light green to lime
  successGradient: ['#4CAF50', '#A5D6A7'], // Green to light green
  warningGradient: ['#FF9800', '#FFB74D'], // Orange to light orange
  errorGradient: ['#D32F2F', '#EF5350'], // Red to light red
  infoGradient: ['#2196F3', '#64B5F6'], // Blue to light blue
};

/**
 * FONT_FAMILY palette for the project.
 * Usage: style={{ fontFamily: FONT_FAMILY.bold }}
 */
export const FONT_FAMILY = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  italic: 'Poppins-Italic',
};

export const GLOBAL = {
  flex: { flex: 1 },
  flex0: { flex: 0 },
  flexGrow: { flexGrow: 1 },
  flexShrink: { flexShrink: 1 },
  flexRow: { flexDirection: 'row' as const },
  flexRowReverse: { flexDirection: 'row-reverse' as const },
  flexColumn: { flexDirection: 'column' as const },
  flexColumnReverse: { flexDirection: 'column-reverse' as const },
  flexWrap: { flexWrap: 'wrap' as const },
  flexNoWrap: { flexWrap: 'nowrap' as const },
  flexWrapReverse: { flexWrap: 'wrap-reverse' as const },

  justifyStart: { justifyContent: 'flex-start' as const },
  justifyCenter: { justifyContent: 'center' as const },
  justifyEnd: { justifyContent: 'flex-end' as const },
  justifyBetween: { justifyContent: 'space-between' as const },
  justifyAround: { justifyContent: 'space-around' as const },
  justifyEvenly: { justifyContent: 'space-evenly' as const },

  alignStart: { alignItems: 'flex-start' as const },
  alignCenter: { alignItems: 'center' as const },
  alignEnd: { alignItems: 'flex-end' as const },
  alignStretch: { alignItems: 'stretch' as const },
  alignBaseline: { alignItems: 'baseline' as const },

  selfStart: { alignSelf: 'flex-start' as const },
  selfCenter: { alignSelf: 'center' as const },
  selfEnd: { alignSelf: 'flex-end' as const },
  selfStretch: { alignSelf: 'stretch' as const },
  selfBaseline: { alignSelf: 'baseline' as const },
  selfAuto: { alignSelf: 'auto' as const },
  selfFlexStart: { alignSelf: 'flex-start' as const },
  selfFlexEnd: { alignSelf: 'flex-end' as const },

  absolute: { position: 'absolute' as const },
  relative: { position: 'relative' as const },
  absoluteFill: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  // Platform/device/orientation helpers
  platform,
  orientation,
  isPortrait: orientation === 'portrait',
  isLandscape: orientation === 'landscape',
  isIOS,
  isAndroid,
  isWeb,
  isMobile,
  isTablet,
  isFoldable,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  deviceType,
};

/**
 * MARGIN helpers for margin styles.
 * Usage: style={MARGIN.horizontalMd}
 */
export const MARGIN = {
  xs: { margin: responsiveSpacing(4) },
  sm: { margin: responsiveSpacing(8) },
  md: { margin: responsiveSpacing(16) },
  lg: { margin: responsiveSpacing(24) },
  xl: { margin: responsiveSpacing(32) },
  horizontal: (value: number = 16) => ({
    marginHorizontal: responsiveSpacing(value),
  }),
  horizontalSm: { marginHorizontal: responsiveSpacing(8) },
  horizontalMd: { marginHorizontal: responsiveSpacing(16) },
  horizontalLg: { marginHorizontal: responsiveSpacing(24) },
  vertical: (value: number = 16) => ({
    marginVertical: responsiveSpacing(value),
  }),
  verticalSm: { marginVertical: responsiveSpacing(8) },
  verticalMd: { marginVertical: responsiveSpacing(16) },
  verticalLg: { marginVertical: responsiveSpacing(24) },
  top: (value: number = 16) => ({ marginTop: responsiveSpacing(value) }),
  bottom: (value: number = 16) => ({ marginBottom: responsiveSpacing(value) }),
  left: (value: number = 16) => ({ marginLeft: responsiveSpacing(value) }),
  right: (value: number = 16) => ({ marginRight: responsiveSpacing(value) }),
  custom: (all: number) => ({ margin: responsiveSpacing(all) }),
  customLTRB: (l: number, t: number, r: number, b: number) => ({
    marginLeft: responsiveSpacing(l),
    marginTop: responsiveSpacing(t),
    marginRight: responsiveSpacing(r),
    marginBottom: responsiveSpacing(b),
  }),
};

/**
 * PADDING helpers for padding styles.
 * Usage: style={PADDING.verticalSm}
 */
export const PADDING = {
  xs: { padding: responsiveSpacing(4) },
  sm: { padding: responsiveSpacing(8) },
  md: { padding: responsiveSpacing(16) },
  lg: { padding: responsiveSpacing(24) },
  xl: { padding: responsiveSpacing(32) },
  horizontal: (value: number = 16) => ({
    paddingHorizontal: responsiveSpacing(value),
  }),
  horizontalSm: { paddingHorizontal: responsiveSpacing(8) },
  horizontalMd: { paddingHorizontal: responsiveSpacing(16) },
  horizontalLg: { paddingHorizontal: responsiveSpacing(24) },
  vertical: (value: number = 16) => ({
    paddingVertical: responsiveSpacing(value),
  }),
  verticalSm: { paddingVertical: responsiveSpacing(8) },
  verticalMd: { paddingVertical: responsiveSpacing(16) },
  verticalLg: { paddingVertical: responsiveSpacing(24) },
  top: (value: number = 16) => ({ paddingTop: responsiveSpacing(value) }),
  bottom: (value: number = 16) => ({ paddingBottom: responsiveSpacing(value) }),
  left: (value: number = 16) => ({ paddingLeft: responsiveSpacing(value) }),
  right: (value: number = 16) => ({ paddingRight: responsiveSpacing(value) }),
  custom: (all: number) => ({ padding: responsiveSpacing(all) }),
  customLTRB: (l: number, t: number, r: number, b: number) => ({
    paddingLeft: responsiveSpacing(l),
    paddingTop: responsiveSpacing(t),
    paddingRight: responsiveSpacing(r),
    paddingBottom: responsiveSpacing(b),
  }),
};

/**
 * SPACING values for consistent spacing.
 * Usage: style={{ margin: SPACING.md }}
 */
export const SPACING = {
  xs: responsiveSpacing(4),
  sm: responsiveSpacing(8),
  md: responsiveSpacing(16),
  lg: responsiveSpacing(24),
  xl: responsiveSpacing(32),
  custom: (value: number) => responsiveSpacing(value),
};

/**
 * GAP values for flex gap utilities.
 * Usage: style={GAP.md}
 */
export const GAP = {
  xs: { gap: responsiveSpacing(4) },
  sm: { gap: responsiveSpacing(8) },
  md: { gap: responsiveSpacing(16) },
  lg: { gap: responsiveSpacing(24) },
  xl: { gap: responsiveSpacing(32) },
  custom: (value: number) => ({ gap: responsiveSpacing(value) }),
  rowXs: { rowGap: responsiveSpacing(4) },
  rowSm: { rowGap: responsiveSpacing(8) },
  rowMd: { rowGap: responsiveSpacing(16) },
  rowLg: { rowGap: responsiveSpacing(24) },
  rowXl: { rowGap: responsiveSpacing(32) },
  rowCustom: (value: number) => ({ rowGap: responsiveSpacing(value) }),
  columnXs: { columnGap: responsiveSpacing(4) },
  columnSm: { columnGap: responsiveSpacing(8) },
  columnMd: { columnGap: responsiveSpacing(16) },
  columnLg: { columnGap: responsiveSpacing(24) },
  columnXl: { columnGap: responsiveSpacing(32) },
  columnCustom: (value: number) => ({ columnGap: responsiveSpacing(value) }),
};

/**
 * DIVIDER style for horizontal lines.
 * Usage: <View style={DIVIDER} />
 */
export const DIVIDER = {
  height: 1,
  backgroundColor: COLORS.disabled,
  width: '100%',
  marginVertical: responsiveSpacing(12),
};

/**
 * BORDER helpers for border styles.
 * Usage: style={BORDER.base}
 */
export const BORDER = {
  base: { borderWidth: 1, borderColor: COLORS.disabled },
  top: { borderTopWidth: 1, borderColor: COLORS.disabled },
  bottom: { borderBottomWidth: 1, borderColor: COLORS.disabled },
  left: { borderLeftWidth: 1, borderColor: COLORS.disabled },
  right: { borderRightWidth: 1, borderColor: COLORS.disabled },
  radiusSm: { borderRadius: responsiveSpacing(4) },
  radiusMd: { borderRadius: responsiveSpacing(8) },
  radiusLg: { borderRadius: responsiveSpacing(16) },
  radiusXl: { borderRadius: responsiveSpacing(32) },
};

/**
 * TEXT_ALIGN helpers for text alignment.
 * Usage: style={TEXT_ALIGN.center}
 */
export const TEXT_ALIGN = {
  center: { textAlign: 'center' as const },
  left: { textAlign: 'left' as const },
  right: { textAlign: 'right' as const },
  justify: { textAlign: 'justify' as const },
};

/**
 * WIDTH helpers for width styles.
 * Usage: style={WIDTH.full}
 */
export const WIDTH = {
  full: { width: '100%' },
  half: { width: '50%' },
  screen: { width: Dimensions.get('window').width },
  custom: (value: number | string) => ({ width: value }),
};

/**
 * HEIGHT helpers for height styles.
 * Usage: style={HEIGHT.screen}
 */
export const HEIGHT = {
  full: { height: '100%' },
  half: { height: '50%' },
  screen: { height: Dimensions.get('window').height },
  custom: (value: number | string) => ({ height: value }),
};

/**
 * IMAGE helpers for image styles.
 * Usage: style={IMAGE.rounded}
 */
export const IMAGE = {
  rounded: {
    borderRadius: responsiveSpacing(12),
    overflow: 'hidden' as 'hidden',
  },
  cover: { resizeMode: 'cover' as const },
  contain: { resizeMode: 'contain' as const },
};

/**
 * POSITION helpers for position styles.
 * Usage: style={POSITION.absolute}
 */
export const POSITION = {
  absolute: { position: 'absolute' as const },
  relative: { position: 'relative' as const },
  top: (v: number) => ({ top: v }),
  bottom: (v: number) => ({ bottom: v }),
  left: (v: number) => ({ left: v }),
  right: (v: number) => ({ right: v }),
  zIndex: (v: number) => ({ zIndex: v }),
};

/**
 * Z_INDEX helpers for z-index values.
 * Usage: style={POSITION.zIndex(Z_INDEX.modal)}
 */
export const Z_INDEX = {
  default: 1,
  dropdown: 10,
  modal: 100,
  topBar: 1000,
  custom: (v: number) => v,
};

/**
 * TYPOGRAPHY variants for text styles.
 * Usage: style={TYPOGRAPHY.heading}
 *        style={TYPOGRAPHY.custom({ fontSize: 20, color: COLORS.primary })}
 */
export const TYPOGRAPHY = {
  heading: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: responsiveFontSize(24),
    color: COLORS.text,
  },
  subheading: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: responsiveFontSize(18),
    color: COLORS.text,
  },
  body: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: responsiveFontSize(16),
    color: COLORS.text,
  },
  bodyBold: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: responsiveFontSize(16),
    color: COLORS.text,
  },
  caption: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: responsiveFontSize(12),
    color: COLORS.text,
  },
  captionBold: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: responsiveFontSize(12),
    color: COLORS.text,
  },
  error: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: responsiveFontSize(14),
    color: COLORS.error,
  },
  custom: ({
    fontFamily = FONT_FAMILY.regular,
    fontSize = 16,
    color = COLORS.text,
    fontWeight,
  }: {
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    fontWeight?:
      | 'normal'
      | 'bold'
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900';
  }) => ({
    fontFamily,
    fontSize: responsiveFontSize(fontSize),
    color,
    ...(fontWeight ? { fontWeight } : {}),
  }),
};

/**
 * RADIUS helpers for border radius.
 * Usage: style={{ borderRadius: RADIUS.md }}
 */
export const RADIUS = {
  sm: responsiveSpacing(4),
  md: responsiveSpacing(8),
  lg: responsiveSpacing(16),
  xl: responsiveSpacing(32),
  pill: 9999,
};

/**
 * SHADOW helpers for shadow/elevation.
 * Usage: style={SHADOW.md}
 */
export const SHADOW = {
  sm: {
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 8,
  },
};

/**
 * OPACITY helpers for opacity values.
 * Usage: style={OPACITY.o50}
 */
export const OPACITY = {
  o50: { opacity: 0.5 },
  o75: { opacity: 0.75 },
  o100: { opacity: 1 },
};

/**
 * DISABLED helpers for disabled UI.
 * Usage: style={DISABLED.view}
 */
export const DISABLED = {
  view: { opacity: 0.5 },
  text: { color: COLORS.disabled },
};

/**
 * BUTTON base style for consistent buttons.
 * Usage: style={BUTTON.base}
 */
export const BUTTON = {
  base: {
    paddingVertical: responsiveSpacing(12),
    paddingHorizontal: responsiveSpacing(24),
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  text: {
    color: COLORS.surface,
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: responsiveFontSize(16),
  },
  disabled: {
    backgroundColor: COLORS.disabled,
  },
};

/**
 * CARD base style for cards/containers.
 * Usage: style={CARD.base}
 */
export const CARD = {
  base: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: responsiveSpacing(16),
    ...SHADOW.sm,
  },
};
