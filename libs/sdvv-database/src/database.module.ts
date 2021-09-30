import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { F460DModule } from './f460d/f460d.module';
import { ZipCodesModule } from './zipCodes/zipCodes.module';

@Module({
  imports: [ZipCodesModule, F460DModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
