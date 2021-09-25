import { Module } from '@nestjs/common';
import { ClassValidationService } from './utils.class.validation.service';
import { UtilsService } from './utils.service';
import { XLSXConversionService } from './xlsx.conversion.service';

@Module({
  imports: [],
  providers: [ClassValidationService, XLSXConversionService, UtilsService],
  exports: [ClassValidationService, XLSXConversionService, UtilsService],
})
export class UtilsModule {}
