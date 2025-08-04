import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('pity')
export class Pity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  banner: string;

  @Column({ default: 0 })
  count: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('pity_history')
export class PityHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  banner: string;

  @Column()
  pulls: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
