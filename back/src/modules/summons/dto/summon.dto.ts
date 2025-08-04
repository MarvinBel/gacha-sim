import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber, IsDate } from 'class-validator';
import { FolderName, PityType } from '../entities/summon.entity';

export class CharacterDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(['ml', 'ssr', 'sr', 'r'])
  folder: FolderName;
}

export class CreateSummonDto {
  @IsNotEmpty()
  @IsString()
  banner: string;

  @IsNotEmpty()
  @IsEnum(['soft pity', 'hard pity', 'no pity'])
  pityType: PityType;

  @IsOptional()
  @IsNumber()
  pityCount?: number;

  @IsOptional()
  @IsDate()
  timestamp?: Date;

  @IsNotEmpty()
  character: CharacterDto;
}

export class SummonResponseDto {
  id: string;
  banner: string;
  pityType: PityType;
  pityCount: number;
  timestamp: Date;
  characterFilename: string;
  characterTitle: string;
  characterFolder: FolderName;
  userId: string;
  createdAt: Date;
}

export class SummonStatsDto {
  average: number;
  totalSSR: number;
  totalPulls: number;
}
