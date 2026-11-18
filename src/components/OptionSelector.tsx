import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../theme/tokens';

type Option<T extends string> = {
  value: T;
  label: string;
};

type OptionSelectorProps<T extends string> = {
  label: string;
  options: readonly Option<T>[];
  value: T | null;
  error?: string | undefined;
  disabled?: boolean;
  onChange: (value: T) => void;
};

export function OptionSelector<T extends string>({
  label,
  options,
  value,
  error,
  disabled,
  onChange,
}: OptionSelectorProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View accessibilityRole="radiogroup" style={styles.options}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, disabled }}
              disabled={disabled}
              key={option.value}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.optionPressed,
                disabled && styles.optionDisabled,
              ]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.label,
    fontWeight: '700',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionPressed: {
    opacity: 0.75,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    color: colors.textMuted,
    fontSize: typography.label,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: colors.primaryPressed,
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
