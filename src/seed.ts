import 'dotenv/config';
import mongoose from 'mongoose';
import { Category, CategorySchema } from './categories/category.schema';
import { MenuItem, MenuItemSchema } from './menu-items/menu-item.schema';
import { SEED_CATEGORIES } from './seed-data';

async function seed() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/hideout_menu';
  await mongoose.connect(uri);
  console.log(`Connected to ${uri.replace(/:\/\/.*@/, '://<credentials>@')}`);

  const CategoryModel = mongoose.model(Category.name, CategorySchema);
  const MenuItemModel = mongoose.model(MenuItem.name, MenuItemSchema);

  let categoriesCreated = 0;
  let itemsCreated = 0;

  for (const cat of SEED_CATEGORIES) {
    const category = await CategoryModel.findOneAndUpdate(
      { name: cat.name },
      { name: cat.name, section: cat.section, sortOrder: cat.sortOrder },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    categoriesCreated += 1;

    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i];
      const existing = await MenuItemModel.findOne({ name: item.name, category: category._id });
      if (existing) {
        continue;
      }
      await MenuItemModel.create({
        name: item.name,
        description: item.description ?? '',
        price: item.price,
        category: category._id,
        available: true,
        sortOrder: i,
      });
      itemsCreated += 1;
    }
  }

  console.log(`Seed complete. Categories upserted: ${categoriesCreated}. New menu items created: ${itemsCreated}.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
