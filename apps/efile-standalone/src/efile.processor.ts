import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { XLSXDownloadService } from './xlsx.download.service';
import { from, mergeMap, of } from 'rxjs';
import { XLSXTransformService } from './xlsx.conversion.service';
import { CreateF460DDto } from '@app/cal-data/f460d/dto/createF460D.dto';
import { F460DService } from '@app/cal-data/f460d/f460d.service';

@Processor('cal-tasks')
export class EFileProcessor {
  constructor(
    private xlsxDownloadService: XLSXDownloadService,
    private xlsxTransformService: XLSXTransformService,
    private f460DService: F460DService,
  ) {}

  @Process()
  async action(job: Job) {
    console.log('IN EFileProcessor');

    of(job['data'].year)
      .pipe(
        mergeMap((year) => this.xlsxDownloadService.getXLSXFile(year)),
        mergeMap((workbook) =>
          from(
            this.xlsxTransformService.processWorksheet(
              'F460-D-ContribIndepExpn',
              workbook,
              CreateF460DDto,
            ),
          ),
        ),
        mergeMap((data: CreateF460DDto[]) =>
          from(this.f460DService.createBulkF460D(data)),
        ),
        // map(
        //   async (workbook) =>
        //     await this.xlsxTransformService.processWorksheet(
        //       'S496',
        //       workbook,
        //       CreateS496DTO,
        //     ),
        // ),
      )
      .subscribe(() => console.log('Done'));
  }
}
