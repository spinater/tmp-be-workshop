import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'point_transfers' })
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'from_user_id' })
  from!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'to_user_id' })
  to!: User;

  @Column({ type: 'integer' })
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
