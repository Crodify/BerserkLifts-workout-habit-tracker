import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface LevelUpPopupProps {
  visible: boolean;
  newLevel: number;
  onFinish: () => void;
}

export function LevelUpPopup({ visible, newLevel, onFinish }: LevelUpPopupProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 60,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(2000),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 0,
            friction: 4,
            tension: 60,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => onFinish());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.popup,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.icon}>⚡</Text>
        <Text style={styles.title}>LEVEL UP!</Text>
        <Text style={styles.level}>Level {newLevel}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 9999 },
  popup: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', borderWidth: 2, borderColor: Colors.accent },
  icon: { fontSize: 48, marginBottom: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white, letterSpacing: 2, marginBottom: Spacing.sm },
  level: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
});