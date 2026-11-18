import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { orientationService } from '../../api/orientationService';
import { AppButton } from '../../components/AppButton';
import { InlineMessage } from '../../components/InlineMessage';
import { StatePanel } from '../../components/StatePanel';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import type { SpringPage } from '../../types/api';
import type { Orientation } from '../../types/orientation';
import { formatDateTime } from '../../utils/formatters';
import { getOrientationErrorMessage } from './orientationErrors';
import { canLoadNextOrientationPage, mergeOrientationPage } from './orientationPagination';
import { pollForOrientations } from './orientationPolling';
import { formatOrientationProfile, getOrientationOrigin } from './orientationPresentation';

type Phase = 'polling' | 'ready' | 'timeout' | 'error';
type Props = { occurrenceId: number; isAuthenticated: boolean };

export function OccurrenceOrientations(props: Props) {
  return <OccurrenceOrientationsContent key={props.occurrenceId} {...props} />;
}

function OccurrenceOrientationsContent({ occurrenceId, isAuthenticated }: Props) {
  const [orientations, setOrientations] = useState<Orientation[]>([]);
  const [page, setPage] = useState<SpringPage<Orientation> | null>(null);
  const [phase, setPhase] = useState<Phase>('polling');
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const requestControllerRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const controller = new AbortController();
    requestControllerRef.current = controller;
    pollForOrientations({
      fetchPage: (signal) =>
        orientationService.listByOccurrence(occurrenceId, { page: 0, size: 10, signal }),
      signal: controller.signal,
    })
      .then((result) => {
        if (!mountedRef.current || result.status === 'cancelled') return;
        if (result.status === 'found') {
          setOrientations(result.page.content);
          setPage(result.page);
          setPhase('ready');
          return;
        }
        setPhase('timeout');
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted || !mountedRef.current) return;
        setError(getOrientationErrorMessage(requestError));
        setPhase('error');
      });

    return () => {
      controller.abort();
      requestControllerRef.current?.abort();
      loadingRef.current = false;
    };
  }, [occurrenceId, isAuthenticated]);

  const refresh = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsRefreshing(true);
    setError(null);
    const controller = new AbortController();
    requestControllerRef.current = controller;
    try {
      const result = await orientationService.listByOccurrence(occurrenceId, {
        page: 0,
        size: 10,
        signal: controller.signal,
      });
      if (!mountedRef.current || controller.signal.aborted) return;
      setOrientations(result.content);
      setPage(result);
      setPhase(result.content.length > 0 ? 'ready' : 'timeout');
    } catch (requestError) {
      if (controller.signal.aborted) return;
      setError(getOrientationErrorMessage(requestError));
      setPhase('error');
    } finally {
      loadingRef.current = false;
      if (mountedRef.current) setIsRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (!canLoadNextOrientationPage(page, loadingRef.current)) return;
    loadingRef.current = true;
    setIsLoadingMore(true);
    setError(null);
    const controller = new AbortController();
    requestControllerRef.current = controller;
    try {
      const result = await orientationService.listByOccurrence(occurrenceId, {
        page: (page?.number ?? 0) + 1,
        size: 10,
        signal: controller.signal,
      });
      if (!mountedRef.current || controller.signal.aborted) return;
      setOrientations((current) => mergeOrientationPage(current, result));
      setPage(result);
    } catch (requestError) {
      if (!controller.signal.aborted) {
        setError(getOrientationErrorMessage(requestError));
      }
    } finally {
      loadingRef.current = false;
      if (mountedRef.current) setIsLoadingMore(false);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={styles.sectionTitle}>Orientações</Text>
        <Text style={styles.sectionDescription}>
          Conteúdo informativo gerado automaticamente a partir do relato.
        </Text>
      </View>

      <InlineMessage
        message="Estas orientações não são alertas oficiais e não substituem instruções da Defesa Civil."
        tone="info"
      />

      {phase === 'polling' ? (
        <StatePanel
          message="A API ainda não retornou uma orientação. A consulta será repetida por um período limitado."
          state="loading"
          title="Aguardando orientação"
        />
      ) : null}

      {phase === 'timeout' ? (
        <StatePanel
          actionDisabled={isRefreshing}
          actionLabel={isRefreshing ? 'Atualizando...' : 'Atualizar orientações'}
          message="Orientação ainda indisponível. Você pode tentar novamente mais tarde."
          onAction={() => void refresh()}
          state="empty"
          title="Nenhuma orientação disponível"
        />
      ) : null}

      {phase === 'error' ? (
        <StatePanel
          actionDisabled={isRefreshing}
          actionLabel={isRefreshing ? 'Atualizando...' : 'Tentar novamente'}
          message={error ?? 'Não foi possível consultar as orientações.'}
          onAction={() => void refresh()}
          state="error"
          title="Orientações indisponíveis"
        />
      ) : null}

      {phase === 'ready' ? (
        <View style={styles.list}>
          {error ? <InlineMessage message={error} tone="error" /> : null}
          {orientations.map((orientation) => (
            <OrientationCard key={orientation.id} orientation={orientation} />
          ))}
          <AppButton
            disabled={isRefreshing}
            label={isRefreshing ? 'Atualizando...' : 'Atualizar orientações'}
            onPress={() => void refresh()}
            variant="secondary"
          />
          {isLoadingMore ? <ActivityIndicator color={colors.primary} /> : null}
          {canLoadNextOrientationPage(page, isLoadingMore || isRefreshing) ? (
            <AppButton
              label="Carregar orientações anteriores"
              onPress={() => void loadMore()}
              variant="secondary"
            />
          ) : null}
          {page?.last ? (
            <Text style={styles.end}>Todas as orientações foram carregadas.</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function OrientationCard({ orientation }: { orientation: Orientation }) {
  return (
    <View style={[styles.card, orientation.geradoPorIA ? styles.aiCard : styles.localCard]}>
      <View style={styles.cardHeader}>
        <Text
          style={[styles.origin, orientation.geradoPorIA ? styles.aiOrigin : styles.localOrigin]}
        >
          {getOrientationOrigin(orientation)}
        </Text>
        <Text style={styles.date}>{formatDateTime(orientation.criadaEm)}</Text>
      </View>
      <Text style={styles.message}>{orientation.mensagem}</Text>
      <Text style={styles.metadata}>Perfil: {formatOrientationProfile(orientation.perfil)}</Text>
      {orientation.locaisConsiderados.length > 0 ? (
        <Text style={styles.metadata}>
          Locais considerados: {orientation.locaisConsiderados.map((id) => `#${id}`).join(', ')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  heading: { gap: spacing.xs },
  sectionTitle: { color: colors.secondary, fontSize: typography.heading, fontWeight: '800' },
  sectionDescription: { color: colors.textMuted, fontSize: typography.label, lineHeight: 20 },
  list: { gap: spacing.md },
  card: {
    gap: spacing.md,
    borderLeftWidth: 4,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  aiCard: { borderLeftColor: colors.primary },
  localCard: { borderLeftColor: colors.warning },
  cardHeader: { gap: spacing.sm },
  origin: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    fontSize: typography.caption,
    fontWeight: '900',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  aiOrigin: { backgroundColor: colors.primarySoft, color: colors.primaryPressed },
  localOrigin: { backgroundColor: colors.warningSoft, color: colors.warning },
  date: { color: colors.textMuted, fontSize: typography.caption },
  message: { color: colors.text, fontSize: typography.body, lineHeight: typography.lineHeightBody },
  metadata: { color: colors.textMuted, fontSize: typography.label, lineHeight: 20 },
  end: { color: colors.textMuted, fontSize: typography.caption, textAlign: 'center' },
});
