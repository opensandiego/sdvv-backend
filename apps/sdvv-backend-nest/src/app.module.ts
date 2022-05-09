import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ServeStaticModule } from '@nestjs/serve-static';
import type { ClientOpts as RedisClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { getConnectionOptions } from 'typeorm';
import { EfileApiDataModule } from '@app/efile-api-data';
import { DatabaseModule } from '@app/sdvv-database';
import { RCPTModule } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.module';
import { EXPNModule } from '@app/sdvv-database/tables-xlsx/expn/expn.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          entities: null,
          migrations: null,
        }),
    }),
    BullModule.forRoot({
      redis: process.env.REDIS_URL,
    }),
    // CacheModule.register<RedisClientOpts>({
    //   store: redisStore,
    //   url: process.env.REDIS_URL,
    //   // In production set cache to 6 hours = 21600 seconds
    //   ttl: process.env.NODE_ENV === 'production' ? 21600 : 10,
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'sdvv-backend-nest/public'),
    }),
    EfileApiDataModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, RCPTModule, EXPNModule],
})
export class AppModule {}
