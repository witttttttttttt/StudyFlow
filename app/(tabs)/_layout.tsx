// Powered by OnSpace.AI
import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export default function TabLayout() {
  const { currentTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: currentTheme.colors.surface,
          borderTopColor: currentTheme.colors.border,
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: currentTheme.colors.primary,
        tabBarInactiveTintColor: currentTheme.colors.textSecondary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="calendar-today" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          title: 'Classes',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="school" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: 'Focus',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}