import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

import { BrandHeader } from '../../components/BrandHeader';
import { FeatureCard } from '../../components/FeatureCard';
import { Screen } from '../../components/Screen';
import type { MainTabParamList } from '../../navigation/types';
import { useSession } from '../../session/SessionProvider';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { mode } = useSession();

  return (
    <Screen>
      {mode === 'preview' ? (
        <View style={styles.previewBanner}>
          <Text style={styles.previewTitle}>Visualização da estrutura</Text>
          <Text style={styles.previewText}>APIs e autenticação ainda não estão conectadas.</Text>
        </View>
      ) : null}

      <BrandHeader
        description="Acesse rapidamente os recursos preparados para orientar cidadãos durante emergências."
        eyebrow="PAINEL CIDADÃO"
        title="Como podemos ajudar?"
      />

      <View style={styles.cards}>
        <FeatureCard
          code="OC"
          description="Registre e acompanhe relatos enviados por você."
          onPress={() => navigation.navigate('Occurrences')}
          title="Minhas ocorrências"
        />
        <FeatureCard
          code="LS"
          description="Consulte pontos de apoio cadastrados no serviço Java."
          onPress={() => navigation.navigate('SafeLocations')}
          title="Locais seguros"
        />
        <FeatureCard
          code="AL"
          description="Acompanhe comunicados públicos publicados pelo serviço .NET."
          onPress={() => navigation.navigate('Alerts')}
          title="Alertas"
        />
      </View>

      <View style={styles.guidance}>
        <Text style={styles.guidanceLabel}>EM UMA EMERGÊNCIA</Text>
        <Text style={styles.guidanceTitle}>Priorize orientações de autoridades locais.</Text>
        <Text style={styles.guidanceText}>
          O Refúgio 360 apoia a consulta de informações, mas não substitui os canais oficiais de
          emergência.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  previewBanner: {
    gap: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
  },
  previewTitle: {
    color: colors.warning,
    fontSize: typography.label,
    fontWeight: '800',
  },
  previewText: {
    color: colors.text,
    fontSize: typography.label,
  },
  cards: {
    gap: spacing.md,
  },
  guidance: {
    gap: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.secondary,
    padding: spacing.lg,
  },
  guidanceLabel: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  guidanceTitle: {
    color: colors.white,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  guidanceText: {
    color: colors.primarySoft,
    fontSize: typography.label,
    lineHeight: 21,
  },
});
