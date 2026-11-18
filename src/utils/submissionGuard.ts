export type SubmissionGuard = {
  run: <T>(submission: () => Promise<T>) => Promise<T | undefined>;
  isRunning: () => boolean;
};

export function createSubmissionGuard(): SubmissionGuard {
  let running = false;

  return {
    async run(submission) {
      if (running) return undefined;
      running = true;
      try {
        return await submission();
      } finally {
        running = false;
      }
    },
    isRunning: () => running,
  };
}
