import type { SpringPage } from '../../types/api';
import type { Orientation } from '../../types/orientation';

export const ORIENTATION_POLL_DELAYS_MS = [
  1_000, 2_000, 3_000, 5_000, 5_000, 5_000, 5_000, 5_000,
] as const;
export const ORIENTATION_POLL_MAX_DURATION_MS = 30_000;

type PollResult =
  | { status: 'found'; page: SpringPage<Orientation> }
  | { status: 'timeout' }
  | { status: 'cancelled' };

type WaitForDelay = (delayMs: number, signal: AbortSignal) => Promise<boolean>;

export function waitForDelay(delayMs: number, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve(false);
      return;
    }

    let settled = false;
    const finish = (completed: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      signal.removeEventListener('abort', cancel);
      resolve(completed);
    };
    const cancel = () => finish(false);
    const timeout = setTimeout(() => finish(true), delayMs);
    signal.addEventListener('abort', cancel, { once: true });
  });
}

export async function pollForOrientations({
  fetchPage,
  signal,
  delays = ORIENTATION_POLL_DELAYS_MS,
  maxDurationMs = ORIENTATION_POLL_MAX_DURATION_MS,
  now = Date.now,
  wait = waitForDelay,
}: {
  fetchPage: (signal: AbortSignal) => Promise<SpringPage<Orientation>>;
  signal: AbortSignal;
  delays?: readonly number[];
  maxDurationMs?: number;
  now?: () => number;
  wait?: WaitForDelay;
}): Promise<PollResult> {
  const startedAt = now();

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    if (signal.aborted) return { status: 'cancelled' };
    const remainingBeforeRequest = maxDurationMs - (now() - startedAt);
    if (attempt > 0 && remainingBeforeRequest <= 0) return { status: 'timeout' };

    const requestController = new AbortController();
    const cancelRequest = () => requestController.abort();
    signal.addEventListener('abort', cancelRequest, { once: true });
    const requestTimeout = setTimeout(cancelRequest, Math.max(remainingBeforeRequest, 0));

    let page: SpringPage<Orientation>;
    try {
      page = await fetchPage(requestController.signal);
    } catch (error) {
      if (signal.aborted) return { status: 'cancelled' };
      if (requestController.signal.aborted) return { status: 'timeout' };
      throw error;
    } finally {
      clearTimeout(requestTimeout);
      signal.removeEventListener('abort', cancelRequest);
    }

    if (signal.aborted) return { status: 'cancelled' };
    if (page.content.length > 0) return { status: 'found', page };
    if (attempt === delays.length) return { status: 'timeout' };

    const remainingBeforeWait = maxDurationMs - (now() - startedAt);
    if (remainingBeforeWait <= 0) return { status: 'timeout' };
    const completed = await wait(Math.min(delays[attempt] ?? 0, remainingBeforeWait), signal);
    if (!completed || signal.aborted) return { status: 'cancelled' };
  }

  return { status: 'timeout' };
}
