import { IsNotEmpty, IsString, IsArray, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FolderName } from '../entities/team.entity';

export class TeamCharacterDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(['ml', 'ssr', 'sr', 'r'])
  folder: FolderName;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @IsString({ each: true })
  role: string[];
}

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamCharacterDto)
  characters: TeamCharacterDto[];
}

export class UpdateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamCharacterDto)
  characters: TeamCharacterDto[];
}

export class TeamDataDto {
  @IsObject()
  data: Record<string, TeamCharacterDto[]>;
}

export class TeamResponseDto {
  id: string;
  name: string;
  characters: TeamCharacterDto[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TeamDataResponseDto {
  id: string;
  data: Record<string, TeamCharacterDto[]>;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
