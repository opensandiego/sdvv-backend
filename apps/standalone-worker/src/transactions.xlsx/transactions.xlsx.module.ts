import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
// import { redisStore } from 'cache-manager-ioredis-yet';

import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '@app/sdvv-database';
import { UtilsModule } from '../utils/utils.module';
import { TransactionsXLSXService } from './transactions.xlsx.service';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';
import { RCPTModule } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.module';
import { EXPNModule } from '@app/sdvv-database/tables-xlsx/expn/expn.module';
import { S496Module } from '@app/sdvv-database/tables-xlsx/s496/s496.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    UtilsModule,
    HttpModule,
    RCPTModule,
    EXPNModule,
    S496Module,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        url: process.env.REDIS_URL,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TransactionsXLSXService, TransactionsXLSXDownloadService],
  exports: [TransactionsXLSXService],
})
export class TransactionsXLSXModule {}
