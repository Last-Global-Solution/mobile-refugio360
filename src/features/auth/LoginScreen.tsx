import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { BrandHeader } from '../../components/BrandHeader';
import { FormField } from '../../components/FormField';
import { InlineMessage } from '../../components/InlineMessage';
import { Screen } from '../../components/Screen';
import type { AuthStackParamList } from '../../navigation/types';
import { useSession } from '../../session/SessionProvider';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import {
  type AuthFormErrors,
  clearFormError,
  getAuthErrorMessage,
  hasFormErrors,
  validateLogin,
} from './authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { canPreview, enterPreview, login } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    const validation = validateLogin(email, password);
    setErrors(validation);
    setRequestError(null);
    if (hasFormErrors(validation)) return;

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), senha: password });
    } catch (error) {
      setRequestError(getAuthErrorMessage(error, 'login'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <BrandHeader
        description="Informação confiável e orientação para agir com segurança em situações de emergência."
        title="Segurança começa com informação."
      />

      <View style={styles.form}>
        {requestError ? <InlineMessage message={requestError} /> : null}
        <FormField
          autoCapitalize="none"
          autoComplete="email"
          editable={!isSubmitting}
          error={errors.email}
          keyboardType="email-address"
          label="E-mail"
          onChangeText={(value) => {
            setEmail(value);
            setErrors((current) => clearFormError(current, 'email'));
          }}
          placeholder="voce@exemplo.com"
          returnKeyType="next"
          value={email}
        />
        <FormField
          autoComplete="password"
          editable={!isSubmitting}
          error={errors.password}
          label="Senha"
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => clearFormError(current, 'password'));
          }}
          onSubmitEditing={() => void submit()}
          placeholder="Sua senha"
          returnKeyType="done"
          secureTextEntry
          value={password}
        />
        <AppButton
          disabled={isSubmitting}
          label={isSubmitting ? 'Entrando...' : 'Entrar'}
          onPress={() => void submit()}
        />
      </View>

      <View style={styles.actions}>
        <AppButton
          disabled={isSubmitting}
          label="Criar conta"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
        />
        <AppButton
          disabled={isSubmitting}
          label="Sobre o Refúgio 360"
          onPress={() => navigation.navigate('About')}
          variant="secondary"
        />
        {canPreview ? (
          <AppButton
            disabled={isSubmitting}
            label="Visualizar estrutura do aplicativo"
            onPress={enterPreview}
            variant="quiet"
          />
        ) : null}
      </View>

      {canPreview ? (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Disponível apenas em desenvolvimento</Text>
          <Text style={styles.noticeText}>
            A visualização não cria sessão e não libera operações protegidas.
          </Text>
        </View>
      ) : null}
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
