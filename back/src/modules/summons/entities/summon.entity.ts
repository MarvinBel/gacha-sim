import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type FolderName = 'ml' | 'ssr' | 'sr' | 'r';
export type PityType = 'soft pity' | 'hard pity' | 'no pity';

@Entity('summons')
export class Summon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  banner: string;

  @Column({
    type: 'enum',
    enum: ['soft pity', 'hard pity', 'no pity'],
    default: 'no pity',
  })
  pityType: PityType;

  @Column({ nullable: true })
  pityCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column()
  characterFilename: string;

  @Column()
  characterTitle: string;

  @Column({
    type: 'enum',
    enum: ['ml', 'ssr', 'sr', 'r'],
  })
  characterFolder: FolderName;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('summon_count')
export class SummonCount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  count: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
