import React, { useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';
import { FontSize, Colors } from '@/constants/theme';

interface AnimatedCounterProps {
  value: number;
  style?: any;
  duration?: number;
}

export function AnimatedCounter({ value, style, duration = 800 }: AnimatedCounterProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <Animated.Text
      style={[
        style,
        {
          color: animatedValue.interpolate({
            inputRange: [0, value],
            outputRange: [Colors.textMuted, Colors.text],
          }),
        },
      ]}
    >
      {animatedValue.interpolate({
        inputRange: [0, value],
        outputRange: ['0', value.toString()],
      })}
    </Animated.Text>
  );
}
