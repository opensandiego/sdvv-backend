import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { ClassValidationService } from '@app/sdvv-database/shared/class-validation.service';
import { CreateS496Dto } from './s496.dto';

import { S496Entity } from './s496.entity';

@Injectable()
export class S496Service {
  private recType = 'S496';

  constructor(
    @InjectRepository(S496Entity)
    private s496Repository: Repository<S496Entity>,
    private sharedService: SharedService,
    private classValidationService: ClassValidationService,
  ) {}

  async findAll(): Promise<S496Entity[]> {
    return await this.s496Repository.find();
  }

  async createBulk(createS496Dto: CreateS496Dto[]): Promise<void> {
    await this.sharedService.createBulkData(createS496Dto, S496Entity);
  }

  async replaceYearData(
    sheetJSON: any[],
    year: string,
    formType = '',
  ): Promise<void> {
    const sheetClasses: CreateS496Dto[] =
      await this.classValidationService.getValidatedClasses(
        sheetJSON,
        CreateS496Dto,
      );

    const sheetClassesWithYears = this.sharedService.addYear(
      sheetClasses,
      year,
    );

    await this.sharedService.deleteBulkData(
      S496Entity,
      this.recType,
      year,
      formType,
    );

    await this.sharedService.createBulkData(sheetClassesWithYears, S496Entity);
  }
}
