import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../theme/tokens';
import { AppButton } from './AppButton';

type StatePanelProps = {
  state: 'loading' | 'empty' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function StatePanel({ state, title, message, actionLabel, onAction }: StatePanelProps) {
  return (
    <View accessibilityRole={state === 'error' ? 'alert' : undefined} style={styles.container}>
      <View style={[styles.symbol, state === 'error' && styles.errorSymbol]}>
        {state === 'loading' ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.symbolText}>{state === 'empty' ? '0' : '!'}</Text>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.xl,
  },
  symbol: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  errorSymbol: {
    backgroundColor: colors.dangerSoft,
  },
  symbolText: {
    color: colors.primary,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: colors.textMuted,
    fontSize: typography.label,
    lineHeight: 21,
    textAlign: 'center',
  },
});
