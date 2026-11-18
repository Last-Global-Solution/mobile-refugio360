import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { safeLocationService } from '../../api/safeLocationService';
import { AppButton } from '../../components/AppButton';
import { BrandHeader } from '../../components/BrandHeader';
import { Screen } from '../../components/Screen';
import { StatePanel } from '../../components/StatePanel';
import type { AppStackParamList } from '../../navigation/types';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { SafeLocation } from '../../types/safeLocation';
import { toApiFailure } from '../../utils/apiErrors';
import { formatCoordinate } from '../../utils/formatters';
import { getPublicDataErrorMessage } from '../../utils/publicDataErrors';

type Props = NativeStackScreenProps<AppStackParamList, 'SafeLocationDetail'>;

export function SafeLocationDetailScreen({ route }: Props) {
  const [location, setLocation] = useState<SafeLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setLocation(await safeLocationService.getById(route.params.locationId));
    } catch (requestError) {
      setError(getPublicDataErrorMessage(toApiFailure(requestError), 'locais seguros', 'detail'));
    } finally {
      setIsLoading(false);
    }
  }, [route.params.locationId]);

  useEffect(() => {
    let active = true;
    safeLocationService
      .getById(route.params.locationId)
      .then((result) => {
        if (active) setLocation(result);
      })
      .catch((requestError: unknown) => {
        if (active)
          setError(
            getPublicDataErrorMessage(toApiFailure(requestError), 'locais seguros', 'detail'),
          );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [route.params.locationId]);

  const openMap = async () => {
    if (!location) return;
    setMapError(null);
    const coordinates = `${location.latitude},${location.longitude}`;
    try {
      await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${coordinates}`);
    } catch {
      setMapError('Não foi possível abrir um aplicativo de mapas.');
    }
  };

  if (isLoading) {
    return (
      <Screen>
        <StatePanel
          state="loading"
          title="Carregando local seguro"
          message="Consultando os dados do ponto de apoio."
        />
      </Screen>
    );
  }

  if (error || !location) {
    return (
      <Screen>
        <StatePanel
          actionLabel="Tentar novamente"
          message={error ?? 'Não foi possível carregar o local.'}
          onAction={() => void load()}
          state="error"
          title="Local indisponível"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <BrandHeader description={location.endereco} eyebrow={location.tipo} title={location.nome} />
      <View style={styles.panel}>
        <Detail label="Descrição" value={location.descricao ?? 'Descrição não informada.'} />
        <Detail label="Latitude" value={formatCoordinate(location.latitude)} />
        <Detail label="Longitude" value={formatCoordinate(location.longitude)} />
      </View>
      <AppButton label="Abrir no mapa" onPress={() => void openMap()} />
      {mapError ? <Text style={styles.error}>{mapError}</Text> : null}
    </Screen>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.label}>{label}</Text>
      <Text selectable style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  detail: { gap: spacing.xs },
  label: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  value: { color: colors.text, fontSize: typography.body, lineHeight: 23 },
  error: { color: colors.danger, fontSize: typography.label, textAlign: 'center' },
});
