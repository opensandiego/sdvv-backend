import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'election' })
export class ElectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  election_date: string;

  @Column({ unique: true })
  election_id: string;

  @Column()
  election_type: string;

  @Column()
  internal: boolean;

  // Fields below are not from eFile
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
