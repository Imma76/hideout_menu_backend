import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { MenuItemsService } from '../menu-items/menu-items.service';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly menuItemsService: MenuItemsService,
  ) {}

  @Get()
  async getMenu() {
    const [categories, items] = await Promise.all([
      this.categoriesService.findAll(),
      this.menuItemsService.findAll(),
    ]);
    return { categories, items };
  }
}
