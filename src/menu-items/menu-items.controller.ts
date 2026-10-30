import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { BasicAuthGuard } from '../auth/basic-auth.guard';
import { Admin, AdminScope, assertCanEdit } from '../auth/admin-scope';
import { CategoriesService } from '../categories/categories.service';

@Controller('menu-items')
export class MenuItemsController {
  constructor(
    private readonly menuItemsService: MenuItemsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  // An item belongs to whichever section its category is in.
  private async assertCanEditItem(admin: AdminScope, id: string) {
    const item = await this.menuItemsService.findOne(id);
    assertCanEdit(admin, (item.category as unknown as { section?: string } | null)?.section);
  }

  private async assertCanUseCategory(admin: AdminScope, categoryId: string) {
    assertCanEdit(admin, (await this.categoriesService.findOne(categoryId)).section);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async create(@Admin() admin: AdminScope, @Body() dto: CreateMenuItemDto) {
    await this.assertCanUseCategory(admin, dto.category);
    return this.menuItemsService.create(dto);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.menuItemsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(id);
  }

  @UseGuards(BasicAuthGuard)
  @Patch(':id')
  async update(@Admin() admin: AdminScope, @Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    await this.assertCanEditItem(admin, id);
    if (dto.category) await this.assertCanUseCategory(admin, dto.category);
    return this.menuItemsService.update(id, dto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async remove(@Admin() admin: AdminScope, @Param('id') id: string) {
    await this.assertCanEditItem(admin, id);
    return this.menuItemsService.remove(id);
  }
}
