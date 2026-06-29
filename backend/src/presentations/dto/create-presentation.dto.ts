import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreatePresentationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  presentationDate: string;

  @IsString()
  @IsNotEmpty()
  presentationTime: string;

  @IsString()
  @IsOptional()
  status?: string;
}
