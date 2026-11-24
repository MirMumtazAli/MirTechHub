export const environment = {
  production: false,
  appName: 'MTHUI',
  version: '0.0.1-dev',

  api: {
    apiUrl: 'http://localhost:5121/api',
    timeoutMs: 30000
  },

  logging: {
    level: 'debug'
  },

  featureFlags: {
    enableBetaUI: true
  }
};
