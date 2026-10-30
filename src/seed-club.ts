import 'dotenv/config';
import mongoose from 'mongoose';
import { Category, CategorySchema } from './categories/category.schema';
import { MenuItem, MenuItemSchema } from './menu-items/menu-item.schema';

// From "THE HIDEOUT DRINKS MENU.docx", spelling corrected. featured = shown in
// the club page's signature / bottle-of-the-night spots.
type SeedItem = { name: string; description: string; price: number; featured?: boolean };
const CLUB: { name: string; items: SeedItem[] }[] = [
  {
    name: 'Champagne',
    items: [
      { name: 'Ace of Spades', description: 'Armand de Brignac Brut Gold', price: 730000, featured: true },
      { name: 'Dom Pérignon', description: 'Vintage brut', price: 720000, featured: true },
      { name: 'Cristal', description: 'Louis Roederer', price: 700000, featured: true },
      { name: 'Veuve Clicquot Brut', description: 'Yellow Label', price: 250000 },
      { name: 'Moët & Chandon Rosé', description: 'Rosé Impérial', price: 250000 },
      { name: 'Moët Brut', description: 'Brut Impérial', price: 220000 },
      { name: 'Laurent-Perrier Rosé', description: 'Cuvée Rosé', price: 200000 },
      { name: 'Laurent-Perrier Brut', description: 'La Cuvée', price: 150000 },
      { name: 'Belaire Rosé', description: 'Luxe rosé', price: 150000 },
      { name: 'Canard-Duchêne Rosé', description: 'Authentic Rosé', price: 140000 },
      { name: 'Canard-Duchêne Brut', description: 'Authentic Brut', price: 120000 },
    ],
  },
  {
    name: 'Cognac',
    items: [
      { name: 'Hennessy XO', description: 'Extra Old', price: 600000 },
      { name: 'Martell XO', description: 'Extra Old', price: 600000 },
      { name: 'Rémy Martin XO', description: 'Extra Old', price: 500000 },
      { name: 'Hennessy VSOP', description: 'Privilège', price: 200000 },
      { name: 'Rémy Martin 1738', description: 'Accord Royal', price: 200000 },
      { name: 'Martell Blue Swift', description: 'VSOP, bourbon cask finish', price: 200000 },
      { name: 'Rémy Martin VSOP', description: 'Fine Champagne', price: 180000 },
      { name: 'Hennessy VS', description: 'Very Special', price: 150000 },
      { name: 'Martell VS', description: 'Very Special', price: 150000 },
      { name: 'Rémy Martin VS', description: 'Very Special', price: 140000 },
    ],
  },
  {
    name: 'Whiskey',
    items: [
      { name: 'Glenfiddich 23 Years', description: 'Grand Cru single malt', price: 800000, featured: true },
      { name: 'Macallan Rare Cask', description: 'Single malt', price: 650000, featured: true },
      { name: 'Glenfiddich 21 Years', description: 'Gran Reserva single malt', price: 600000 },
      { name: 'Teeling 21 Years', description: 'Irish single malt', price: 400000 },
      { name: 'Glenmorangie 18 Years', description: 'Extremely Rare single malt', price: 260000 },
      { name: 'Glenfiddich 18 Years', description: 'Small Batch Reserve', price: 220000 },
      { name: 'Macallan 15 Years', description: 'Double Cask single malt', price: 210000 },
      { name: 'Glenmorangie 14 Years', description: 'Single malt', price: 180000 },
      { name: 'Chivas Regal 18 Years', description: 'Blended Scotch', price: 180000 },
      { name: 'Macallan 12 Years', description: 'Double Cask single malt', price: 160000 },
      { name: 'Glenfiddich 15 Years', description: 'Solera single malt', price: 160000 },
      { name: 'Glenmorangie 12 Years', description: 'Single malt', price: 140000 },
      { name: 'Chivas Regal 15 Years', description: 'Blended Scotch', price: 140000 },
      { name: 'Teeling Single Malt', description: 'Irish single malt', price: 120000 },
      { name: 'Jameson Black Barrel', description: 'Irish whiskey, double-charred barrels', price: 120000 },
      { name: 'Observatory 20 Years', description: 'Aged whiskey', price: 110000 },
      { name: 'Glenmorangie 10 Years', description: 'The Original single malt', price: 110000 },
      { name: 'Chivas Regal 12 Years', description: 'Blended Scotch', price: 110000 },
    ],
  },
  {
    name: 'Tequila',
    items: [
      { name: 'Don Julio', description: 'Premium tequila', price: 500000 },
      { name: 'Casamigos', description: 'Premium tequila', price: 350000 },
      { name: 'Salamanca Blanco', description: 'Blanco tequila', price: 250000 },
      { name: '1800 Tequila', description: 'Silver', price: 170000 },
      { name: 'Olmeca Blanco', description: 'Blanco', price: 110000 },
    ],
  },
  {
    name: 'Wine',
    items: [
      { name: 'Silk and Spice', description: 'Red blend, Portugal', price: 110000 },
      { name: 'Escudo Rojo', description: 'Red blend, Chile', price: 110000 },
      { name: 'Cooper & Thief', description: 'Bourbon-barrel-aged red', price: 110000 },
      { name: 'Sandeman Sweet Red', description: 'Sweet red', price: 110000 },
    ],
  },
  { name: 'Gin', items: [{ name: "Hendrick's", description: 'Scottish gin', price: 110000 }] },
  {
    name: 'Juice',
    items: [
      { name: 'Cranberry Juice', description: '', price: 10000 },
      { name: 'Chi Exotic', description: '', price: 6000 },
    ],
  },
  {
    name: 'Soft Drinks',
    items: [
      { name: 'Can Coke', description: '', price: 1500 },
      { name: 'Can Sprite', description: '', price: 1500 },
      { name: 'Water', description: '', price: 800 },
    ],
  },
];

async function run() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/hideout_menu';
  await mongoose.connect(uri);
  const CategoryModel = mongoose.model(Category.name, CategorySchema);
  const MenuItemModel = mongoose.model(MenuItem.name, MenuItemSchema);

  if (process.argv.includes('--remove')) {
    const cats = await CategoryModel.find({ section: 'club' });
    const ids = cats.map((c) => c._id);
    const items = await MenuItemModel.deleteMany({ category: { $in: ids } });
    await CategoryModel.deleteMany({ _id: { $in: ids } });
    console.log(`Removed ${cats.length} club categories and ${items.deletedCount} items.`);
    await mongoose.disconnect();
    return;
  }

  let created = 0;
  for (let c = 0; c < CLUB.length; c++) {
    const cat = CLUB[c];
    const category = await CategoryModel.findOneAndUpdate(
      { name: cat.name, section: 'club' },
      { $setOnInsert: { name: cat.name, section: 'club', sortOrder: c + 1 } },
      { upsert: true, new: true },
    );
    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i];
      const exists = await MenuItemModel.exists({ name: item.name, category: category._id });
      if (exists) continue;
      await MenuItemModel.create({
        ...item,
        featured: item.featured ?? false,
        category: category._id,
        available: true,
        sortOrder: i,
      });
      created += 1;
    }
  }
  console.log(`Club menu ready: ${CLUB.length} categories, ${created} new items.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
