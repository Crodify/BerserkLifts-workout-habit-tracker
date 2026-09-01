import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

const activeColor = '#FF2D55';
const inactiveColor = '#6B7280';

interface IconProps {
  focused: boolean;
  size?: number;
  /** Optional color override — when provided, overrides focused/unfocused defaults */
  color?: string;
}

// Dashboard / Grid icon
export function DashboardIcon({ focused, size = 24, color: colorOverride }: IconProps) {
  const color = colorOverride ?? (focused ? activeColor : inactiveColor);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="8" height="8" rx="2" fill={color} opacity={focused ? 1 : 0.6} />
      <Rect x="13" y="3" width="8" height="8" rx="2" fill={color} opacity={focused ? 0.8 : 0.4} />
      <Rect x="3" y="13" width="8" height="8" rx="2" fill={color} opacity={focused ? 0.8 : 0.4} />
      <Rect x="13" y="13" width="8" height="8" rx="2" fill={color} opacity={focused ? 1 : 0.6} />
    </Svg>
  );
}

// Barbell / Dumbbell icon
export function WorkoutIcon({ focused, size = 24, color: colorOverride }: IconProps) {
  const color = colorOverride ?? (focused ? activeColor : inactiveColor);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="1" y="8" width="4" height="8" rx="1.5" fill={color} />
      <Rect x="19" y="8" width="4" height="8" rx="1.5" fill={color} />
      <Rect x="5" y="5" width="3" height="14" rx="1.5" fill={color} opacity={0.8} />
      <Rect x="16" y="5" width="3" height="14" rx="1.5" fill={color} opacity={0.8} />
      <Rect x="8" y="10.5" width="8" height="3" rx="1" fill={color} opacity={0.6} />
    </Svg>
  );
}

// Checkmark circle icon
export function HabitIcon({ focused, size = 24, color: colorOverride }: IconProps) {
  const color = colorOverride ?? (focused ? activeColor : inactiveColor);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill={focused ? color + '20' : 'none'} />
      <Polyline points="8,12 11,15 16,9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

// Chart / Stats icon
export function ProgressIcon({ focused, size = 24, color: colorOverride }: IconProps) {
  const color = colorOverride ?? (focused ? activeColor : inactiveColor);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="3,18 8,12 13,15 21,6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="17" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="21" y1="6" x2="21" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

// Person icon
export function ProfileIcon({ focused, size = 24, color: colorOverride }: IconProps) {
  const color = colorOverride ?? (focused ? activeColor : inactiveColor);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" fill={color} opacity={focused ? 1 : 0.7} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={color} opacity={focused ? 0.8 : 0.5} />
    </Svg>
  );
}

