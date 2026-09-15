import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { BasicAuthGuard } from './basic-auth.guard';
import { AuthService } from './auth.service';
import { AdminUser, AdminUserSchema } from './admin-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AdminUser.name, schema: AdminUserSchema }]),
  ],
  controllers: [AuthController],
  providers: [BasicAuthGuard, AuthService],
  exports: [BasicAuthGuard, AuthService],
})
export class AuthModule {}
