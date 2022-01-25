import { Module } from '@nestjs/common';
import { ZipCodeService } from './zip-code.service';

/**
 * This module should be eventually be combined with ZipCodesModule
 * in a folder named 'zip-code' or ''zip-codes'.
 */
@Module({
  imports: [],
  providers: [ZipCodeService],
  exports: [ZipCodeService],
})
export class ZipCodeModule {}
