import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface VolumeData {
  label: string;
  value: number;
  color?: string;
}

interface VolumeChartProps {
  data: VolumeData[];
  title: string;
  subtitle?: string;
  maxValue?: number;
}

export function VolumeChart({ data, title, subtitle, maxValue }: VolumeChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      <View style={styles.chart}>
        {data.map((item, index) => {
          const height = (item.value / max) * 100;
          const barColor = item.color || Colors.primary;
          
          return (
            <View key={index} style={styles.barContainer}>
              <Text style={styles.barValue}>
                {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}K` : item.value}
              </Text>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${Math.max(height, 5)}%`,
                      backgroundColor: barColor,
                    }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
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
    color: Colors.textMuted,
    marginTop: 2,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barValue: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
