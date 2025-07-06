// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface Goal {
  id: string;
  title: string;
  completed: boolean;
  emoji: string;
}

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  emoji: string;
}

export default function Dashboard() {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Wake up between 6 to 7 am', completed: false, emoji: '☀️' },
    { id: '2', title: 'Sleep between 10:30 to 11 pm', completed: true, emoji: '🌙' },
    { id: '3', title: 'Finish Array practice', completed: false, emoji: '💻' },
    { id: '4', title: 'Work on Etude 5 elevators', completed: true, emoji: '🎵' },
    { id: '5', title: 'Finish Etude 3 string', completed: false, emoji: '🎸' },
    { id: '6', title: 'Understand 343 robots', completed: false, emoji: '🤖' },
  ]);

  const [upcomingTasks] = useState<Task[]>([
    { id: '1', title: 'Math Assignment Due', category: 'Mathematics', priority: 'high', dueDate: 'Today' },
    { id: '2', title: 'History Essay', category: 'History', priority: 'medium', dueDate: 'Tomorrow' },
    { id: '3', title: 'Science Lab Report', category: 'Science', priority: 'low', dueDate: 'This Week' },
  ]);

  const [milestones] = useState<Milestone[]>([
    { id: '1', title: 'woke up early', emoji: '☀️' },
    { id: '2', title: 'slept early', emoji: '🌙' },
    { id: '3', title: 'midsem break', emoji: '📚' },
    { id: '4', title: 'my birthday', emoji: '🎂' },
  ]);

  const toggleGoal = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: currentTheme.colors.textSecondary }]}>
              Good Morning
            </Text>
            <Text style={[styles.userName, { color: currentTheme.colors.text }]}>
              {user?.name} ✨
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.aiButton, { backgroundColor: currentTheme.colors.surface }]}
            onPress={() => router.push('/ai-assistant')}
          >
            <MaterialIcons name="psychology" size={24} color={currentTheme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quote */}
        <View style={[styles.quoteContainer, { backgroundColor: currentTheme.colors.surface }]}>
          <Text style={[styles.quote, { color: currentTheme.colors.text }]}>
            "I press on toward the goal for the prize of the upward call of God in Christ Jesus." (Phil 3:14)
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/timer')}
          >
            <LinearGradient
              colors={currentTheme.colors.timerGradient}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="timer" size={24} color="white" />
              <Text style={styles.actionText}>Focus Timer</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/planner')}
          >
            <LinearGradient
              colors={currentTheme.colors.gradient}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="calendar-today" size={24} color="white" />
              <Text style={styles.actionText}>Schedule</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            GOALS
          </Text>
          <View style={[styles.card, { backgroundColor: currentTheme.colors.surface }]}>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={styles.goalItem}
                onPress={() => toggleGoal(goal.id)}
              >
                <MaterialIcons
                  name={goal.completed ? 'check-box' : 'check-box-outline-blank'}
                  size={20}
                  color={goal.completed ? currentTheme.colors.primary : currentTheme.colors.textSecondary}
                />
                <Text style={[
                  styles.goalText,
                  { 
                    color: goal.completed ? currentTheme.colors.textSecondary : currentTheme.colors.text,
                    textDecorationLine: goal.completed ? 'line-through' : 'none'
                  }
                ]}>
                  {goal.title}
                </Text>
                <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            UPCOMING
          </Text>
          <View style={[styles.card, { backgroundColor: currentTheme.colors.surface }]}>
            {upcomingTasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskTitle, { color: currentTheme.colors.text }]}>
                    {task.title}
                  </Text>
                  <Text style={[styles.taskCategory, { color: currentTheme.colors.textSecondary }]}>
                    {task.category} • {task.dueDate}
                  </Text>
                </View>
                <View style={[
                  styles.priorityIndicator,
                  { backgroundColor: 
                    task.priority === 'high' ? '#FF6B6B' :
                    task.priority === 'medium' ? '#FFB366' : '#A8E6CF'
                  }
                ]} />
              </View>
            ))}
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            MILESTONES
          </Text>
          <View style={[styles.card, { backgroundColor: currentTheme.colors.surface }]}>
            {milestones.map((milestone) => (
              <View key={milestone.id} style={styles.milestoneItem}>
                <Text style={styles.milestoneEmoji}>{milestone.emoji}</Text>
                <Text style={[styles.milestoneTitle, { color: currentTheme.colors.text }]}>
                  {milestone.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  aiButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, y: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, y: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
    opacity: 0.7,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, y: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  goalText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },
  goalEmoji: {
    fontSize: 16,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskCategory: {
    fontSize: 12,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  milestoneEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  milestoneTitle: {
    fontSize: 15,
  },
});