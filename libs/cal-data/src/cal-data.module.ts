import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'apps/sdvv-backend-nest/src/config/database.config';
import { CalDataService } from './cal-data.service';
import { F460DModule } from './f460d/f460d.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    F460DModule,
  ],
  providers: [CalDataService],
  exports: [CalDataService, F460DModule],
})
export class CalDataModule {}
