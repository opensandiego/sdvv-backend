import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ClassValidationService {
  public async getValidatedClasses(objects, dto): Promise<typeof dto[]> {
    const classes = plainToClass(dto, objects);

    const errors = await this.validateArray(classes);

    if (errors.length > 0) {
      console.log('validation failed.');
      // console.log('validation errors: ', errors);
      console.log('validation error count: ', errors.length);
      return [];
    } else {
      // console.log('validation succeed');
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
