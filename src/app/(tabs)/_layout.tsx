import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { calculateLevelProgress } from '@/constants/rpg';

const TabIcon = ({ icon, label, focused }: { icon: string; label: string; focused: boolean }) => (
  <View style={[styles.tabItem, focused && styles.tabItemActive]}>
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

export default function TabLayout() {
  const profile = useStore((s) => s.profile);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabIcon icon="📊" label="Dashboard" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabIcon icon="💪" label="Workouts" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabIcon icon="✅" label="Habits" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabIcon icon="📈" label="Progress" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    // No background change, just icon color
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabIconActive: {
    // Could add a subtle effect
  },
  tabLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});
