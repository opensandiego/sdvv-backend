import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'candidate' })
export class CandidateEntity {
  @Column()
  filer_id: string;

  @Column()
  office_id: string;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  suffix: string;

  @Column()
  office: string;

  @Column()
  office_code: string;

  @Column()
  jurisdiction_id: string;

  @Column({ nullable: true })
  district: string;

  @Column()
  agency: string;

  @Column()
  jurisdiction_type: string;

  @Column()
  jurisdiction_name: string;

  @Column()
  jurisdiction_code: string;

  @Column()
  candidate_name: string;

  // Fields below are not from eFile
  @Column({ nullable: true })
  candidate_controlled_committee_name: string;

  @Column()
  election_year: string;

  @PrimaryColumn()
  candidate_id: string;

  @Column({ default: false })
  in_general_election: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageURL: string;

  @Column({ nullable: true })
  website: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
