import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { occurrenceService } from '../../api/occurrenceService';
import { AppButton } from '../../components/AppButton';
import { BrandHeader } from '../../components/BrandHeader';
import { InlineMessage } from '../../components/InlineMessage';
import { StatePanel } from '../../components/StatePanel';
import type { AppStackParamList, MainTabParamList } from '../../navigation/types';
import { useSession } from '../../session/SessionProvider';
import { colors, spacing, typography } from '../../theme/tokens';
import type { SpringPage } from '../../types/api';
import type { Occurrence } from '../../types/occurrence';
import { OccurrenceCard } from './OccurrenceCard';
import { canLoadNextPage, mergeOccurrencePage } from './occurrencePagination';
import { getOccurrenceErrorMessage } from './occurrenceValidation';

type Props = BottomTabScreenProps<MainTabParamList, 'Occurrences'>;
type LoadingMode = 'initial' | 'refresh' | 'more';

export function OccurrencesScreen({ navigation, route }: Props) {
  const { isAuthenticated } = useSession();
  const appNavigation = navigation.getParent<NativeStackNavigationProp<AppStackParamList>>();
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [page, setPage] = useState<SpringPage<Occurrence> | null>(null);
  const [loadingMode, setLoadingMode] = useState<LoadingMode | null>(
    isAuthenticated ? 'initial' : null,
  );
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const loadPage = async (pageNumber: number, replace: boolean, mode: LoadingMode) => {
    if (!isAuthenticated || loadingRef.current) return;

    loadingRef.current = true;
    setLoadingMode(mode);
    setError(null);
    try {
      const result = await occurrenceService.listMine({ page: pageNumber, size: 10 });
      setOccurrences((current) => mergeOccurrencePage(current, result, replace));
      setPage(result);
    } catch (requestError) {
      setError(getOccurrenceErrorMessage(requestError, 'list'));
    } finally {
      loadingRef.current = false;
      setLoadingMode(null);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    let active = true;
    loadingRef.current = true;
    occurrenceService
      .listMine({ page: 0, size: 10 })
      .then((result) => {
        if (!active) return;
        setOccurrences(result.content);
        setPage(result);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getOccurrenceErrorMessage(requestError, 'list'));
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
  }, [isAuthenticated, route.params?.refreshKey]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.previewContent}>
          <StatePanel
            message="Entre com uma conta para consultar e registrar ocorrências."
            state="empty"
            title="Visualização sem acesso aos dados"
          />
        </View>
      </SafeAreaView>
    );
  }

  const initialLoading = loadingMode === 'initial' && occurrences.length === 0;
  const canLoadMore = canLoadNextPage(page, loadingMode !== null);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={occurrences}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          initialLoading ? (
            <StatePanel
              message="Buscando os relatos associados à sua conta."
              state="loading"
              title="Carregando ocorrências"
            />
          ) : error ? (
            <StatePanel
              actionLabel="Tentar novamente"
              message={error}
              onAction={() => void loadPage(0, true, 'initial')}
              state="error"
              title="Não foi possível carregar"
            />
          ) : (
            <StatePanel
              actionLabel="Registrar primeira ocorrência"
              message="Você ainda não registrou nenhuma ocorrência."
              onAction={() => appNavigation?.navigate('NewOccurrence')}
              state="empty"
              title="Nenhuma ocorrência"
            />
          )
        }
        ListFooterComponent={
          occurrences.length > 0 ? (
            <View style={styles.footer}>
              {loadingMode === 'more' ? <ActivityIndicator color={colors.primary} /> : null}
              {canLoadMore ? (
                <AppButton
                  label="Carregar mais"
                  onPress={() => void loadPage((page?.number ?? 0) + 1, false, 'more')}
                  variant="secondary"
                />
              ) : page?.last ? (
                <Text style={styles.endText}>Todas as ocorrências foram carregadas.</Text>
              ) : null}
            </View>
          ) : undefined
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <BrandHeader
              description="Acompanhe somente os relatos registrados pela sua conta."
              eyebrow="ACOMPANHAMENTO"
              title="Minhas ocorrências"
            />
            <AppButton
              label="Registrar ocorrência"
              onPress={() => appNavigation?.navigate('NewOccurrence')}
            />
            {error && occurrences.length > 0 ? <InlineMessage message={error} /> : null}
          </View>
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
          <OccurrenceCard
            occurrence={item}
            onPress={() => appNavigation?.navigate('OccurrenceDetail', { occurrenceId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
  footer: {
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  endText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textAlign: 'center',
  },
});
