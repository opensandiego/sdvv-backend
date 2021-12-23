import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ClassValidationService } from './class-validation.service';

@Module({
  imports: [],
  providers: [SharedService, ClassValidationService],
  exports: [SharedService, ClassValidationService],
})
export class SharedModule {}
