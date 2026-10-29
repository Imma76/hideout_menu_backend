import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MenuItemDocument = HydratedDocument<MenuItem>;

@Schema({ timestamps: true })
export class MenuItem {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ default: true })
  available: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ trim: true, default: '' })
  imageUrl: string;

  @Prop({ default: false })
  featured: boolean;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
