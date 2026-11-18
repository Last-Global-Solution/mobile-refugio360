import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../theme/tokens';

type BrandHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function BrandHeader({ eyebrow = 'REFÚGIO 360', title, description }: BrandHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.eyebrowRow}>
        <View style={styles.marker} />
        <Text style={styles.eyebrow}>{eyebrow}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  marker: {
    width: 24,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: colors.secondary,
    fontSize: typography.display,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: typography.lineHeightBody,
  },
});
