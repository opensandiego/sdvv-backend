import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { S496Entity } from '../tables-xlsx/s496/s496.entity';
import { EXPNEntity } from '../tables-xlsx/expn/expn.entity';

@Entity({ name: 'candidate' })
export class CandidateEntity {
  @Column()
  filer_id!: string;

  @Column()
  office_id!: string;

  @Column()
  first_name!: string;

  @Column({ nullable: true })
  middle_name?: string | null;

  @Column()
  last_name!: string;

  @Column({ nullable: true })
  title?: string | null;

  @Column({ nullable: true })
  suffix?: string | null;

  @Column()
  office!: string;

  @Column()
  office_code!: string;

  @Column()
  jurisdiction_id!: string;

  // If district has a non-null value then the candidate is running for City Council and district is the district number
  @Column({ nullable: true })
  district?: string | null;

  @Column()
  agency!: string;

  @Column()
  jurisdiction_type!: string;

  @Column()
  jurisdiction_name!: string;

  @Column()
  jurisdiction_code!: string;

  @Column()
  candidate_name!: string;

  // Fields below are not from eFile
  @Column({ nullable: true })
  candidate_controlled_committee_name?: string | null;

  @Column()
  full_office_name!: string;

  @Column()
  election_year!: string;

  @PrimaryColumn()
  candidate_id!: string;

  @Column('text', { array: true, nullable: true })
  alternate_candidate_names?: string[] | null;

  @Column({ default: false })
  in_general_election!: boolean;

  @Column({ default: false })
  in_primary_election!: boolean;

  @Column({ nullable: true })
  description?: string | null;

  @Column({ nullable: true })
  image_url?: string | null;

  @Column({ nullable: true })
  website?: string | null;
  
  // Use to indicate independent expenditure transactions
  // that support or oppose this candidate from expn
  @OneToMany(
    () => EXPNEntity,
    (transactions) => transactions.candidate_supp_opp,
  )
  expn_supp_opp_transactions!: EXPNEntity[];

  // Use to indicate independent expenditure transactions
  // that support or oppose this candidate from s496  
  @OneToMany(
    () => S496Entity,
    (transactions) => transactions.candidate_supp_opp,
  )
  s496_supp_opp_transactions!: S496Entity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
