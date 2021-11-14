import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@app/sdvv-database/shared/shared.module';
import { RCPTEntity } from './rcpt.entity';
import { RCPTService } from './rcpt.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([RCPTEntity])],
  providers: [RCPTService],
  exports: [RCPTService],
})
export class RCPTModule {}
