import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  DashboardIcon,
  WorkoutIcon,
  HabitIcon,
  ProgressIcon,
  ProfileIcon,
} from '@/components/TabIcons';

// ── Design constants ────────────────────────────────────────────────────────
const BAR_HEIGHT = 64;
const BEAD_SIZE = 48;
const BEAD_OVERHANG = 40; // allows bead to float proudly above bar without clipping
const CORNER_R = 22;
const NOTCH_HALF_W = 52;
const NOTCH_DEPTH = 24;
const HORIZONTAL_MARGIN = 14;

// Global persistent bead position across component remounts
let globalLastBeadX: number | null = null;

// Tab configuration — unified Acid Crimson (#FF2D55)
export interface TabItemConfig {
  name: string;
  label: string;
  color: string;
  glowColor: string;
  IconComponent: React.ComponentType<{ focused: boolean; size: number; color?: string }>;
}

export const TABS: TabItemConfig[] = [
  {
    name: 'index',
    label: 'Dashboard',
    color: '#FF2D55',
    glowColor: 'rgba(255, 45, 85, 0.55)',
    IconComponent: DashboardIcon,
  },
  {
    name: 'workouts',
    label: 'Workouts',
    color: '#FF2D55',
    glowColor: 'rgba(255, 45, 85, 0.55)',
    IconComponent: WorkoutIcon,
  },
  {
    name: 'habits',
    label: 'Habits',
    color: '#FF2D55',
    glowColor: 'rgba(255, 45, 85, 0.55)',
    IconComponent: HabitIcon,
  },
  {
    name: 'progress',
    label: 'Progress',
    color: '#FF2D55',
    glowColor: 'rgba(255, 45, 85, 0.55)',
    IconComponent: ProgressIcon,
  },
  {
    name: 'profile',
    label: 'Profile',
    color: '#FF2D55',
    glowColor: 'rgba(255, 45, 85, 0.55)',
    IconComponent: ProfileIcon,
  },
];

/**
 * Builds the SVG bar path with a smooth parametric U-notch cutout centered at bx.
 * Uses proportional control points to guarantee zero distortion across all tabs.
 */
function buildNotchPath(bx: number, w: number, h: number, r: number): string {
  // Clamped shoulder positions
  const leftShoulder = Math.max(r, bx - NOTCH_HALF_W);
  const rightShoulder = Math.min(w - r, bx + NOTCH_HALF_W);

  // Proportional control arms based on available span
  const leftSpan = bx - leftShoulder;
  const rightSpan = rightShoulder - bx;

  const leftCp1X = leftShoulder + leftSpan * 0.55;
  const leftCp2X = bx - leftSpan * 0.45;

  const rightCp1X = bx + rightSpan * 0.45;
  const rightCp2X = rightShoulder - rightSpan * 0.55;

  const notchBottom = NOTCH_DEPTH;

  return [
    `M ${r} 0`,
    `H ${leftShoulder}`,
    // Left shoulder melt into notch
    `C ${leftCp1X} 0, ${leftCp2X} ${notchBottom}, ${bx} ${notchBottom}`,
    // Right shoulder melt back out to bar surface
    `C ${rightCp1X} ${notchBottom}, ${rightCp2X} 0, ${rightShoulder} 0`,
    `H ${w - r}`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `H ${r}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `V ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    `Z`,
  ].join(' ');
}

export function BeadTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const barWidth = screenWidth - HORIZONTAL_MARGIN * 2;
  const numTabs = TABS.length;
  const tabWidth = barWidth / numTabs;

  const activeIndex = state.index;
  const activeTab = TABS[activeIndex] || TABS[0];

  const targetX = (activeIndex + 0.5) * tabWidth;
  // Initialize from previous global position so we smoothly slide even across remounts
  const startFromX = globalLastBeadX ?? targetX;

  // Dynamic notch center X (updated smoothly on every frame of spring animation)
  const [notchCenterX, setNotchCenterX] = useState(startFromX);

  // Shared values for buttery Reanimated animations
  const beadX = useSharedValue(startFromX);
  const beadScaleX = useSharedValue(1);
  const beadScaleY = useSharedValue(1);
  const labelOpacity = useSharedValue(1);

  // References for the 60fps/120fps physics loop
  const currentPosRef = useRef(startFromX);
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // High-performance spring simulation for continuous sliding
  const startSpringAnimation = useCallback(
    (destX: number) => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }

      // Jelly squash-and-stretch during motion
      beadScaleX.value = withTiming(1.15, { duration: 110, easing: Easing.out(Easing.quad) }, () => {
        beadScaleX.value = withSpring(1, { damping: 12, stiffness: 200 });
      });
      beadScaleY.value = withTiming(0.88, { duration: 110, easing: Easing.out(Easing.quad) }, () => {
        beadScaleY.value = withSpring(1, { damping: 12, stiffness: 200 });
      });

      // Fade label out and in
      labelOpacity.value = withTiming(0, { duration: 60 }, () => {
        labelOpacity.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) });
      });

      const stiffness = 160;
      const damping = 18;
      let lastTime = performance.now();

      const step = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, 0.032);
        lastTime = time;

        const currentPos = currentPosRef.current;
        const currentVel = velocityRef.current;

        const force = -stiffness * (currentPos - destX);
        const damp = -damping * currentVel;
        const accel = force + damp;

        const newVel = currentVel + accel * dt;
        const newPos = currentPos + newVel * dt;

        currentPosRef.current = newPos;
        velocityRef.current = newVel;
        globalLastBeadX = newPos;

        // Update Reanimated SharedValue and React SVG state on each frame
        beadX.value = newPos;
        setNotchCenterX(newPos);

        if (Math.abs(newPos - destX) > 0.4 || Math.abs(newVel) > 0.4) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          currentPosRef.current = destX;
          velocityRef.current = 0;
          globalLastBeadX = destX;
          beadX.value = destX;
          setNotchCenterX(destX);
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [beadScaleX, beadScaleY, labelOpacity, beadX]
  );

  // Sync animation when activeIndex or dimensions change
  useEffect(() => {
    const currentTargetX = (activeIndex + 0.5) * tabWidth;
    if (Math.abs(currentPosRef.current - currentTargetX) > 1) {
      startSpringAnimation(currentTargetX);
    }
  }, [activeIndex, tabWidth, startSpringAnimation]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Haptic feedback
  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
  }, []);

  const handleTabPress = useCallback(
    (index: number, routeName: string) => {
      triggerHaptic();

      // Immediately launch slide animation towards tapped tab
      const destX = (index + 0.5) * tabWidth;
      startSpringAnimation(destX);

      const isFocused = state.index === index;
      const event = navigation.emit({
        type: 'tabPress',
        target: state.routes[index]?.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName);
      }
    },
    [navigation, state, triggerHaptic, tabWidth, startSpringAnimation]
  );

  // Animated styles for sliding bead & floor glow
  const animatedBeadStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: beadX.value - BEAD_SIZE / 2 },
      { scaleX: beadScaleX.value },
      { scaleY: beadScaleY.value },
    ],
  }));

  // Label follows bead horizontally and fades in
  const animatedLabelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: beadX.value - 60 }],
    opacity: labelOpacity.value,
  }));

  const ActiveIcon = activeTab.IconComponent;

  return (
    <View
      style={[
        styles.outerContainer,
        {
          bottom: Math.max(insets.bottom, 12),
          width: barWidth,
          left: HORIZONTAL_MARGIN,
        },
      ]}
      pointerEvents="box-none"
    >
      {/* ── 1. SVG Bar with Liquid Melted Notch (Slides in Real Time) ── */}
      <View style={[styles.svgWrapper, { width: barWidth, height: BAR_HEIGHT }]}>
        <Svg width={barWidth} height={BAR_HEIGHT} viewBox={`0 0 ${barWidth} ${BAR_HEIGHT}`}>
          <Defs>
            <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#1C1C22" stopOpacity="0.97" />
              <Stop offset="100%" stopColor="#0E0E12" stopOpacity="0.97" />
            </LinearGradient>
          </Defs>

          {/* Single continuous morphing pill bar with liquid notch */}
          <Path
            d={buildNotchPath(notchCenterX, barWidth, BAR_HEIGHT, CORNER_R)}
            fill="url(#barGradient)"
            stroke="#28282E"
            strokeWidth={1}
          />
        </Svg>
      </View>

      {/* ── 2. Inactive Tab Icons along Bar ── */}
      <View style={[styles.tabsRow, { width: barWidth, height: BAR_HEIGHT }]}>
        {TABS.map((tab, idx) => {
          const isFocused = state.index === idx;
          const { IconComponent } = tab;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabTouchTarget}
              onPress={() => handleTabPress(idx, tab.name)}
              activeOpacity={0.75}
            >
              {/* Active tab icon hidden from base bar — active icon floats in the bead */}
              <View style={[styles.iconContainer, isFocused && styles.hiddenIcon]}>
                <IconComponent focused={false} size={20} color="rgba(255, 255, 255, 0.25)" />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 3. Soft Dark Shadow Pool inside the Notch Pocket ── */}
      <Animated.View
        style={[styles.bloomPool, animatedBeadStyle]}
        pointerEvents="none"
      />

      {/* ── 4. Active Floating Bead (Slides & Squashes with Spring Physics) ── */}
      <Animated.View
        style={[styles.bead, animatedBeadStyle]}
        pointerEvents="none"
      >
        <View style={styles.beadInner}>
          <ActiveIcon focused={true} size={22} color="#FFFFFF" />
        </View>
      </Animated.View>

      {/* ── 5. Active Label sliding inside the lower Bar body ── */}
      <Animated.View style={[styles.labelContainer, animatedLabelStyle]} pointerEvents="none">
        <Text style={styles.activeLabel}>{activeTab.label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    height: BAR_HEIGHT + BEAD_OVERHANG,
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 18,
      },
      android: {
        elevation: 12,
      },
    }),
  },

  svgWrapper: {
    position: 'absolute',
    top: BEAD_OVERHANG,
    left: 0,
  },

  tabsRow: {
    position: 'absolute',
    top: BEAD_OVERHANG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 2,
  },

  tabTouchTarget: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },

  hiddenIcon: {
    opacity: 0,
  },

  bloomPool: {
    position: 'absolute',
    top: BEAD_OVERHANG + 6,
    left: 0,
    width: BEAD_SIZE,
    height: BEAD_SIZE * 0.55,
    borderRadius: BEAD_SIZE / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    zIndex: 4,
  },

  bead: {
    position: 'absolute',
    top: 7,
    left: 0,
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    backgroundColor: '#FF2D55',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    ...Platform.select({
      ios: {
        shadowColor: '#FF2D55',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.65,
        shadowRadius: 18,
      },
      android: {
        elevation: 14,
      },
      web: {
        // @ts-ignore — web CSS property
        boxShadow: '0px 0px 32px 10px rgba(255, 45, 85, 0.4)',
      },
    }),
  },

  beadInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  labelContainer: {
    position: 'absolute',
    top: BEAD_OVERHANG + 42,
    left: 0,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },

  activeLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#FF2D55',
  },
});
