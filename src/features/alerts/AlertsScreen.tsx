import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { alertService } from '../../api/alertService';
import { BrandHeader } from '../../components/BrandHeader';
import { InlineMessage } from '../../components/InlineMessage';
import { StatePanel } from '../../components/StatePanel';
import type { AppStackParamList, MainTabParamList } from '../../navigation/types';
import { colors, spacing } from '../../theme/tokens';
import type { PublicAlert } from '../../types/alert';
import { toApiFailure } from '../../utils/apiErrors';
import { getPublicDataErrorMessage } from '../../utils/publicDataErrors';
import { AlertCard } from './AlertCard';

type Props = BottomTabScreenProps<MainTabParamList, 'Alerts'>;

export function AlertsScreen({ navigation }: Props) {
  const appNavigation = navigation.getParent<NativeStackNavigationProp<AppStackParamList>>();
  const [alerts, setAlerts] = useState<PublicAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      setAlerts(await alertService.listPublished());
    } catch (requestError) {
      setError(getPublicDataErrorMessage(toApiFailure(requestError), 'alertas', 'list'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    alertService
      .listPublished()
      .then((result) => {
        if (active) setAlerts(result);
      })
      .catch((requestError: unknown) => {
        if (active)
          setError(getPublicDataErrorMessage(toApiFailure(requestError), 'alertas', 'list'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={alerts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <BrandHeader
            description="Comunicados públicos retornados pelo serviço .NET. Confira sempre a fonte informada."
            eyebrow="COMUNICADOS"
            title="Alertas públicos"
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <StatePanel
              state="loading"
              title="Carregando alertas"
              message="Consultando os comunicados publicados."
            />
          ) : error ? (
            <StatePanel
              actionLabel="Tentar novamente"
              message={error}
              onAction={() => void load()}
              state="error"
              title="Alertas indisponíveis"
            />
          ) : (
            <StatePanel
              state="empty"
              title="Nenhum alerta publicado"
              message="Não há comunicados disponíveis neste momento."
            />
          )
        }
        ListFooterComponent={
          alerts.length > 0 && error ? <InlineMessage message={error} tone="error" /> : undefined
        }
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            onRefresh={() => void load(true)}
            refreshing={isRefreshing}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <AlertCard
            alert={item}
            onPress={() => appNavigation?.navigate('AlertDetail', { alertId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, gap: spacing.md, padding: spacing.lg },
});
