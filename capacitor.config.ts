
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a1f27140ceef4b0ab00a6f1d675cf346',
  appName: 'gestion-transporte-avicola',
  webDir: 'dist',
  server: {
    url: 'https://a1f27140-ceef-4b0a-b00a-6f1d675cf346.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
      releaseType: null,
      signingType: null,
    }
  }
};

export default config;
