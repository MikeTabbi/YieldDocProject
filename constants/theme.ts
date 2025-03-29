import { Platform, Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Base size for iPhone 13 (390 points width)
const scale = SCREEN_WIDTH / 390;

export function normalize(size: number): number {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// Minimum touch target size (44x44 points)
export const MIN_TOUCH_SIZE = 44;

export const colors = {
  primary: '#C9F290',
  background: '#FAFAFA',
  text: '#2C2C2C',
  accent: '#A4E581',
  warning: '#FFEB99',
  error: '#FF7675',
};

export const typography = {
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: normalize(24),
    lineHeight: normalize(32),
    letterSpacing: -0.5,
  },
  subheading: {
    fontFamily: 'Inter-SemiBold',
    fontSize: normalize(18),
    lineHeight: normalize(24),
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: normalize(16),
    lineHeight: normalize(24),
  },
  caption: {
    fontFamily: 'Inter-Medium',
    fontSize: normalize(14),
    lineHeight: normalize(20),
  },
};

export const spacing = {
  xs: normalize(4),
  sm: normalize(8),
  md: normalize(16),
  lg: normalize(24),
  xl: normalize(32),
};

export const layout = {
  maxContentWidth: 800,
  minTouchableSize: MIN_TOUCH_SIZE,
  screenPadding: normalize(16),
  borderRadius: {
    sm: normalize(4),
    md: normalize(8),
    lg: normalize(12),
    xl: normalize(16),
  },
};

export const shadows = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  }),
};

export const hitSlop = {
  top: 8,
  bottom: 8,
  left: 8,
  right: 8,
};