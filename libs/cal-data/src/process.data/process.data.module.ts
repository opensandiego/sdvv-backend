import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from 'apps/sdvv-backend-nest/src/transactions/transactions.entity';
import { UpdateIndepExpnService } from './update.indep.expn.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [UpdateIndepExpnService],
  exports: [UpdateIndepExpnService],
})
export class ProcessDataModule {}
