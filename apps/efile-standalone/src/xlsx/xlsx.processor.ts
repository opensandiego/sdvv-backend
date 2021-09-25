import { catchError, from, map, mergeMap, of } from 'rxjs';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { F460DService } from '@app/cal-data/f460d/f460d.service';
import { CreateF460DDto } from '@app/cal-data/f460d/dto/createF460D.dto';
import { XLSXDownloadService } from './xlsx.download.service';
import { XLSXTransformService } from './xlsx.conversion.service';

@Processor('cal-tasks')
export class XLSXProcessor {
  constructor(
    private xlsxDownloadService: XLSXDownloadService,
    private xlsxTransformService: XLSXTransformService,
    private f460DService: F460DService,
  ) {}

  @Process()
  action(job: Job) {
    console.log('IN EFileProcessor');

    this.processJob(job['data'].year).subscribe(() => console.log('Done'));
    // this.processJobWithTimer(job['data'].year).subscribe(() =>
    //   console.log('Done'),
    // );
  }

  private processJob(jobInput) {
    return of(jobInput).pipe(
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
    );
  }

  private processJobWithTimer(jobInput) {
    const start: Date = new Date();

    return this.processJob(jobInput).pipe(
      map(() =>
        console.info(
          'Execution time: %d',
          (new Date().valueOf() - start.valueOf()) / 1000,
          'seconds',
        ),
      ),
      catchError(() => {
        console.log('Error: in updated from eFile bulk download');
        return 'Error running task';
      }),
    );
  }
}
