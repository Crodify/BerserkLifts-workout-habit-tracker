export const Colors = {
  // ═══════════════════════════════════════════
  // BERSERKLIFTS DESIGN SYSTEM v2.0
  // Premium Dark Theme with Crimson Accent
  // ═══════════════════════════════════════════

  // Background Layers (Depth System)
  background: '#0A0A0A',        // Deep Black (main bg)
  backgroundElevated: '#111113', // Slightly lighter (modals, sheets)
  surface: '#16161A',           // Card surface
  surfaceHover: '#1C1C21',      // Card hover state
  surfaceActive: '#222228',     // Card active/pressed state
  surfaceLight: '#1E1E24',      // Input fields, sub-cards

  // Primary Brand: Acid Crimson (Refined)
  primary: '#FF2D55',           // Vivid Crimson (iOS-style red)
  primaryDark: '#CC1A3A',       // Darker crimson for pressed states
  primaryLight: '#FF6B8A',      // Lighter for highlights
  primaryGlow: 'rgba(255, 45, 85, 0.20)',  // Subtle glow
  primarySubtle: 'rgba(255, 45, 85, 0.08)', // Very subtle background

  // Accent Colors
  accent: '#FFD60A',            // Gold (iOS yellow) for PRs/badges
  accentSubtle: 'rgba(255, 214, 10, 0.12)', // Gold background

  // Status Colors (Accessibility compliant)
  success: '#30D158',           // iOS Green
  successSubtle: 'rgba(48, 209, 88, 0.12)',
  warning: '#FF9F0A',           // iOS Orange
  warningSubtle: 'rgba(255, 159, 10, 0.12)',
  error: '#FF453A',             // iOS Red
  errorSubtle: 'rgba(255, 69, 58, 0.12)',
  info: '#0A84FF',              // iOS Blue
  infoSubtle: 'rgba(10, 132, 255, 0.12)',

  // Typography (WCAG AA Compliant)
  text: '#FFFFFF',              // Primary text (100% white)
  textSecondary: '#98989D',     // Secondary text (60% white)
  textTertiary: '#636366',      // Tertiary text (40% white)
  textMuted: '#48484A',         // Muted text (30% white)
  textOnPrimary: '#FFFFFF',     // Text on primary color

  // Borders & Dividers
  border: '#2C2C2E',           // Default border
  borderLight: '#3A3A3C',      // Lighter border
  borderAccent: '#FF2D55',     // Accent border
  divider: '#1C1C1E',          // Subtle dividers

  // System Colors
  white: '#FFFFFF',
  black: '#000000',
  clear: 'transparent',
};

export const Spacing = {
  // ═══════════════════════════════════════════
  // 8-POINT GRID SYSTEM
  // Based on 8px increments for visual rhythm
  // ═══════════════════════════════════════════
  xxs: 2,    // Micro spacing
  xs: 4,     // Tiny spacing
  sm: 8,     // Small spacing
  md: 16,    // Medium spacing (base unit)
  lg: 24,    // Large spacing
  xl: 32,    // Extra large spacing
  xxl: 48,   // Section spacing
  xxxl: 64,  // Page-level spacing
};

export const BorderRadius = {
  // ═══════════════════════════════════════════
  // BORDER RADIUS SCALE
  // Consistent rounding for all components
  // ═══════════════════════════════════════════
  none: 0,
  sm: 8,     // Small elements (chips, badges)
  md: 12,    // Medium elements (cards, inputs)
  lg: 16,    // Large elements (modals, sheets)
  xl: 20,    // Extra large (bottom sheets)
  xxl: 24,   // Feature cards
  full: 9999, // Circular elements
};

export const FontSize = {
  // ═══════════════════════════════════════════
  // TYPOGRAPHY SCALE
  // Mobile-first, accessible sizes
  // ═══════════════════════════════════════════
  xs: 11,    // Captions, labels
  sm: 13,    // Small body text
  md: 15,    // Body text (default)
  lg: 17,    // Large body, subheadings
  xl: 20,    // Section headers
  xxl: 24,   // Page titles
  xxxl: 28,  // Hero text
  title: 34, // Screen titles
  hero: 40,  // Feature numbers
};

export const FontWeight = {
  // ═══════════════════════════════════════════
  // FONT WEIGHT SCALE
  // Clear hierarchy for readability
  // ═══════════════════════════════════════════
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const Shadows = {
  // ═══════════════════════════════════════════
  // ELEVATION SYSTEM
  // Subtle shadows for depth perception
  // ═══════════════════════════════════════════
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
  primary: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const Animation = {
  // ═══════════════════════════════════════════
  // ANIMATION TOKENS
  // Consistent timing for smooth interactions
  // ═══════════════════════════════════════════
  fast: 150,
  normal: 250,
  slow: 400,
  spring: {
    damping: 15,
    stiffness: 150,
  },
};
