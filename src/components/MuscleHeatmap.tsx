import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { MuscleGroup, getMuscleDisplayName } from '@/utils/muscleMapping';
import { MuscleVolume, getVolumeColor, formatVolume, getVolumeZone, getMaxVolume } from '@/utils/volumeCalc';

interface MuscleHeatmapProps {
  muscleVolumes: MuscleVolume[];
  onMusclePress?: (muscle: MuscleGroup) => void;
}

// Body outline SVG path (simplified human form)
const BODY_OUTLINE = `
M 50,10 
C 55,10 60,15 60,25 
C 60,35 55,40 50,40 
C 45,40 40,35 40,25 
C 40,15 45,10 50,10 Z
M 35,45 
L 15,80 
L 20,82 
L 40,55 
L 40,100 
L 35,100 
L 30,55 
Z
M 65,45 
L 85,80 
L 80,82 
L 60,55 
L 60,100 
L 65,100 
L 70,55 
Z
M 40,42 
L 60,42 
L 62,70 
L 58,72 
L 55,50 
L 45,50 
L 42,72 
L 38,70 
Z
M 42,72 
L 58,72 
L 60,95 
L 55,95 
L 52,75 
L 48,75 
L 45,95 
L 40,95 
Z
`;

export function MuscleHeatmap({ muscleVolumes, onMusclePress }: MuscleHeatmapProps) {
  const maxVolume = getMaxVolume(muscleVolumes);
  
  // Map muscle groups to body positions
  const getMusclePosition = (muscle: MuscleGroup) => {
    const positions: Record<MuscleGroup, { x: number; y: number; width: number; height: number }> = {
      chest: { x: 42, y: 45, width: 16, height: 12 },
      back: { x: 42, y: 45, width: 16, height: 12 },
      shoulders: { x: 35, y: 42, width: 30, height: 8 },
      biceps: { x: 15, y: 55, width: 12, height: 15 },
      triceps: { x: 73, y: 55, width: 12, height: 15 },
      quadriceps: { x: 42, y: 72, width: 16, height: 23 },
      hamstrings: { x: 42, y: 72, width: 16, height: 23 },
      glutes: { x: 40, y: 65, width: 20, height: 10 },
      calves: { x: 42, y: 85, width: 16, height: 10 },
      core: { x: 44, y: 55, width: 12, height: 15 },
      forearms: { x: 10, y: 75, width: 15, height: 8 },
    };
    return positions[muscle];
  };

  const getVolumeForMuscle = (muscle: MuscleGroup): MuscleVolume => {
    return muscleVolumes.find(mv => mv.muscle === muscle) || {
      muscle,
      volume: 0,
      workouts: 0,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MUSCLE ACTIVITY</Text>
        <Text style={styles.subtitle}>VOLUME HEATMAP</Text>
      </View>
      
      <View style={styles.bodyContainer}>
        <Svg width="100" height="110" viewBox="0 0 100 110">
          {/* Body outline */}
          <Path d={BODY_OUTLINE} fill={Colors.surfaceLight} stroke={Colors.border} strokeWidth={0.5} />
          
          {/* Muscle zones */}
          {(['chest', 'shoulders', 'quadriceps', 'core'] as MuscleGroup[]).map(muscle => {
            const pos = getMusclePosition(muscle);
            const volumeData = getVolumeForMuscle(muscle);
            const color = getVolumeColor(volumeData.volume, maxVolume);
            
            return (
              <Rect
                key={muscle}
                x={pos.x}
                y={pos.y}
                width={pos.width}
                height={pos.height}
                fill={color}
                opacity={0.8}
                rx={2}
                onPress={() => onMusclePress?.(muscle)}
              />
            );
          })}
          
          {/* Arms */}
          <Rect x={15} y={50} width={10} height={20} fill={getVolumeColor(getVolumeForMuscle('biceps').volume, maxVolume)} opacity={0.8} rx={2} />
          <Rect x={75} y={50} width={10} height={20} fill={getVolumeColor(getVolumeForMuscle('triceps').volume, maxVolume)} opacity={0.8} rx={2} />
          
          {/* Legs */}
          <Rect x={42} y={72} width={7} height={23} fill={getVolumeColor(getVolumeForMuscle('quadriceps').volume, maxVolume)} opacity={0.8} rx={2} />
          <Rect x={51} y={72} width={7} height={23} fill={getVolumeColor(getVolumeForMuscle('hamstrings').volume, maxVolume)} opacity={0.8} rx={2} />
        </Svg>
        
        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>VOLUME</Text>
          {[
            { label: 'Not Trained', color: '#1C1C21' },
            { label: 'Low', color: '#10B981' },
            { label: 'Medium', color: '#F59E0B' },
            { label: 'High', color: '#F97316' },
            { label: 'Very High', color: '#EF4444' },
          ].map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Muscle details */}
      <View style={styles.muscleList}>
        {muscleVolumes
          .filter(mv => mv.volume > 0)
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 6)
          .map((mv, index) => (
            <TouchableOpacity
              key={mv.muscle}
              style={styles.muscleItem}
              onPress={() => onMusclePress?.(mv.muscle)}
              activeOpacity={0.7}
            >
              <View style={styles.muscleInfo}>
                <Text style={styles.muscleName}>{getMuscleDisplayName(mv.muscle)}</Text>
                <Text style={styles.muscleZone}>{getVolumeZone(mv.volume)}</Text>
              </View>
              <View style={styles.muscleStats}>
                <Text style={styles.muscleVolume}>{formatVolume(mv.volume)} KG</Text>
                <Text style={styles.muscleWorkouts}>{mv.workouts} sets</Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  bodyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  legend: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  legendTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: Spacing.xs,
  },
  legendLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  muscleList: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  muscleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  muscleInfo: {
    flex: 1,
  },
  muscleName: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  muscleZone: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  muscleStats: {
    alignItems: 'flex-end',
  },
  muscleVolume: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.primary,
  },
  muscleWorkouts: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
