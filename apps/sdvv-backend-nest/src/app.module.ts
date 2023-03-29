import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EfileApiDataModule } from '@app/efile-api-data';
import { DatabaseModule } from '@app/sdvv-database';
import { RCPTModule } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.module';
import { EXPNModule } from '@app/sdvv-database/tables-xlsx/expn/expn.module';
import { S496Module } from '@app/sdvv-database/tables-xlsx/s496/s496.module';
import { HealthModule } from './health/health.module';

const SIX_HOURS = 21600000; // milliseconds
const TEN_SECONDS = 10000; // milliseconds

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: false,
        autoLoadEntities: true,
        ssl:
          process.env.NODE_ENV === 'production'
            ? {
                rejectUnauthorized: false,
              }
            : false,
      }),
    }),
    BullModule.forRoot({
      redis: process.env.REDIS_URL,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        url: process.env.REDIS_URL,
        ttl: process.env.NODE_ENV === 'production' ? SIX_HOURS : TEN_SECONDS,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'sdvv-backend-nest/public'),
    }),
    EfileApiDataModule,
    DatabaseModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, RCPTModule, EXPNModule, S496Module],
})
export class AppModule {}
