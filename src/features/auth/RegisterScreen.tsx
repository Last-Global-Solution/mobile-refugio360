import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { BrandHeader } from '../../components/BrandHeader';
import { FormField } from '../../components/FormField';
import { Screen } from '../../components/Screen';
import type { AuthStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme/tokens';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  return (
    <Screen>
      <BrandHeader
        description="O cadastro real será conectado à API Java no próximo incremento."
        eyebrow="CONTA CIDADÃ"
        title="Crie seu acesso"
      />
      <View style={styles.form}>
        <FormField
          autoCapitalize="none"
          keyboardType="email-address"
          label="E-mail"
          onChangeText={setEmail}
          placeholder="voce@exemplo.com"
          value={email}
        />
        <FormField
          hint="A API exige entre 8 e 72 caracteres."
          label="Senha"
          onChangeText={setPassword}
          placeholder="Crie uma senha"
          secureTextEntry
          value={password}
        />
        <FormField
          label="Confirmar senha"
          onChangeText={setConfirmation}
          placeholder="Repita a senha"
          secureTextEntry
          value={confirmation}
        />
        <AppButton disabled label="Cadastrar" />
        <Text style={styles.hint}>
          Nenhuma informação preenchida nesta tela é enviada ou salva.
        </Text>
      </View>
      <AppButton label="Voltar ao login" onPress={() => navigation.goBack()} variant="secondary" />
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
