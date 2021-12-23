import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@app/sdvv-database/shared/shared.module';
import { EXPNEntity } from './expn.entity';
import { EXPNService } from './expn.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([EXPNEntity])],
  providers: [EXPNService],
  exports: [EXPNService],
})
export class EXPNModule {}
