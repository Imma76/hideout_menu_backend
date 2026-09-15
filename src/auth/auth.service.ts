import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AdminUser, AdminUserDocument } from './admin-user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
  ) {}

  async validate(username: string, password: string): Promise<boolean> {
    const user = await this.adminUserModel.findOne({ username }).exec();
    if (!user) return false;
    return bcrypt.compare(password, user.passwordHash);
  }
}
