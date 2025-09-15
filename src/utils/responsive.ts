import { Dimensions, PixelRatio, Platform, ScaledSize } from 'react-native';
import { useEffect, useState, useMemo } from 'react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const breakpoints = {
  verySmall: 320,
  small: 375,
  medium: 414,
  large: 480,
  tablet: 600,
  foldable: 720,
  desktop: 1024,
};

export const scale = (size: number) =>
  (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size: number) =>
  (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const ms = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;
export const responsiveSpacing = (size: number) => scale(size);
export const responsiveFontSize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(scale(size)));

export const platform = Platform.OS;
export const isIOS = platform === 'ios';
export const isAndroid = platform === 'android';
export const isWeb = platform === 'web';
export const isMobile = isIOS || isAndroid;

export const isTablet = SCREEN_WIDTH >= breakpoints.tablet;
export const isFoldable =
  SCREEN_WIDTH >= breakpoints.foldable && SCREEN_WIDTH < breakpoints.desktop;
export const isSmallDevice = SCREEN_WIDTH <= breakpoints.verySmall;
export const isMediumDevice =
  SCREEN_WIDTH > breakpoints.verySmall && SCREEN_WIDTH < breakpoints.large;
export const isLargeDevice =
  SCREEN_WIDTH >= breakpoints.large && SCREEN_WIDTH < breakpoints.tablet;

export type DeviceType =
  | 'verySmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'tablet'
  | 'foldable'
  | 'desktop';

// Helper function to determine device type based on width
const getDeviceType = (width: number): DeviceType => {
  if (width < breakpoints.verySmall) return 'verySmall';
  if (width < breakpoints.small) return 'small';
  if (width < breakpoints.medium) return 'medium';
  if (width < breakpoints.large) return 'large';
  if (width < breakpoints.tablet) return 'tablet';
  if (width < breakpoints.foldable) return 'foldable';
  return 'desktop';
};

export const deviceType: DeviceType = getDeviceType(SCREEN_WIDTH);

export type Orientation = 'portrait' | 'landscape';
export const orientation: Orientation =
  SCREEN_WIDTH < SCREEN_HEIGHT ? 'portrait' : 'landscape';

/**
 * useResponsive: Only use this hook in components that need to react to orientation/device changes.
 */
export function useResponsive() {
  const [dimensions, setDimensions] = useState<ScaledSize>(
    Dimensions.get('window')
  );
  const [currentOrientation, setCurrentOrientation] = useState<Orientation>(
    dimensions.width < dimensions.height ? 'portrait' : 'landscape'
  );
  const [currentDeviceType, setCurrentDeviceType] = useState<DeviceType>(() =>
    getDeviceType(dimensions.width)
  );

  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
      setCurrentOrientation(
        window.width < window.height ? 'portrait' : 'landscape'
      );
      setCurrentDeviceType(getDeviceType(window.width));
    };
    const sub = Dimensions.addEventListener('change', onChange);
    return () => {
      if (sub && typeof sub.remove === 'function') sub.remove();
    };
  }, []);

  return {
    width: dimensions.width,
    height: dimensions.height,
    orientation: currentOrientation,
    deviceType: currentDeviceType,
    platform,
    isIOS,
    isAndroid,
    isWeb,
    isMobile,
    isTablet: currentDeviceType === 'tablet',
    isFoldable: currentDeviceType === 'foldable',
    isSmallDevice: currentDeviceType === 'verySmall',
    isMediumDevice: currentDeviceType === 'medium',
    isLargeDevice: currentDeviceType === 'large',
  };
}
