import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Web Audio API beep generator — works on web without audio files
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function playBeep(frequency = 800, duration = 200, volume = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration / 1000);
}

export function playRestCompleteBeep() {
  // Triple beep — high pitch, celebratory
  playBeep(880, 150, 0.3);
  setTimeout(() => playBeep(1100, 150, 0.3), 180);
  setTimeout(() => playBeep(1320, 250, 0.3), 360);
  // Haptic: success notification on mobile
  triggerHapticNotification(Haptics.NotificationFeedbackType.Success);
}

export function playRestWarningBeep() {
  // Single short beep — warning tone
  playBeep(660, 200, 0.25);
  // Warning haptic on mobile
  triggerHapticNotification(Haptics.NotificationFeedbackType.Warning);
}

export function playSetCompleteBeep() {
  // Quick confirmation blip
  playBeep(1000, 100, 0.15);
  // Light haptic tap on mobile
  triggerHapticImpact(Haptics.ImpactFeedbackStyle.Light);
}

export function triggerHapticNotification(type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(type).catch(() => {});
}

export function triggerHapticImpact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style).catch(() => {});
}
