import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_FAMILY, RADIUS, SHADOW } from '../constants/globalStyle';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  type?: ToastType;
  durationMs?: number;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider>');
  }
  return ctx;
};

// Global registration so utilities can trigger toast without hook usage
let globalShowToast:
  | ((message: string, options?: ToastOptions) => void)
  | null = null;
export const showGlobalToast = (message: string, options?: ToastOptions) => {
  if (globalShowToast) {
    globalShowToast(message, options);
  } else if (__DEV__) {
    console.log('[Toast]', options?.type || 'info', message);
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<ToastType>('info');
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 220,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const showToast = useCallback(
    (msg: string, options?: ToastOptions) => {
      const duration = options?.durationMs ?? 2200;
      setType(options?.type ?? 'info');
      setMessage(msg);

      if (hideTimer.current) clearTimeout(hideTimer.current);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();

      hideTimer.current = setTimeout(hide, duration);
    },
    [hide, opacity, translateY]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  const background =
    type === 'success'
      ? COLORS.success
      : type === 'error'
      ? COLORS.error
      : COLORS.surface;
  const textColor = type === 'info' ? COLORS.text : COLORS.surface;

  return (
    <ToastContext.Provider value={value}>
      <RegisterGlobal showToast={showToast} />
      {children}
      <Animated.View
        style={[styles.container, { transform: [{ translateY }], opacity }]}
      >
        {message ? (
          <View style={[styles.toast, { backgroundColor: background }]}>
            <Text style={[styles.text, { color: textColor }]} numberOfLines={2}>
              {message}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </ToastContext.Provider>
  );
};

const RegisterGlobal: React.FC<{
  showToast: (m: string, o?: ToastOptions) => void;
}> = ({ showToast }) => {
  useEffect(() => {
    globalShowToast = showToast;
    return () => {
      if (globalShowToast === showToast) globalShowToast = null;
    };
  }, [showToast]);
  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    ...SHADOW.md,
  },
  text: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
  },
});

export default ToastProvider;
