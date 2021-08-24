import { PartialType } from '@nestjs/mapped-types';
import { CreateElectionDto } from './createElection.dto';

export class UpdateElectionDto extends PartialType(CreateElectionDto) {}
