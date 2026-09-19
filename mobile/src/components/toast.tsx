import { Feather } from '@expo/vector-icons';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/components/icon-button';
import { ThemedText } from '@/components/themed-text';
import { Gutter, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Tone = 'success' | 'danger' | 'info';

type ToastValue = {
  show: (message: string, tone?: Tone) => void;
};

const ToastContext = createContext<ToastValue | null>(null);

const ICONS: Record<Tone, IconName> = { success: 'check', danger: 'alert-circle', info: 'info' };
const HIDE_AFTER_MS = 2800;

/** One toast at a time, slid up from above the tab bar. Mount once in the root layout. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ message: string; tone: Tone; key: number } | null>(null);
  const [progress] = useState(() => new Animated.Value(0));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, tone: Tone = 'success') => {
    setToast({ message, tone, key: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (timer.current) clearTimeout(timer.current);
    progress.setValue(0);
    Animated.spring(progress, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 180 }).start();
    timer.current = setTimeout(() => {
      Animated.timing(progress, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setToast(null));
    }, HIDE_AFTER_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [toast, progress]);

  const value = useMemo(() => ({ show }), [show]);
  const toneColor = toast ? { success: theme.success, danger: theme.danger, info: theme.info }[toast.tone] : theme.success;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          accessibilityLiveRegion="polite"
          style={[
            styles.wrap,
            { bottom: insets.bottom + 88 },
            {
              opacity: progress,
              transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
            },
          ]}>
          <View style={[styles.toast, { backgroundColor: theme.backgroundBar, borderColor: theme.border }]}>
            <Feather name={ICONS[toast.tone]} size={20} color={toneColor} />
            <ThemedText type="small" themeColor="textSecondary" style={styles.text}>
              {toast.message}
            </ThemedText>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: Gutter,
    right: Gutter,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  text: {
    flex: 1,
  },
});
