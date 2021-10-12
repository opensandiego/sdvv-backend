import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('committee')
export class CommitteeEntity {
  @PrimaryColumn()
  entity_id: string;

  @Column()
  entity_name: string;

  @PrimaryColumn()
  entity_name_lower: string;

  @Column()
  entity_type: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
