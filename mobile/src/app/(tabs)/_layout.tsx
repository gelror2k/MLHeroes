import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(active: IconName, inactive: IconName) {
  return function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={24} color={color} />;
  };
}

/** Bottom tabs: Heroes, Favorites, About. */
export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.background, borderTopColor: theme.border },
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { color: theme.text },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Heroes', tabBarIcon: tabIcon('grid', 'grid-outline') }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ title: 'Favorites', tabBarIcon: tabIcon('heart', 'heart-outline') }}
      />
      <Tabs.Screen
        name="about"
        options={{ title: 'About', tabBarIcon: tabIcon('information-circle', 'information-circle-outline') }}
      />
    </Tabs>
  );
}
