import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ServeStaticModule } from '@nestjs/serve-static';

import { redisStore } from 'cache-manager-redis-yet';

import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EfileApiDataModule } from '@app/efile-api-data';
import { DatabaseModule } from '@app/sdvv-database';
import { RCPTModule } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.module';
import { EXPNModule } from '@app/sdvv-database/tables-xlsx/expn/expn.module';
import { S496Module } from '@app/sdvv-database/tables-xlsx/s496/s496.module';

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
        ssl: false,
      }),
    }),
    BullModule.forRoot({
      redis: process.env.REDIS_URL,
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URL,
          // 6 hours = 21600000 milliseconds
          // 10 seconds = 10000 milliseconds
          ttl: process.env.NODE_ENV === 'production' ? 21600000 : 10000,
        }),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'sdvv-backend-nest/public'),
    }),
    EfileApiDataModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, RCPTModule, EXPNModule, S496Module],
})
export class AppModule {}
