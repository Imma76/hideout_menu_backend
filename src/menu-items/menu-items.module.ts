import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItem, MenuItemSchema } from './menu-item.schema';
import { MenuItemsService } from './menu-items.service';
import { MenuItemsController } from './menu-items.controller';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MenuItem.name, schema: MenuItemSchema }]),
    AuthModule,
    CategoriesModule,
  ],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  exports: [MenuItemsService],
})
export class MenuItemsModule {}
