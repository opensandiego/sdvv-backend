import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'election' })
export class ElectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  election_date: string;

  @Column()
  election_id: string;

  @Column()
  election_type: string;

  @Column()
  internal: boolean;
}
