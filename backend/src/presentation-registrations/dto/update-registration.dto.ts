import { IsString, IsOptional } from 'class-validator';

export class UpdateRegistrationDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  coordinatorSignature?: string;
}
