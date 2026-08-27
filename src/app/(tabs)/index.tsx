import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useStore } from '@/store';
import { calculateLevelProgress } from '@/constants/rpg';
import { formatNumber } from '@/utils';

export default function DashboardScreen() {
  const { profile, friends } = useStore();
  const levelProgress = calculateLevelProgress(profile.xp);

  const allFriends = [
    { ...profile, name: 'You', isUser: true },
    ...friends,
  ].sort((a, b) => b.totalVolume - a.totalVolume);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Dashboard</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
           <Text style={styles.statValue}>{profile.level}</Text>
           <Text style={styles.statLabel}>LEVEL</Text>
        </View>
        <View style={styles.statBox}>
           <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
           <Text style={styles.statLabel}>SESSIONS</Text>
        </View>
        <View style={styles.statBox}>
           <Text style={styles.statValue}>{profile.currentStreak}</Text>
           <Text style={styles.statLabel}>STREAK</Text>
        </View>
      </View>
      
      <View style={styles.xpBox}>
        <Text style={styles.xpValue}>{formatNumber(profile.xp)} / XP</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: ${levelProgress}% }]} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>
      </View>
      <View style={styles.table}>
        {allFriends.map((friend, index) => (
          <View key={friend.id} style={styles.row}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.name}>{friend.name}</Text>
            <Text style={styles.volume}>{formatNumber(friend.totalVolume)}kg</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },
  header: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md },
  
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 4, letterSpacing: 0.5 },
  
  xpBox: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.lg },
  xpValue: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  progressBar: { height: 4, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.full },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: BorderRadius.full },
  
  sectionHeader: { marginBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  
  table: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rank: { width: 40, fontSize: FontSize.sm, color: Colors.textMuted },
  name: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  volume: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.accent },
});
