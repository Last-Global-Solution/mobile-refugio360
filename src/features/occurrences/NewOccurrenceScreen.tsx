import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { occurrenceService } from '../../api/occurrenceService';
import { AppButton } from '../../components/AppButton';
import { BrandHeader } from '../../components/BrandHeader';
import { FormField } from '../../components/FormField';
import { InlineMessage } from '../../components/InlineMessage';
import { OptionSelector } from '../../components/OptionSelector';
import { Screen } from '../../components/Screen';
import { StatePanel } from '../../components/StatePanel';
import type { AppStackParamList } from '../../navigation/types';
import { useSession } from '../../session/SessionProvider';
import { colors, spacing, typography } from '../../theme/tokens';
import type { OccurrenceProfile, OccurrenceUrgency } from '../../types/occurrence';
import { createSubmissionGuard } from '../../utils/submissionGuard';
import {
  clearOccurrenceFormError,
  getOccurrenceErrorMessage,
  hasOccurrenceFormErrors,
  type OccurrenceFormErrors,
  type OccurrenceFormValues,
  toCreateOccurrenceRequest,
  validateOccurrence,
} from './occurrenceValidation';

type Props = NativeStackScreenProps<AppStackParamList, 'NewOccurrence'>;

const urgencyOptions: readonly { value: OccurrenceUrgency; label: string }[] = [
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'CRITICA', label: 'Crítica' },
];

const profileOptions: readonly { value: OccurrenceProfile; label: string }[] = [
  { value: 'GERAL', label: 'Geral' },
  { value: 'IDOSO', label: 'Pessoa idosa' },
  { value: 'PCD', label: 'PCD' },
  { value: 'FAMILIA', label: 'Família' },
];

const initialValues: OccurrenceFormValues = {
  descricao: '',
  urgencia: null,
  perfil: null,
  latitude: '',
  longitude: '',
};

export function NewOccurrenceScreen({ navigation }: Props) {
  const { isAuthenticated } = useSession();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<OccurrenceFormErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionGuard] = useState(createSubmissionGuard);

  if (!isAuthenticated) {
    return (
      <Screen contentContainerStyle={styles.centered}>
        <StatePanel
          message="Entre com uma conta para registrar uma ocorrência."
          state="empty"
          title="Acesso protegido"
        />
      </Screen>
    );
  }

  const updateValue = <K extends keyof OccurrenceFormValues>(
    field: K,
    value: OccurrenceFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => clearOccurrenceFormError(current, field));
  };

  const submit = async () => {
    const validation = validateOccurrence(values);
    setErrors(validation);
    setRequestError(null);
    if (hasOccurrenceFormErrors(validation)) return;

    const created = await submissionGuard.run(async () => {
      setIsSubmitting(true);
      try {
        return await occurrenceService.create(toCreateOccurrenceRequest(values));
      } catch (error) {
        setRequestError(getOccurrenceErrorMessage(error, 'create'));
        return undefined;
      } finally {
        setIsSubmitting(false);
      }
    });

    if (!created) return;
    Alert.alert(
      'Ocorrência registrada',
      `O relato #${created.id} foi enviado. Abra os detalhes para acompanhar as orientações.`,
    );
    navigation.popTo('MainTabs', {
      screen: 'Occurrences',
      params: { refreshKey: Date.now() },
    });
  };

  return (
    <Screen>
      <BrandHeader
        description="Descreva a situação e informe as coordenadas do local observado."
        eyebrow="NOVO RELATO"
        title="Registrar ocorrência"
      />

      {requestError ? <InlineMessage message={requestError} /> : null}

      <FormField
        editable={!isSubmitting}
        error={errors.descricao}
        label="Descrição"
        multiline
        numberOfLines={4}
        onChangeText={(value) => updateValue('descricao', value)}
        placeholder="Ex.: alagamento bloqueando a passagem de veículos"
        textAlignVertical="top"
        value={values.descricao}
      />

      <OptionSelector
        disabled={isSubmitting}
        error={errors.urgencia}
        label="Urgência"
        onChange={(value) => updateValue('urgencia', value)}
        options={urgencyOptions}
        value={values.urgencia}
      />

      <OptionSelector
        disabled={isSubmitting}
        error={errors.perfil}
        label="Perfil da orientação"
        onChange={(value) => updateValue('perfil', value)}
        options={profileOptions}
        value={values.perfil}
      />

      <View style={styles.coordinateRow}>
        <View style={styles.coordinateField}>
          <FormField
            editable={!isSubmitting}
            error={errors.latitude}
            keyboardType="numbers-and-punctuation"
            label="Latitude"
            onChangeText={(value) => updateValue('latitude', value)}
            placeholder="-23.5505"
            value={values.latitude}
          />
        </View>
        <View style={styles.coordinateField}>
          <FormField
            editable={!isSubmitting}
            error={errors.longitude}
            keyboardType="numbers-and-punctuation"
            label="Longitude"
            onChangeText={(value) => updateValue('longitude', value)}
            placeholder="-46.6333"
            value={values.longitude}
          />
        </View>
      </View>

      <Text style={styles.hint}>
        O GPS automático não está disponível neste incremento. Confira os valores antes de enviar.
      </Text>

      <AppButton
        disabled={isSubmitting}
        label={isSubmitting ? 'Enviando ocorrência...' : 'Enviar ocorrência'}
        onPress={() => void submit()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
  },
  coordinateRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  coordinateField: {
    flex: 1,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
    textAlign: 'center',
  },
});
