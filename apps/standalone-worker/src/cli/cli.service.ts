import { Command, Console } from 'nestjs-console';
import { QueueController } from '../queue-producer/queue.controller';

/**
 * Command line tool to update the database manually.
 * Example for running 'initialize-data'. Replace with a command from a function decorator.
 *  node -r ts-node/register apps/standalone-worker/src/console.ts initialize-data
 */
@Console()
export class CLIService {
  constructor(private queueController: QueueController) {}

  @Command({
    command: 'update-elections',
    description:
      'Download the list of elections from eFile and add/update them in the database.',
  })
  async updateElections(): Promise<void> {
    await this.queueController.updateElections();
  }

  @Command({
    command: 'update-candidates-current',
    description:
      'Download the list of candidates for the current election and committees from eFile and add/update them in the database. Then add a committee name to each candidate.',
  })
  async updateCandidatesCurrent(): Promise<void> {
    await this.queueController.updateCandidatesCurrent();
  }

  @Command({
    command: 'update-candidates-past',
    description:
      'Download the list of candidates for the past elections and committees from eFile and add/update them in the database. Then add a committee name to each candidate.',
  })
  async updateCandidatesPast(): Promise<void> {
    await this.queueController.updateCandidatesPast();
  }

  @Command({
    command: 'update-transactions-current',
    description:
      'Download the XLSX files for the current election year then add the transactions from each sheet to the database.',
  })
  async updateTransactionsCurrent(): Promise<void> {
    await this.queueController.updateTransactionsCurrent();
  }

  // High memory usage. Gets upto 700MB then drops to ~ 200 MB after a year is processed.
  @Command({
    command: 'update-transactions-past',
    description:
      'Download the XLSX files for the past election years then add the transactions from each sheet to the database.',
  })
  async updateTransactionsPast(): Promise<void> {
    await this.queueController.updateTransactionsPast();
  }

  @Command({
    command: 'update-zip-codes',
    description:
      'Load the list of all zip codes from a local file add them to the database. Load the list of zip codes for each city council district and add them to the database.',
  })
  async updateZipCodes(): Promise<void> {
    await this.queueController.updateZipCodes();
  }

  @Command({
    command: 'initialize-data',
    description:
      'Shortcut to run commands: update-elections, update-candidates-current, update-candidates-past, update-transactions-current, update-transactions-past, and update-zip-codes',
  })
  async initializeData(): Promise<void> {
    await this.queueController.initializeData();
  }
}
