import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminScope } from './admin-scope';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header: string | undefined = request.headers['authorization'];

    if (!header || !header.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing credentials');
    }

    const decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf8');
    const separatorIndex = decoded.indexOf(':');
    const username = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : decoded;
    const password = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : '';

    const user = await this.authService.validate(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const admin: AdminScope = { username: user.username, sections: user.sections ?? [] };
    request.admin = admin;
    return true;
  }
}
