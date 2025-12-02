export const environment = {
  production: true,
  apiUrl: 'https://api.mediastore.com/api', // Cambiar por tu URL de producción
  appName: 'MediaStore',
  version: '1.0.0',
  defaultLanguage: 'es',
  tokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  userKey: 'current_user',
  cartKey: 'shopping_cart',
  enableDebug: false,
  
  // Configuración de terceros
  googleAnalyticsId: 'UA-XXXXXXXXX-X', // Tu ID de Google Analytics
  sentryDsn: '', // Tu DSN de Sentry si usas
  
  // Configuración de pagos (ejemplo con Stripe)
  stripePublicKey: 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx',
  
  // Límites de la aplicación
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxImageSize: 2 * 1024 * 1024, // 2MB
  
  // Tiempos de espera
  apiTimeout: 30000, // 30 segundos
  sessionTimeout: 3600, // 1 hora en segundos
  
  // Características
  enableAnalytics: true,
  enableErrorTracking: false,
  enableTwoFactor: true,
  enableSocialLogin: false,
  
  // URLs importantes
  termsUrl: 'https://mediastore.com/terminos',
  privacyUrl: 'https://mediastore.com/privacidad',
  supportEmail: 'soporte@mediastore.com',
  contactPhone: '+1 234 567 890'
};
