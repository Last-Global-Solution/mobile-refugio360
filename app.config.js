const { execFileSync } = require('node:child_process');

module.exports = ({ config }) => {
  // EAS preview exige um commit: o checkout remoto e o APK recebem o mesmo SHA.
  const buildCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf8',
  }).trim();

  if (!/^[0-9a-f]{40}$/.test(buildCommit)) {
    throw new Error('Não foi possível identificar o commit Git do build.');
  }

  return {
    ...config,
    extra: {
      ...config.extra,
      buildCommit,
    },
  };
};
