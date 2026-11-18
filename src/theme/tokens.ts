export const colors = {
  background: '#F3F7F8',
  surface: '#FFFFFF',
  surfaceMuted: '#E7F0F1',
  primary: '#075E63',
  primaryPressed: '#04474B',
  primarySoft: '#D9EEEE',
  secondary: '#16324F',
  accent: '#F2A541',
  text: '#132A35',
  textMuted: '#526A73',
  border: '#C8D8DC',
  danger: '#A63D40',
  dangerSoft: '#F8E5E5',
  warning: '#8A5700',
  warningSoft: '#FFF1D6',
  success: '#276749',
  successSoft: '#E2F2E8',
  white: '#FFFFFF',
  overlay: 'rgba(19, 42, 53, 0.08)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const typography = {
  display: 32,
  title: 24,
  heading: 19,
  body: 16,
  label: 14,
  caption: 12,
  lineHeightBody: 24,
} as const;

export const shadows = {
  card: {
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
} as const;
