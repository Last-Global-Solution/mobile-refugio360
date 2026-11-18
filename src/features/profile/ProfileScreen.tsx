import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { BrandHeader } from '../../components/BrandHeader';
import { Screen } from '../../components/Screen';
import { environment } from '../../config/environment';
import type { AppStackParamList, MainTabParamList } from '../../navigation/types';
import { useSession } from '../../session/SessionProvider';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type Props = BottomTabScreenProps<MainTabParamList, 'Profile'>;

function ConfigRow({ label, configured }: { label: string; configured: boolean }) {
  return (
    <View style={styles.configRow}>
      <Text style={styles.configLabel}>{label}</Text>
      <Text style={[styles.configValue, configured ? styles.configured : styles.pending]}>
        {configured ? 'Configurada' : 'Pendente'}
      </Text>
    </View>
  );
}

export function ProfileScreen({ navigation }: Props) {
  const { mode, leaveSession } = useSession();
  const appNavigation = navigation.getParent<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <Screen>
      <BrandHeader
        description="Preferências e informações da sessão ficarão concentradas aqui."
        eyebrow="CONTA"
        title="Perfil"
      />

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Estado atual</Text>
        <Text style={styles.statusText}>
          {mode === 'preview'
            ? 'Visualização sem usuário autenticado.'
            : 'Sessão preparada para integração futura.'}
        </Text>
      </View>

      <View style={styles.configCard}>
        <Text style={styles.configTitle}>Ambiente</Text>
        <ConfigRow configured={Boolean(environment.javaApiUrl)} label="API Java" />
        <ConfigRow configured={Boolean(environment.dotnetApiUrl)} label="API .NET" />
      </View>

      <View style={styles.actions}>
        <AppButton
          label="Sobre o aplicativo"
          onPress={() => appNavigation?.navigate('About')}
          variant="secondary"
        />
        <AppButton
          label={mode === 'preview' ? 'Sair da visualização' : 'Sair'}
          onPress={leaveSession}
          variant="danger"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    gap: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.primarySoft,
    padding: spacing.lg,
  },
  statusTitle: {
    color: colors.primary,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  statusText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: typography.lineHeightBody,
  },
  configCard: {
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  configTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  configLabel: {
    color: colors.textMuted,
    fontSize: typography.label,
  },
  configValue: {
    fontSize: typography.label,
    fontWeight: '800',
  },
  configured: {
    color: colors.success,
  },
  pending: {
    color: colors.warning,
  },
  actions: {
    gap: spacing.sm,
  },
});
