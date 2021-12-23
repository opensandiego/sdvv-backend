import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ClassValidationService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getValidatedClasses(objects, dto): Promise<typeof dto[]> {
    const classes = plainToClass(dto, objects);

    const errors = await this.validateArray(classes);

    if (errors.length > 0) {
      this.logger.log({
        level: 'error',
        message: 'Class validation failed',
        errorCount: errors.length,
      });

      throw 'Class validation failed';
    }

    return classes;
  }

  private async validateArray(items) {
    const errorArrays = [];
    for await (const item of items) {
      const validationErrors = await validate(item, {
        skipMissingProperties: true,
      });
      if (validationErrors.length > 0) {
        errorArrays.push(validationErrors);
      }
    }
    return errorArrays;
  }
}
