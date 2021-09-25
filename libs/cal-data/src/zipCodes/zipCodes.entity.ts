import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('zipCode')
export class ZipCodeEntity {
  @PrimaryColumn()
  zip: string;

  @Column()
  type: string;

  @Column()
  decommissioned: string;

  @Column()
  primary_city: string;

  @Column({ nullable: true })
  acceptable_cities: string;

  @Column({ nullable: true })
  unacceptable_cities: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  county: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  area_codes: string;

  @Column()
  world_region: string;

  @Column()
  country: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  irs_estimated_population_2015: string;

  // Added fields that are not in the .CSV file.
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
