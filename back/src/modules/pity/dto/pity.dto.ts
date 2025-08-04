import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreatePityDto {
  @IsNotEmpty()
  @IsString()
  banner: string;

  @IsOptional()
  @IsNumber()
  count?: number;
}

export class UpdatePityDto {
  @IsOptional()
  @IsNumber()
  count?: number;
}

export class SavePityHistoryDto {
  @IsNotEmpty()
  @IsString()
  banner: string;

  @IsNotEmpty()
  @IsNumber()
  pulls: number;
}

export class PityParamsDto {
  @IsNotEmpty()
  @IsString()
  banner: string;
}

export class PityResponseDto {
  id: string;
  banner: string;
  count: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PityHistoryResponseDto {
  id: string;
  banner: string;
  pulls: number;
  date: Date;
  userId: string;
  createdAt: Date;
}
