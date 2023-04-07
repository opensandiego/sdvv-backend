import { Module } from '@nestjs/common';
import { UpdateCommandController } from './update-command.controller';
import { UpdateCommandService } from './update-command.service';

@Module({
  imports: [],
  controllers: [UpdateCommandController],
  providers: [UpdateCommandService],
})
export class UpdateCommandModule {}
