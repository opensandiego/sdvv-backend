import { Module } from '@nestjs/common';
import { EfileStandaloneController } from './efile-standalone.controller';
import { EfileStandaloneService } from './efile-standalone.service';

@Module({
  imports: [],
  controllers: [EfileStandaloneController],
  providers: [EfileStandaloneService],
})
export class EfileStandaloneModule {}
