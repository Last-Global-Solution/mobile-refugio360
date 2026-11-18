import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../theme/tokens';

type InlineMessageProps = {
  message: string;
  tone?: 'error' | 'info';
};

export function InlineMessage({ message, tone = 'error' }: InlineMessageProps) {
  return (
    <View
      accessibilityRole={tone === 'error' ? 'alert' : undefined}
      style={[styles.container, tone === 'error' ? styles.error : styles.info]}
    >
      <Text style={[styles.text, tone === 'error' ? styles.errorText : styles.infoText]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.md,
    padding: spacing.md,
  },
  error: {
    backgroundColor: colors.dangerSoft,
  },
  info: {
    backgroundColor: colors.primarySoft,
  },
  text: {
    fontSize: typography.label,
    fontWeight: '700',
    lineHeight: 20,
  },
  errorText: {
    color: colors.danger,
  },
  infoText: {
    color: colors.primaryPressed,
  },
});
