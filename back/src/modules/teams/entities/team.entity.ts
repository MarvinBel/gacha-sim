import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type FolderName = 'ml' | 'ssr' | 'sr' | 'r';

@Entity('team_characters')
export class TeamCharacter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ['ml', 'ssr', 'sr', 'r'],
  })
  folder: FolderName;

  @Column()
  color: string;

  @Column('simple-array')
  tags: string[];

  @Column('simple-array')
  role: string[];
}

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('json')
  characters: TeamCharacter[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('team_data')
export class TeamData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('json')
  data: Record<string, TeamCharacter[]>;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
