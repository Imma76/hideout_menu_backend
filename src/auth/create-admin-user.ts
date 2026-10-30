import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AdminUser, AdminUserSchema } from './admin-user.schema';

const SECTIONS = ['food', 'drinks', 'ciga', 'club'];

async function createAdminUser() {
  const [, , username, password, sectionsArg = ''] = process.argv;
  if (!username || !password) {
    console.error('Usage: npm run create-admin -- <username> <password> [sections]');
    console.error('  sections: comma-separated, e.g. "club". Leave out for full access.');
    process.exit(1);
  }
  const sections = sectionsArg.split(',').map((s) => s.trim()).filter(Boolean);
  const unknown = sections.filter((s) => !SECTIONS.includes(s));
  if (unknown.length) {
    console.error(`Unknown section(s): ${unknown.join(', ')}. Use: ${SECTIONS.join(', ')}`);
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/hideout_menu';
  await mongoose.connect(uri);

  const AdminUserModel = mongoose.model(AdminUser.name, AdminUserSchema);
  const passwordHash = await bcrypt.hash(password, 10);

  await AdminUserModel.findOneAndUpdate(
    { username },
    { username, passwordHash, sections },
    { upsert: true, new: true },
  );

  console.log(`Admin user "${username}" created/updated (${sections.length ? sections.join(', ') + ' only' : 'all sections'}).`);
  await mongoose.disconnect();
}

createAdminUser().catch((err) => {
  console.error('Failed to create admin user:', err);
  process.exit(1);
});
