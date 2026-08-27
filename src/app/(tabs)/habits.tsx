import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { getToday, formatDate } from '@/utils';

export default function HabitsScreen() {
  const { habits, toggleHabit } = useStore();
  const today = getToday();

  const getStreak = (completedDates: string[]) => {
    if (completedDates.length === 0) return 0;
    const sorted = [...completedDates].sort().reverse();
    let streak = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = new Date(sorted[i]);
      const prev = new Date(sorted[i + 1]);
      const diff = (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  };

  const getWeekDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Habits</Text>

      {/* Weekly Overview */}
      <View style={styles.weekCard}>
        <Text style={styles.weekTitle}>This Week</Text>
        <View style={styles.weekRow}>
          {weekDates.map((date, idx) => {
            const isCompleted = habits.every((h) => h.completedDates.includes(date));
            const isToday = date === today;
            return (
              <View key={date} style={styles.dayColumn}>
                <Text style={styles.dayName}>{dayNames[new Date(date).getDay()]}</Text>
                <View
                  style={[
                    styles.dayCircle,
                    isCompleted && styles.dayCircleCompleted,
                    isToday && styles.dayCircleToday,
                  ]}
                >
                  {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Habits List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Habits</Text>
        
        {habits.map((habit) => {
          const isCompletedToday = habit.completedDates.includes(today);
          const streak = getStreak(habit.completedDates);
          
          return (
            <TouchableOpacity
              key={habit.id}
              style={[styles.habitCard, isCompletedToday && styles.habitCardCompleted]}
              onPress={() => toggleHabit(habit.id, today)}
            >
              <View style={styles.habitLeft}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <View>
                  <Text style={[styles.habitName, isCompletedToday && styles.habitNameCompleted]}>
                    {habit.name}
                  </Text>
                  {streak > 0 && (
                    <Text style={styles.streakText}>🔥 {streak} day streak</Text>
                  )}
                </View>
              </View>
              <View style={[styles.checkbox, isCompletedToday && styles.checkboxCompleted]}>
                {isCompletedToday && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Add Habit Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Habit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  weekCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  weekTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleCompleted: {
    backgroundColor: Colors.success,
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  habitCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitCardCompleted: {
    backgroundColor: Colors.surfaceLight,
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  habitName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  habitNameCompleted: {
    color: Colors.textSecondary,
  },
  streakText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
    marginTop: Spacing.xs,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkboxCheck: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
});
