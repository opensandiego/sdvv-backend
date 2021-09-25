import { Module } from '@nestjs/common';
import { ClassValidationService } from './class.validation.service';

@Module({
  imports: [],
  providers: [ClassValidationService],
  exports: [ClassValidationService],
})
export class UtilsModule {}
