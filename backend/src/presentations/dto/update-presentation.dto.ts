import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdatePresentationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  presentationDate?: string;

  @IsString()
  @IsOptional()
  presentationTime?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
