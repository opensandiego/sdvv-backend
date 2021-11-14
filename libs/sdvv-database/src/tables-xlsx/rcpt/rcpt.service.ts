import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedService } from '@app/sdvv-database/shared/shared.service';
import { ClassValidationService } from '@app/sdvv-database/shared/class-validation.service';
import { CreateRCPTDto } from './rcpt.dto';
import { RCPTEntity } from './rcpt.entity';

@Injectable()
export class RCPTService {
  private recType = 'RCPT';

  constructor(
    @InjectRepository(RCPTEntity)
    private rcptRepository: Repository<RCPTEntity>,
    private sharedService: SharedService,
    private classValidationService: ClassValidationService,
  ) {}

  async findAll(): Promise<RCPTEntity[]> {
    console.log('rcptRepository findAll');

    return await this.rcptRepository.find();
  }

  async createBulk(createRCPTDto: CreateRCPTDto[]): Promise<void> {
    await this.sharedService.createBulkData(createRCPTDto, RCPTEntity);
  }

  async replaceYearData(
    sheetJSON: any[],
    year: string,
    formType = '',
  ): Promise<void> {
    const sheetClasses: CreateRCPTDto[] =
      await this.classValidationService.getValidatedClasses(
        sheetJSON,
        CreateRCPTDto,
      );

    this.sharedService.addYear(sheetClasses, year);

    await this.sharedService.deleteBulkData(
      RCPTEntity,
      this.recType,
      year,
      formType,
    );

    await this.sharedService.createBulkData(sheetClasses, RCPTEntity);
  }
}
