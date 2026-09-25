import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isAdminEnabled } from '@/api/client';
import type { IconName } from '@/components/icon-button';
import { Fonts, Palette, Spacing } from '@/constants/theme';

const BAR_HEIGHT = 68; // content height; the home-indicator inset is added below

function tabIcon(name: IconName) {
  return function TabIcon({ color }: { color: ColorValue }) {
    return <Feather name={name} size={22} color={color} />;
  };
}

/** Bottom tabs: Home, Heroes, Saved, and Manage (only when the admin key is configured). */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const admin = isAdminEnabled();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.accent,
        tabBarInactiveTintColor: Palette.textMuted,
        tabBarStyle: {
          backgroundColor: Palette.backgroundBar,
          borderTopColor: Palette.border,
          borderTopWidth: 1,
          height: BAR_HEIGHT + insets.bottom,
          paddingTop: Spacing.sm,
        },
        tabBarItemStyle: { paddingVertical: Spacing.xs },
        tabBarLabelStyle: { fontFamily: Fonts.bodyMedium, fontSize: 12, marginTop: 2 },
        sceneStyle: { backgroundColor: Palette.background },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="heroes" options={{ title: 'Heroes', tabBarIcon: tabIcon('grid') }} />
      <Tabs.Screen name="favorites" options={{ title: 'Saved', tabBarIcon: tabIcon('bookmark') }} />
      <Tabs.Screen
        name="manage"
        options={{ title: 'Manage', tabBarIcon: tabIcon('database'), href: admin ? undefined : null }}
      />
    </Tabs>
  );
}
