import {
  IsBoolean,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsMongoId()
  category: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  // Empty string clears the photo.
  @IsOptional()
  @IsString()
  @Matches(/^(https:\/\/\S+)?$/, { message: 'imageUrl must be an https URL' })
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
