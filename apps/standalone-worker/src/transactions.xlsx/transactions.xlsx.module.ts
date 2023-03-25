import { CacheModule, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';

import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '@app/sdvv-database';
import { UtilsModule } from '../utils/utils.module';
import { TransactionsXLSXService } from './transactions.xlsx.service';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';
import { RCPTModule } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.module';
import { EXPNModule } from '@app/sdvv-database/tables-xlsx/expn/expn.module';
import { S496Module } from '@app/sdvv-database/tables-xlsx/s496/s496.module';
import { ConfigModule } from '@nestjs/config';

const url = new URL(process.env.REDIS_URL);

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UtilsModule,
    HttpModule,
    RCPTModule,
    EXPNModule,
    S496Module,
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          host: url.hostname,
          port: Number(url.port),
        }),
      }),
    }),
  ],
  providers: [TransactionsXLSXService, TransactionsXLSXDownloadService],
  exports: [TransactionsXLSXService],
})
export class TransactionsXLSXModule {}
