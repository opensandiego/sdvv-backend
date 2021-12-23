import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('jurisdiction')
export class JurisdictionEntity {
  @Column()
  city: string;

  @Column()
  type: string;

  @PrimaryColumn()
  name: string;

  @Column('text', { array: true })
  zipCodes: string[];

  // Added fields that are not in the .JSON file.
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
