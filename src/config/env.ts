import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  accessTokenTtlMinutes: Number(process.env.ACCESS_TOKEN_TTL_MINUTES) || 10,
  refreshTokenTtlMinutes: Number(process.env.REFRESH_TOKEN_TTL_MINUTES) || 60 * 24 * 7,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
  syncDbOnBoot: process.env.SYNC_DB_ON_BOOT !== 'false',
  fileStoragePath: process.env.FILE_STORAGE_PATH || 'storage',
  dbDialect: process.env.DB_DIALECT || 'mysql',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbName: process.env.DB_NAME || 'erp_app',
  dbUser: process.env.DB_USER || 'erp_user',
  dbPassword: process.env.DB_PASSWORD || 'erp_pass',
  dbStorage: process.env.DB_STORAGE
};

