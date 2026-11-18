import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { colors, radii, spacing, typography } from '../theme/tokens';

type AppButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
};

export function AppButton({
  label,
  variant = 'primary',
  disabled,
  style,
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => {
        const { pressed } = state;

        return [
          styles.base,
          styles[variant],
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
          typeof style === 'function' ? style(state) : style,
        ];
      }}
      {...props}
    >
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
  quiet: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoft,
  },
  pressed: {
    opacity: 0.78,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  primaryLabel: {
    color: colors.white,
  },
  secondaryLabel: {
    color: colors.primary,
  },
  quietLabel: {
    color: colors.primaryPressed,
  },
  dangerLabel: {
    color: colors.danger,
  },
});
