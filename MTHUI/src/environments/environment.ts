export const environment = {
  production: false,
  appName: 'MTHUI',
  version: '0.0.1-dev',
  api: {
    apiUrl: 'http://localhost:5121/api',
    timeoutMs: 30000
  },
  logging: {
    level: 'debug' // possible values: 'debug' | 'info' | 'warn' | 'error'
  },
  featureFlags: {
    enableBetaUI: false
  }
};

/*
 * For easier debugging in development mode, you can import a file to ignore zone related error
 * stack frames such as `zone.js/plugins/zone-error`. This import should be commented out in production mode
 * because it will have a performance impact when errors are thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
