import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CategorySection } from '../category.schema';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['food', 'drinks', 'ciga'])
  section: CategorySection;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
