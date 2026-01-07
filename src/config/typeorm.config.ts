import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const TypeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const isProd = configService.get<string>('NODE_ENV') === 'production';

    // Support Supabase pooler env vars (DB_POOLER_*) or fall back to DATABASE_*
    const poolerHost = configService.get<string>('DB_POOLER_HOST');
    const poolerUser = configService.get<string>('DB_POOLER_USER');
    const poolerPort = configService.get<number>('DB_POOLER_PORT');

    const host = poolerHost || configService.get<string>('DATABASE_HOST');
    const port = poolerPort || configService.get<number>('DATABASE_PORT') || 5432;
    const username = poolerUser || configService.get<string>('DATABASE_USER') || configService.get<string>('DB_USER') || 'postgres';
    const password = configService.get<string>('DATABASE_PASSWORD') || configService.get<string>('DB_PASSWORD');
    const database = configService.get<string>('DATABASE_NAME') || configService.get<string>('DB_NAME') || 'postgres';
    
    // Auto-detect SSL requirement: Supabase (remote hosts) or explicit DATABASE_SSL
    const explicitSsl = configService.get<string>('DATABASE_SSL');
    const isRemoteHost = host && !host.includes('localhost') && !host.includes('127.0.0.1');
    const useSsl = explicitSsl === 'true' || (explicitSsl !== 'false' && isRemoteHost);

    const isTransactionPooler = port === 6543; // Supabase transaction pooler

    if (!host || !password) {
      throw new Error(
        'Database credentials not found! Set DB_POOLER_HOST/DB_POOLER_USER/DB_PASSWORD or DATABASE_HOST/DATABASE_USER/DATABASE_PASSWORD'
      );
    }

    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,

      autoLoadEntities: true,

      // Auto-sync in development only (creates tables automatically)
      // ❗ NEVER auto-sync in production - use migrations instead
      synchronize: !isProd,

      // ❗ Supabase requires SSL for remote connections
      ssl: useSsl
        ? {
            rejectUnauthorized: false,
          }
        : false,

      extra: {
        max: 20,
        connectionTimeoutMillis: 5000,
        statement_timeout: 0,

        // ❗ REQUIRED for Supabase transaction pooler
        ...(isTransactionPooler && {
          prepare: false,
        }),
      },
    };
  },
};
