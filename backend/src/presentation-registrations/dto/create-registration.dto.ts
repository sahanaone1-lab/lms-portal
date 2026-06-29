import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreatePresentationRegistrationDto {
  @IsString()
  @IsNotEmpty()
  presentationId: string;

  // Personal Info
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsString()
  @IsNotEmpty()
  collegeName: string;

  @IsString()
  @IsNotEmpty()
  yearOfStudy: string;

  // Internship Info
  @IsString()
  @IsNotEmpty()
  internshipTiming: string;

  @IsDateString()
  internshipStartDate: string;

  @IsDateString()
  internshipEndDate: string;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsString()
  @IsNotEmpty()
  projectsWorkedOn: string;

  // Presentation
  @IsBoolean()
  willingToAttend: boolean;

  // Q&A
  @IsString()
  @IsNotEmpty()
  qaQuestions: string;

  // Remarks (optional)
  @IsString()
  @IsOptional()
  additionalRemarks?: string;

  // Signatures
  @IsString()
  @IsNotEmpty()
  internSignature: string;
}
