import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { CategoriesModule } from '../categories/categories.module';
import { MenuItemsModule } from '../menu-items/menu-items.module';

@Module({
  imports: [CategoriesModule, MenuItemsModule],
  controllers: [MenuController],
})
export class MenuModule {}
