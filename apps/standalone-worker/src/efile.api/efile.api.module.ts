import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ElectionsUpdateService } from './elections.update.service';
import { UtilsModule } from '../utils/utils.module';
import { SharedModule } from '@app/sdvv-database/shared/shared.module';

@Module({
  imports: [HttpModule, UtilsModule, SharedModule],
  providers: [ElectionsUpdateService],
  exports: [ElectionsUpdateService],
})
export class EFileApiModule {}
