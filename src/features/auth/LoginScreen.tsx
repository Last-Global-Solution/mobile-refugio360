import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { BrandHeader } from '../../components/BrandHeader';
import { FormField } from '../../components/FormField';
import { Screen } from '../../components/Screen';
import type { AuthStackParamList } from '../../navigation/types';
import { useSession } from '../../session/SessionProvider';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { enterPreview } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen contentContainerStyle={styles.content}>
      <BrandHeader
        description="Informação confiável e orientação para agir com segurança em situações de emergência."
        title="Segurança começa com informação."
      />

      <View style={styles.form}>
        <FormField
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="E-mail"
          onChangeText={setEmail}
          placeholder="voce@exemplo.com"
          value={email}
        />
        <FormField
          autoComplete="password"
          label="Senha"
          onChangeText={setPassword}
          placeholder="Sua senha"
          secureTextEntry
          value={password}
        />
        <AppButton disabled label="Entrar" />
        <Text style={styles.disabledHint}>
          A autenticação será conectada no próximo incremento.
        </Text>
      </View>

      <View style={styles.actions}>
        <AppButton
          label="Visualizar estrutura do aplicativo"
          onPress={enterPreview}
          variant="quiet"
        />
        <AppButton
          label="Criar conta"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
        />
        <AppButton
          label="Sobre o Refúgio 360"
          onPress={() => navigation.navigate('About')}
          variant="secondary"
        />
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Modo de estrutura</Text>
        <Text style={styles.noticeText}>
          A visualização permite validar telas e navegação sem criar uma sessão ou apresentar dados
          fictícios.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  form: {
    gap: spacing.md,
  },
  disabledHint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.sm,
  },
  notice: {
    gap: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
  },
  noticeTitle: {
    color: colors.warning,
    fontSize: typography.label,
    fontWeight: '800',
  },
  noticeText: {
    color: colors.text,
    fontSize: typography.label,
    lineHeight: 20,
  },
});
