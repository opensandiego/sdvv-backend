import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id: string;

  
  @Column()
  coe_id: string;

  @Column()
  filer_id: string;

  @Column()
  office_id: string;

  @Column()
  election_id: string;

  @Column()
  first_name: string;

  @Column()
  middle_name: string | null;

  @Column()
  last_name: string;

  @Column()
  title: string | null;

  @Column()
  suffix: string | null;

  @Column()
  office: string;

  @Column()
  office_code: string;

  @Column()
  jurisdiction_id: string;

  @Column()
  district: string | null;

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
  @Column()
  candidate_controlled_committee_name: string | null;
}
