import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const TypeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const isProd = configService.get<string>('NODE_ENV') === 'production';

    const host = configService.get<string>('DATABASE_HOST');
    const port = configService.get<number>('DATABASE_PORT') || 5432;
    const username = configService.get<string>('DATABASE_USER');
    const password = configService.get<string>('DATABASE_PASSWORD');
    const database = configService.get<string>('DATABASE_NAME');
    const useSsl = configService.get<string>('DATABASE_SSL') === 'true';

    const isTransactionPooler = port === 6543; // Supabase pooler

    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,

      autoLoadEntities: true,

      // ❗ NEVER auto-sync in live
      synchronize: false,

      // ❗ Supabase requires SSL
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
