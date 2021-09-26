import { catchError, from, map, mergeMap, of } from 'rxjs';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { F460DService } from '@app/cal-data/f460d/f460d.service';
import { CreateF460DDto } from '@app/cal-data/f460d/dto/createF460D.dto';
import { TransactionsXLSXDownloadService } from './transactions.xlsx.download.service';
import { UtilsService } from '../utils/utils.service';

@Processor('cal-tasks')
export class TransactionsXLSXProcessor {
  constructor(
    private transactionsXLSXDownloadService: TransactionsXLSXDownloadService,
    private f460DService: F460DService,
    private utilsService: UtilsService,
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
      mergeMap((year) =>
        this.transactionsXLSXDownloadService.getXLSXFile(year),
      ),
      mergeMap((workbook) =>
        from(
          this.utilsService.getValidatedClass(
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
      //     await this.utilsService.getValidatedClass(
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
