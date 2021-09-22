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
  decommissioned: number;

  @Column()
  primary_city: string;

  @Column()
  acceptable_cities: string;

  @Column()
  unacceptable_cities: string;

  @Column()
  state: string;

  @Column()
  county: string;

  @Column()
  timezone: string;

  @Column()
  area_codes: number;

  @Column()
  world_region: string;

  @Column()
  country: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  irs_estimated_population_2015: number;
}
