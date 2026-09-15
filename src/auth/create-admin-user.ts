import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AdminUser, AdminUserSchema } from './admin-user.schema';

async function createAdminUser() {
  const [, , username, password] = process.argv;
  if (!username || !password) {
    console.error('Usage: npm run create-admin -- <username> <password>');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/hideout_menu';
  await mongoose.connect(uri);

  const AdminUserModel = mongoose.model(AdminUser.name, AdminUserSchema);
  const passwordHash = await bcrypt.hash(password, 10);

  await AdminUserModel.findOneAndUpdate(
    { username },
    { username, passwordHash },
    { upsert: true, new: true },
  );

  console.log(`Admin user "${username}" created/updated.`);
  await mongoose.disconnect();
}

createAdminUser().catch((err) => {
  console.error('Failed to create admin user:', err);
  process.exit(1);
});
