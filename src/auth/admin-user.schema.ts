import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CategorySection } from '../categories/category.schema';

export type AdminUserDocument = HydratedDocument<AdminUser>;

@Schema({ timestamps: true })
export class AdminUser {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  // Menu sections this admin may edit. Empty means every section.
  @Prop({ type: [String], default: [] })
  sections: CategorySection[];
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
