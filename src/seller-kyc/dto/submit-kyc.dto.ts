import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class KycDocumentDto {
  @IsString()
  docType: string;

  @IsString()
  url: string;
}

export class SubmitKycDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KycDocumentDto)
  documents: KycDocumentDto[];
}
