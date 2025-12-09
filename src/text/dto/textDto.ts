import { IsOptional, IsString } from 'class-validator';

export class TextDto {
  @IsString()
  text: string;

  @IsString()
  title: string;
  @IsString()
  genre: string;

  @IsOptional()
  @IsString()
  srcImg?: string | undefined;
}
