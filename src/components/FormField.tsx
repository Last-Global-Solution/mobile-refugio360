import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { colors, radii, spacing, typography } from '../theme/tokens';

type FormFieldProps = TextInputProps & {
  label: string;
  hint?: string;
};

export function FormField({ label, hint, ...props }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        {...props}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
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
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
});
