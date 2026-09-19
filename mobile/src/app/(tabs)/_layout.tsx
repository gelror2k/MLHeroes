import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, StyleSheet, type ColorValue } from 'react-native';

import { isAdminEnabled } from '@/api/client';
import { useTheme } from '@/hooks/use-theme';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(active: IconName, inactive: IconName) {
  return function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={24} color={color} />;
  };
}

/** Header "+" that opens the create form. Only shown when EXPO_PUBLIC_ADMIN_KEY is set. */
function AddHeroButton() {
  const router = useRouter();
  const theme = useTheme();
  if (!isAdminEnabled()) return null;
  return (
    <Pressable
      onPress={() => router.push('/hero/form')}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Add hero"
      style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}>
      <Ionicons name="add" size={26} color={theme.tint} />
    </Pressable>
  );
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
        options={{ title: 'Heroes', tabBarIcon: tabIcon('grid', 'grid-outline'), headerRight: AddHeroButton }}
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

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 12,
    padding: 4,
  },
  pressed: {
    opacity: 0.6,
  },
});
