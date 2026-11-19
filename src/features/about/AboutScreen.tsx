import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

import { BrandHeader } from '../../components/BrandHeader';
import { Screen } from '../../components/Screen';
import { colors, radii, spacing, typography } from '../../theme/tokens';

const principles = [
  'Informações operacionais fornecidas pelas APIs oficiais do projeto.',
  'Separação entre recursos autenticados Java e alertas públicos .NET.',
  'Estados de carregamento, erro e ausência de dados tratados explicitamente.',
];

export function AboutScreen() {
  const buildCommit = Constants.expoConfig?.extra?.buildCommit;
  const commit =
    typeof buildCommit === 'string' && /^[0-9a-f]{40}$/.test(buildCommit)
      ? buildCommit
      : 'Não identificado';

  return (
    <Screen>
      <BrandHeader
        description="Projeto acadêmico da Global Solution 2026/2 da FIAP voltado ao apoio comunitário em emergências."
        eyebrow="SOBRE"
        title="Refúgio 360"
      />

      <View style={styles.card}>
        <Text style={styles.heading}>Propósito</Text>
        <Text style={styles.body}>
          Facilitar o acesso a locais seguros, alertas, ocorrências e orientações, inicialmente no
          contexto de enchentes.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Princípios deste aplicativo</Text>
        {principles.map((principle, index) => (
          <View key={principle} style={styles.principleRow}>
            <Text style={styles.index}>{index + 1}</Text>
            <Text style={styles.principle}>{principle}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Identificação da entrega</Text>
        <Text style={styles.body}>FIAP · Global Solution 2026/2</Text>
        <Text style={styles.body}>Versão: {Constants.expoConfig?.version ?? 'Não informada'}</Text>
        <Text selectable style={styles.commit}>
          Commit do APK: {__DEV__ ? 'Disponível na versão instalada' : commit}
        </Text>
      </View>

      <Text style={styles.disclaimer}>
        O aplicativo não substitui Defesa Civil, bombeiros, serviços médicos ou outros canais
        oficiais de emergência.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  heading: {
    color: colors.secondary,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: typography.lineHeightBody,
  },
  principleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  index: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    fontSize: typography.label,
    fontWeight: '900',
    lineHeight: 28,
    textAlign: 'center',
  },
  principle: {
    flex: 1,
    color: colors.text,
    fontSize: typography.label,
    lineHeight: 21,
  },
  commit: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
    flexShrink: 1,
  },
  disclaimer: {
    color: colors.danger,
    fontSize: typography.label,
    fontWeight: '700',
    lineHeight: 21,
    textAlign: 'center',
  },
});
