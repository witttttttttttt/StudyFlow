// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar } from 'react-native-calendars';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  description?: string;
}

interface ClassPeriod {
  id: string;
  subject: string;
  time: string;
  room: string;
  teacher: string;
  color: string;
}

export default function Planner() {
  const { currentTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
  });

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Calculus Problem Set 3',
      subject: 'Mathematics',
      dueDate: '2025-07-08',
      priority: 'high',
      completed: false,
      description: 'Complete problems 1-15 from chapter 4',
    },
    {
      id: '2',
      title: 'History Essay',
      subject: 'History',
      dueDate: '2025-07-10',
      priority: 'medium',
      completed: false,
      description: 'Write 5-page essay on World War II',
    },
    {
      id: '3',
      title: 'Chemistry Lab Report',
      subject: 'Chemistry',
      dueDate: '2025-07-07',
      priority: 'high',
      completed: true,
      description: 'Submit lab report for titration experiment',
    },
  ]);

  const [todaySchedule] = useState<ClassPeriod[]>([
    {
      id: '1',
      subject: 'Mathematics',
      time: '9:00 - 10:30',
      room: 'Room 201',
      teacher: 'Dr. Smith',
      color: '#FF6B9D',
    },
    {
      id: '2',
      subject: 'History',
      time: '10:45 - 12:15',
      room: 'Room 105',
      teacher: 'Prof. Johnson',
      color: '#667EEA',
    },
    {
      id: '3',
      subject: 'Chemistry',
      time: '1:30 - 3:00',
      room: 'Lab 301',
      teacher: 'Dr. Brown',
      color: '#A8E6CF',
    },
  ]);

  const [todoList, setTodoList] = useState([
    { id: '1', text: 'Review math notes', completed: false },
    { id: '2', text: 'Read history chapter 5', completed: true },
    { id: '3', text: 'Prepare for chemistry quiz', completed: false },
    { id: '4', text: 'Submit assignment online', completed: false },
  ]);

  const addAssignment = () => {
    if (!newAssignment.title.trim() || !newAssignment.subject.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const assignment: Assignment = {
      id: Date.now().toString(),
      title: newAssignment.title,
      subject: newAssignment.subject,
      dueDate: selectedDate,
      priority: newAssignment.priority,
      completed: false,
      description: newAssignment.description,
    };

    setAssignments([...assignments, assignment]);
    setNewAssignment({ title: '', subject: '', description: '', priority: 'medium' });
    setShowAddAssignment(false);
    Alert.alert('Success', 'Assignment added successfully!');
  };

  const toggleAssignment = (id: string) => {
    setAssignments(assignments.map(assignment =>
      assignment.id === id 
        ? { ...assignment, completed: !assignment.completed }
        : assignment
    ));
  };

  const toggleTodo = (id: string) => {
    setTodoList(todoList.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};
    
    assignments.forEach(assignment => {
      marked[assignment.dueDate] = {
        marked: true,
        dotColor: assignment.priority === 'high' ? '#FF6B6B' : 
                 assignment.priority === 'medium' ? '#FFB366' : '#A8E6CF',
      };
    });

    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: currentTheme.colors.primary,
    };

    return marked;
  };

  const getAssignmentsForDate = (date: string) => {
    return assignments.filter(assignment => assignment.dueDate === date);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFB366';
      case 'low': return '#A8E6CF';
      default: return '#A8E6CF';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={currentTheme.colors.gradient}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerTitle}>Study Planner</Text>
          <TouchableOpacity onPress={() => setShowAddAssignment(true)}>
            <MaterialIcons name="add" size={28} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Calendar */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            CALENDAR
          </Text>
          <View style={[styles.card, { backgroundColor: currentTheme.colors.surface }]}>
            <Calendar
              current={selectedDate}
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={getMarkedDates()}
              theme={{
                backgroundColor: currentTheme.colors.surface,
                calendarBackground: currentTheme.colors.surface,
                textSectionTitleColor: currentTheme.colors.text,
                selectedDayBackgroundColor: currentTheme.colors.primary,
                selectedDayTextColor: 'white',
                todayTextColor: currentTheme.colors.primary,
                dayTextColor: currentTheme.colors.text,
                textDisabledColor: currentTheme.colors.textSecondary,
                arrowColor: currentTheme.colors.primary,
                monthTextColor: currentTheme.colors.text,
                textDayFontWeight: '400',
                textMonthFontWeight: '600',
                textDayHeaderFontWeight: '500',
              }}
            />
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            TODAY'S SCHEDULE
          </Text>
          <View style={[styles.card, { backgroundColor: currentTheme.colors.surface }]}>
            {todaySchedule.map((period) => (
              <View key={period.id} style={styles.scheduleItem}>
                <View style={[styles.scheduleColor, { backgroundColor: period.color }]} />
                <View style={styles.scheduleInfo}>
                  <Text style={[styles.scheduleSubject, { color: currentTheme.colors.text }]}>
                    {period.subject}
                  </Text>
                  <Text style={[styles.scheduleDetails, { color: currentTheme.colors.textSecondary }]}>
                    {period.time} • {period.room}
                  </Text>
                  <Text style={[styles.scheduleTeacher, { color: currentTheme.colors.textSecondary }]}>
                    {period.teacher}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Assignments for Selected Date */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            ASSIGNMENTS ({new Date(selectedDate).toLocaleDateString()})
          </Text>
          <View style={[styles.card, { backgroundColor: currentTheme.colors.surface }]}>
            {getAssignmentsForDate(selectedDate).length === 0 ? (
              <Text style={[styles.emptyText, { color: currentTheme.colors.textSecondary }]}>
                No assignments for this date
              </Text>
            ) : (
              getAssignmentsForDate(selectedDate).map((assignment) => (
                <TouchableOpacity
                  key={assignment.id}
                  style={styles.assignmentItem}
                  onPress={() => toggleAssignment(assignment.id)}
                >
                  <MaterialIcons
                    name={assignment.completed ? 'check-box' : 'check-box-outline-blank'}
                    size={20}
                    color={assignment.completed ? currentTheme.colors.primary : currentTheme.colors.textSecondary}
                  />
                  <View style={styles.assignmentInfo}>
                    <Text style={[
                      styles.assignmentTitle,
                      {
                        color: assignment.completed ? currentTheme.colors.textSecondary : currentTheme.colors.text,
                        textDecorationLine: assignment.completed ? 'line-through' : 'none'
                      }
                    ]}>
                      {assignment.title}
                    </Text>
                    <Text style={[styles.assignmentSubject, { color: currentTheme.colors.textSecondary }]}>
                      {assignment.subject}
                    </Text>
                    {assignment.description && (
                      <Text style={[styles.assignmentDescription, { color: currentTheme.colors.textSecondary }]}>
                        {assignment.description}
                      </Text>
                    )}
                  </View>
                  <View style={[
                    styles.priorityIndicator,
                    { backgroundColor: getPriorityColor(assignment.priority) }
                  ]} />
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* Quick Todo List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>
            QUICK TODOS
          </Text>
          <View style={[styles.card, { backgroundColor: currentTheme.colors.surface }]}>
            {todoList.map((todo) => (
              <TouchableOpacity
                key={todo.id}
                style={styles.todoItem}
                onPress={() => toggleTodo(todo.id)}
              >
                <MaterialIcons
                  name={todo.completed ? 'check-box' : 'check-box-outline-blank'}
                  size={20}
                  color={todo.completed ? currentTheme.colors.primary : currentTheme.colors.textSecondary}
                />
                <Text style={[
                  styles.todoText,
                  {
                    color: todo.completed ? currentTheme.colors.textSecondary : currentTheme.colors.text,
                    textDecorationLine: todo.completed ? 'line-through' : 'none'
                  }
                ]}>
                  {todo.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Assignment Modal */}
      <Modal
        visible={showAddAssignment}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: currentTheme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddAssignment(false)}>
              <MaterialIcons name="close" size={24} color={currentTheme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: currentTheme.colors.text }]}>
              Add Assignment
            </Text>
            <TouchableOpacity onPress={addAssignment}>
              <Text style={[styles.saveButton, { color: currentTheme.colors.primary }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: currentTheme.colors.text }]}>
                Title *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: currentTheme.colors.surface,
                    color: currentTheme.colors.text,
                    borderColor: currentTheme.colors.border,
                  }
                ]}
                placeholder="Assignment title"
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={newAssignment.title}
                onChangeText={(text) => setNewAssignment({ ...newAssignment, title: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: currentTheme.colors.text }]}>
                Subject *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: currentTheme.colors.surface,
                    color: currentTheme.colors.text,
                    borderColor: currentTheme.colors.border,
                  }
                ]}
                placeholder="Subject"
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={newAssignment.subject}
                onChangeText={(text) => setNewAssignment({ ...newAssignment, subject: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: currentTheme.colors.text }]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  {
                    backgroundColor: currentTheme.colors.surface,
                    color: currentTheme.colors.text,
                    borderColor: currentTheme.colors.border,
                  }
                ]}
                placeholder="Assignment description"
                placeholderTextColor={currentTheme.colors.textSecondary}
                value={newAssignment.description}
                onChangeText={(text) => setNewAssignment({ ...newAssignment, description: text })}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: currentTheme.colors.text }]}>
                Priority
              </Text>
              <View style={styles.priorityButtons}>
                {['high', 'medium', 'low'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      {
                        backgroundColor: newAssignment.priority === priority 
                          ? getPriorityColor(priority)
                          : currentTheme.colors.surface,
                        borderColor: getPriorityColor(priority),
                      }
                    ]}
                    onPress={() => setNewAssignment({ 
                      ...newAssignment, 
                      priority: priority as 'high' | 'medium' | 'low' 
                    })}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      {
                        color: newAssignment.priority === priority 
                          ? 'white' 
                          : currentTheme.colors.text
                      }
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
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
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  scheduleColor: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  scheduleDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  scheduleTeacher: {
    fontSize: 12,
  },
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  assignmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  assignmentSubject: {
    fontSize: 14,
    marginBottom: 4,
  },
  assignmentDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  todoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});