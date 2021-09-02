import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'election' })
export class ElectionEntity {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column({ unique: true })
  election_date: string;

  @PrimaryColumn()
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
