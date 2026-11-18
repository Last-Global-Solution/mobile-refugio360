import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme/tokens';

type ScreenProps = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function Screen({ children, contentContainerStyle }: ScreenProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.content, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
});
