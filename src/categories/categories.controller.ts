import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BasicAuthGuard } from '../auth/basic-auth.guard';
import { Admin, AdminScope, assertCanEdit } from '../auth/admin-scope';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  create(@Admin() admin: AdminScope, @Body() dto: CreateCategoryDto) {
    assertCanEdit(admin, dto.section);
    return this.categoriesService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @UseGuards(BasicAuthGuard)
  @Patch(':id')
  async update(@Admin() admin: AdminScope, @Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    assertCanEdit(admin, (await this.categoriesService.findOne(id)).section);
    if (dto.section) assertCanEdit(admin, dto.section);
    return this.categoriesService.update(id, dto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async remove(@Admin() admin: AdminScope, @Param('id') id: string) {
    assertCanEdit(admin, (await this.categoriesService.findOne(id)).section);
    return this.categoriesService.remove(id);
  }
}
