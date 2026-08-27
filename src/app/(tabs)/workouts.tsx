import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { FadeInView } from '@/components/ProfessionalMotion';

export default function WorkoutsScreen() {
  const { routines, exercises } = useStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FadeInView>
        <Text style={styles.header}>Workouts</Text>
      </FadeInView>

      <FadeInView delay={100}>
        <TouchableOpacity style={styles.emptyButton}>
          <Text style={styles.emptyButtonText}>+ QUICK START</Text>
        </TouchableOpacity>
      </FadeInView>

      <FadeInView delay={200}>
        <Text style={styles.sectionTitle}>SAVED WORKOUTS</Text>
        {routines.map((routine) => (
          <View key={routine.id} style={styles.routineRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.routineName}>{routine.name}</Text>
              <Text style={styles.routineMeta}>{routine.exercises.length} EXERCISES</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>START</Text>
            </TouchableOpacity>
          </View>
        ))}
      </FadeInView>

      <FadeInView delay={300}>
        <Text style={styles.sectionTitle}>EXERCISE LIBRARY</Text>
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{exercise.name}</Text>
              <Text style={styles.meta}>{exercise.muscle.toUpperCase()}</Text>
            </View>
            <Text style={styles.equipment}>{exercise.equipment.toUpperCase()}</Text>
          </View>
        ))}
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },
  header: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.lg },
  
  emptyButton: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', marginBottom: Spacing.xl },
  emptyButtonText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.md },
  
  sectionTitle: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, marginBottom: Spacing.md, letterSpacing: 1 },
  
  routineRow: { flexDirection: 'row', backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  routineName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  routineMeta: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },
  
  row: { flexDirection: 'row', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, alignItems: 'center' },
  name: { fontSize: FontSize.md, color: Colors.text },
  meta: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },
  equipment: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
  
  actionButton: { backgroundColor: Colors.surfaceLight, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm },
  actionButtonText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
});
