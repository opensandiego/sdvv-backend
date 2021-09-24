import { Module } from '@nestjs/common';
import { EfileStandaloneService } from './efile-standalone.service';

@Module({
  imports: [],
  providers: [EfileStandaloneService],
})
export class EfileStandaloneModule {}
