import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const TabIcon = ({ 
  icon, 
  label, 
  focused 
}: { 
  icon: keyof typeof Ionicons.glyphMap; 
  label: string; 
  focused: boolean;
}) => (
  <View style={[styles.tabItem, focused && styles.tabItemActive]}>
    <Ionicons 
      name={icon} 
      size={24} 
      color={focused ? Colors.primary : Colors.textMuted} 
    />
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
            <TabIcon icon={focused ? "grid" : "grid-outline"} label="Dashboard" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={focused ? "barbell" : "barbell-outline"} label="Workouts" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={focused ? "checkmark-circle" : "checkmark-circle-outline"} label="Habits" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={focused ? "stats-chart" : "stats-chart-outline"} label="Progress" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={focused ? "person" : "person-outline"} label="Profile" focused={focused} />
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
