import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { XLSXDownloadService } from './xlsx.download.service';
import { map, mergeMap, of } from 'rxjs';
import { XLSXTransformService } from './xlsx.conversion.service';
import { CreateF460DDto } from '@app/cal-data/f460d/dto/createF460D.dto';

@Processor('cal-tasks')
export class EFileProcessor {
  constructor(
    private xlsxDownloadService: XLSXDownloadService,
    private xlsxTransformService: XLSXTransformService,
  ) {}

  @Process()
  async action(job: Job) {
    console.log('IN EFileProcessor');

    of(job['data'].year)
      .pipe(
        mergeMap((year) => this.xlsxDownloadService.getXLSXFile(year)),
        map(
          async (workbook) =>
            await this.xlsxTransformService.processWorksheet(
              'F460-D-ContribIndepExpn',
              workbook,
              CreateF460DDto,
            ),
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
