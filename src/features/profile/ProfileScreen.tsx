import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View } from 'react-native';

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
  const { isAuthenticated, mode, logout, user } = useSession();
  const appNavigation = navigation.getParent<NativeStackNavigationProp<AppStackParamList>>();

  const confirmLogout = () => {
    if (!isAuthenticated) {
      void logout();
      return;
    }

    Alert.alert('Sair da conta?', 'Você precisará informar e-mail e senha para entrar novamente.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => void logout() },
    ]);
  };

  return (
    <Screen>
      <BrandHeader
        description="Consulte os dados de acesso associados à sua sessão."
        eyebrow="CONTA"
        title="Perfil"
      />

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>
          {mode === 'preview' ? 'Modo de visualização' : user?.email}
        </Text>
        <Text style={styles.statusText}>
          {mode === 'preview' ? 'Nenhum usuário está autenticado.' : `Perfil: ${user?.papel}`}
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
          onPress={confirmLogout}
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
