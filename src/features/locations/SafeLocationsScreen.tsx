import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { safeLocationService } from '../../api/safeLocationService';
import { AppButton } from '../../components/AppButton';
import { BrandHeader } from '../../components/BrandHeader';
import { InlineMessage } from '../../components/InlineMessage';
import { StatePanel } from '../../components/StatePanel';
import type { AppStackParamList, MainTabParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme/tokens';
import type { SpringPage } from '../../types/api';
import type { SafeLocation } from '../../types/safeLocation';
import { toApiFailure } from '../../utils/apiErrors';
import { getPublicDataErrorMessage } from '../../utils/publicDataErrors';
import { SafeLocationCard } from './SafeLocationCard';
import { canLoadNextSafeLocationPage, mergeSafeLocationPage } from './safeLocationPagination';

type Props = BottomTabScreenProps<MainTabParamList, 'SafeLocations'>;
type LoadingMode = 'initial' | 'refresh' | 'more';

export function SafeLocationsScreen({ navigation }: Props) {
  const appNavigation = navigation.getParent<NativeStackNavigationProp<AppStackParamList>>();
  const [locations, setLocations] = useState<SafeLocation[]>([]);
  const [page, setPage] = useState<SpringPage<SafeLocation> | null>(null);
  const [loadingMode, setLoadingMode] = useState<LoadingMode | null>('initial');
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const loadPage = async (pageNumber: number, replace: boolean, mode: LoadingMode) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoadingMode(mode);
    setError(null);
    try {
      const result = await safeLocationService.list({ page: pageNumber, size: 10 });
      setLocations((current) => mergeSafeLocationPage(current, result, replace));
      setPage(result);
    } catch (requestError) {
      setError(getPublicDataErrorMessage(toApiFailure(requestError), 'locais seguros', 'list'));
    } finally {
      loadingRef.current = false;
      setLoadingMode(null);
    }
  };

  useEffect(() => {
    let active = true;
    loadingRef.current = true;
    safeLocationService
      .list({ page: 0, size: 10 })
      .then((result) => {
        if (!active) return;
        setLocations(result.content);
        setPage(result);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (active)
          setError(getPublicDataErrorMessage(toApiFailure(requestError), 'locais seguros', 'list'));
      })
      .finally(() => {
        if (active) {
          loadingRef.current = false;
          setLoadingMode(null);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const canLoadMore = canLoadNextSafeLocationPage(page, loadingMode !== null);
  const isInitialLoading = loadingMode === 'initial' && locations.length === 0;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={locations}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <BrandHeader
            description="Pontos de apoio cadastrados no serviço Java, em ordem alfabética."
            eyebrow="REDE DE APOIO"
            title="Locais seguros"
          />
        }
        ListEmptyComponent={
          isInitialLoading ? (
            <StatePanel
              state="loading"
              title="Carregando locais"
              message="Consultando os pontos de apoio disponíveis."
            />
          ) : error ? (
            <StatePanel
              actionLabel="Tentar novamente"
              message={error}
              onAction={() => void loadPage(0, true, 'initial')}
              state="error"
              title="Locais indisponíveis"
            />
          ) : (
            <StatePanel
              state="empty"
              title="Nenhum local encontrado"
              message="A API não retornou locais seguros publicados."
            />
          )
        }
        ListFooterComponent={
          locations.length > 0 ? (
            <View style={styles.footer}>
              {error ? <InlineMessage message={error} tone="error" /> : null}
              {loadingMode === 'more' ? <ActivityIndicator color={colors.primary} /> : null}
              {canLoadMore ? (
                <AppButton
                  label="Carregar mais"
                  onPress={() => void loadPage((page?.number ?? 0) + 1, false, 'more')}
                  variant="secondary"
                />
              ) : null}
              {page?.last && !error ? (
                <Text style={styles.end}>Todos os locais disponíveis foram carregados.</Text>
              ) : null}
            </View>
          ) : undefined
        }
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            onRefresh={() => void loadPage(0, true, 'refresh')}
            refreshing={loadingMode === 'refresh'}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <SafeLocationCard
            location={item}
            onPress={() => appNavigation?.navigate('SafeLocationDetail', { locationId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, gap: spacing.md, padding: spacing.lg },
  footer: { gap: spacing.md, paddingTop: spacing.sm },
  end: { color: colors.textMuted, fontSize: typography.label, textAlign: 'center' },
});
