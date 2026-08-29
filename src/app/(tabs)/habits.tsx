import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { AddHabitModal } from '@/components/AddHabitModal';

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental?.(true);

function getStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort().reverse();
  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i]);
    const prev = new Date(sorted[i + 1]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.abs(diff - 1) < 0.5) streak++;
    else break;
  }
  return streak;
}

function getWeekDates(): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function getDayLabel(dateStr: string): string {
  return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date(dateStr).getDay()];
}

export default function HabitsScreen() {
  const { habits, toggleHabit, addHabit, deleteHabit } = useStore();
  const today = new Date().toISOString().split('T')[0];
  const [showAdd, setShowAdd] = useState(false);

  const weekDates = getWeekDates();
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = habits.length;
  const weekCompletion = weekDates.filter(d => habits.length > 0 && habits.every(h => h.completedDates.includes(d))).length;

  const handleToggle = (habitId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleHabit(habitId, today);
  };

  const handleDelete = (habitId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    deleteHabit(habitId);
  };

  const handleCreate = (name: string, icon: string, category?: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addHabit({ name, icon });
  };

  return (
    <View style={st.container}>
      <ScrollView style={st.scroll} contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={st.titlePrefix}>DAILY</Text>
        <Text style={st.title}>HABITS</Text>

        {/* Weekly Overview Card */}
        <View style={st.weekCard}>
          <View style={st.weekHeader}>
            <View>
              <Text style={st.weekLabel}>THIS WEEK</Text>
              <Text style={st.weekTitle}>{weekCompletion} / 7 days</Text>
            </View>
            <View style={st.weekBadge}>
              <Text style={st.weekBadgeTxt}>{Math.round((weekCompletion / 7) * 100)}%</Text>
            </View>
          </View>
          <View style={st.weekRow}>
            {weekDates.map((date) => {
              const allDone = habits.length > 0 && habits.every(h => h.completedDates.includes(date));
              const someDone = habits.some(h => h.completedDates.includes(date));
              const isToday = date === today;
              return (
                <View key={date} style={st.dayCol}>
                  <Text style={st.dayLabel}>{getDayLabel(date)}</Text>
                  <View style={[
                    st.dayCircle,
                    allDone && st.dayCircleComplete,
                    someDone && !allDone && st.dayCirclePartial,
                    isToday && st.dayCircleToday,
                  ]}>
                    {allDone ? <Text style={st.dayCheck}>✓</Text> : null}
                  </View>
                  <Text style={[st.dayNum, isToday && st.dayNumToday]}>
                    {new Date(date).getDate()}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Streak Summary */}
        {habits.length > 0 && (
          <View style={st.streakBar}>
            <Text style={st.streakText}>
              🔥 {completedToday}/{totalHabits} habits today
            </Text>
          </View>
        )}

        {/* Habits List */}
        <Text style={st.sectionTitle}>TODAY'S HABITS</Text>
        {habits.length === 0 ? (
          <View style={st.emptyCard}>
            <Text style={st.emptyIcon}>📋</Text>
            <Text style={st.emptyTitle}>No habits yet</Text>
            <Text style={st.emptySub}>Create habits to build your daily routine</Text>
          </View>
        ) : (
          habits.map((habit) => {
            const done = habit.completedDates.includes(today);
            const streak = getStreak(habit.completedDates);
            return (
              <TouchableOpacity
                key={habit.id}
                style={[st.habitCard, done && st.habitCardDone]}
                onPress={() => handleToggle(habit.id)}
                onLongPress={() => handleDelete(habit.id)}
                activeOpacity={0.7}
              >
                <View style={st.habitLeft}>
                  <View style={[st.habitIconWrap, done && st.habitIconWrapDone]}>
                    <Text style={st.habitIcon}>{habit.icon}</Text>
                  </View>
                  <View style={st.habitInfo}>
                    <Text style={[st.habitName, done && st.habitNameDone]}>{habit.name}</Text>
                    {streak > 0 && (
                      <Text style={st.streakBadge}>🔥 {streak} day streak</Text>
                    )}
                  </View>
                </View>
                <View style={[st.checkbox, done && st.checkboxDone]}>
                  {done && <Text style={st.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <TouchableOpacity style={st.addBtn} onPress={() => setShowAdd(true)}>
          <Text style={st.addBtnTxt}>+ ADD HABIT</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <AddHabitModal visible={showAdd} onClose={() => setShowAdd(false)} onCreate={handleCreate} />
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, paddingTop: 60 },
  titlePrefix: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 2, marginBottom: 2 },
  title: { fontSize: FontSize.title, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.lg },

  // Weekly Overview
  weekCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  weekLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 2 },
  weekTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text, marginTop: 2 },
  weekBadge: { backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  weekBadgeTxt: { fontSize: FontSize.md, fontWeight: '900', color: Colors.white },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center' },
  dayLabel: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1, marginBottom: Spacing.sm },
  dayCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.surfaceLight, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  dayCircleComplete: { backgroundColor: Colors.success, borderColor: Colors.success },
  dayCirclePartial: { backgroundColor: Colors.warningSubtle, borderColor: Colors.warning },
  dayCircleToday: { borderColor: Colors.primary, borderWidth: 2 },
  dayCheck: { color: Colors.white, fontSize: 14, fontWeight: '900' },
  dayNum: { fontSize: 10, color: Colors.textMuted, marginTop: Spacing.xs },
  dayNumToday: { color: Colors.primary, fontWeight: '800' },

  // Streak Bar
  streakBar: { backgroundColor: Colors.warningSubtle, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, alignItems: 'center' },
  streakText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.warning },

  // Habits
  sectionTitle: { fontSize: FontSize.md, fontWeight: '900', color: Colors.text, letterSpacing: 1, marginBottom: Spacing.md },
  emptyCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  emptyIcon: { fontSize: 40, marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginBottom: Spacing.xs },
  emptySub: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },
  habitCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  habitCardDone: { backgroundColor: Colors.surfaceLight, borderColor: Colors.success },
  habitLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  habitIconWrap: { width: 44, height: 44, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  habitIconWrapDone: { backgroundColor: Colors.successSubtle, borderColor: Colors.success },
  habitIcon: { fontSize: 22 },
  habitInfo: { flex: 1 },
  habitName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  habitNameDone: { color: Colors.textSecondary },
  streakBadge: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.warning, marginTop: 2 },
  checkbox: { width: 32, height: 32, borderRadius: BorderRadius.sm, borderWidth: 2, borderColor: Colors.borderLight, justifyContent: 'center', alignItems: 'center' },
  checkboxDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkmark: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  addBtn: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  addBtnTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary, letterSpacing: 1 },
});
