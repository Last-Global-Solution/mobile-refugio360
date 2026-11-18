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
import { colors, spacing, typography } from '../../theme/tokens';
import {
  type AuthFormErrors,
  clearFormError,
  getAuthErrorMessage,
  hasFormErrors,
  validateRegistration,
} from './authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    const validation = validateRegistration(email, password, confirmation);
    setErrors(validation);
    setRequestError(null);
    if (hasFormErrors(validation)) return;

    setIsSubmitting(true);
    try {
      await register({ email: email.trim(), senha: password });
    } catch (error) {
      setRequestError(getAuthErrorMessage(error, 'register'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <BrandHeader
        description="Use um e-mail válido e uma senha que você não compartilha."
        eyebrow="CONTA CIDADÃ"
        title="Crie seu acesso"
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
          value={email}
        />
        <FormField
          autoComplete="new-password"
          editable={!isSubmitting}
          error={errors.password}
          hint="A senha deve ter entre 8 e 72 caracteres."
          label="Senha"
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => clearFormError(current, 'password'));
          }}
          placeholder="Crie uma senha"
          secureTextEntry
          value={password}
        />
        <FormField
          autoComplete="new-password"
          editable={!isSubmitting}
          error={errors.confirmation}
          label="Confirmar senha"
          onChangeText={(value) => {
            setConfirmation(value);
            setErrors((current) => clearFormError(current, 'confirmation'));
          }}
          onSubmitEditing={() => void submit()}
          placeholder="Repita a senha"
          returnKeyType="done"
          secureTextEntry
          value={confirmation}
        />
        <AppButton
          disabled={isSubmitting}
          label={isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          onPress={() => void submit()}
        />
        <Text style={styles.hint}>
          Sua senha é enviada somente para autenticação e não é salva no app.
        </Text>
      </View>
      <AppButton
        disabled={isSubmitting}
        label="Voltar ao login"
        onPress={() => navigation.goBack()}
        variant="secondary"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
    textAlign: 'center',
  },
});
