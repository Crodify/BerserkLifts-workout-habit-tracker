import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { DashboardIcon, WorkoutIcon, HabitIcon, ProgressIcon, ProfileIcon } from '@/components/TabIcons';

const TabIcon = ({
  IconComponent,
  label,
  focused
}: {
  IconComponent: React.ComponentType<{ focused: boolean; size: number }>;
  label: string;
  focused: boolean;
}) => (
  <View style={[styles.tabItem, focused && styles.tabItemActive]}>
    <IconComponent focused={focused} size={24} />
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
      {label}
    </Text>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={DashboardIcon} label="Dashboard" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={WorkoutIcon} label="Workouts" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={HabitIcon} label="Habits" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={ProgressIcon} label="Progress" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={ProfileIcon} label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0D0D0D',
    borderTopWidth: 0,
    height: 75,
    paddingBottom: 12,
    paddingTop: 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tabItemActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});
