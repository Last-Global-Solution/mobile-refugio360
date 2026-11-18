import { createSubmissionGuard } from '../submissionGuard';

describe('submissionGuard', () => {
  it('bloqueia submissão duplicada enquanto o primeiro POST está pendente', async () => {
    let complete: ((value: string) => void) | undefined;
    const request = jest.fn(
      () =>
        new Promise<string>((resolve) => {
          complete = resolve;
        }),
    );
    const guard = createSubmissionGuard();

    const first = guard.run(request);
    const duplicate = guard.run(request);

    await expect(duplicate).resolves.toBeUndefined();
    expect(request).toHaveBeenCalledTimes(1);
    expect(guard.isRunning()).toBe(true);

    complete?.('criada');
    await expect(first).resolves.toBe('criada');
    expect(guard.isRunning()).toBe(false);
  });
});
