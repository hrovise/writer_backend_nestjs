import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetNovelDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  currentPage?: number;

  @IsOptional()
  @IsString()
  textTitle?: string;
}
