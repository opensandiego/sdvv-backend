import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { ClassValidationService } from '@app/sdvv-database/shared/class-validation.service';
import { CreateEXPNDto } from './expn.dto';
import { EXPNEntity } from './expn.entity';

@Injectable()
export class EXPNService {
  private recType = 'EXPN';

  constructor(
    @InjectRepository(EXPNEntity)
    private expnRepository: Repository<EXPNEntity>,
    private sharedService: SharedService,
    private classValidationService: ClassValidationService,
  ) {}

  async findAll(): Promise<EXPNEntity[]> {
    console.log('expnRepository findAll');

    return await this.expnRepository.find();
  }

  async createBulk(createEXPNDto: CreateEXPNDto[]): Promise<void> {
    await this.sharedService.createBulkData(createEXPNDto, EXPNEntity);
  }

  async replaceYearData(
    sheetJSON: any[],
    year: string,
    formType = '',
  ): Promise<void> {
    const sheetClasses: CreateEXPNDto[] =
      await this.classValidationService.getValidatedClasses(
        sheetJSON,
        CreateEXPNDto,
      );

    this.sharedService.addYear(sheetClasses, year);

    await this.sharedService.deleteBulkData(
      EXPNEntity,
      this.recType,
      year,
      formType,
    );

    await this.sharedService.createBulkData(sheetClasses, EXPNEntity);
  }
}
