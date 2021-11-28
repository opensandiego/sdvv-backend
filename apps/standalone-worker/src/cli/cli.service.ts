import { Command, Console } from 'nestjs-console';
import { QueueController } from '../queue-producer/queue.controller';

@Console()
export class CLIService {
  constructor(private queueController: QueueController) {}

  @Command({
    command: 'update-elections',
    description:
      'Download the list of elections from eFile and add/update them in the database.',
  })
  async updateElections(): Promise<void> {
    this.queueController.updateElections();
  }

  @Command({
    command: 'update-candidates-current',
    description:
      'Download the list of candidates for the current election and committees from eFile and add/update them in the database. Then add a committee name to each candidate.',
  })
  async updateCandidatesCurrent(): Promise<void> {
    this.queueController.updateCandidatesCurrent();
  }

  @Command({
    command: 'update-candidates-past',
    description:
      'Download the list of candidates for the past elections and committees from eFile and add/update them in the database. Then add a committee name to each candidate.',
  })
  async updateCandidatesPast(): Promise<void> {
    this.queueController.updateCandidatesPast();
  }

  @Command({
    command: 'update-transactions-current',
    description:
      'Download the XLSX files for the current election year then add the transactions from each sheet to the database.',
  })
  async updateTransactionsCurrent(): Promise<void> {
    this.queueController.updateTransactionsCurrent();
  }

  @Command({
    command: 'update-transactions-past',
    description:
      'Download the XLSX files for the past election years then add the transactions from each sheet to the database.',
  })
  async updateTransactionsPast(): Promise<void> {
    this.queueController.updateTransactionsPast();
  }

  @Command({
    command: 'update-zip-codes',
    description:
      'Load the list of all zip codes from a local file add them to the database. Load the list of zip codes for each city council district and add them to the database.',
  })
  async updateZipCodes(): Promise<void> {
    this.queueController.updateZipCodes();
  }
}
