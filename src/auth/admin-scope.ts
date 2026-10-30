import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CategorySection } from '../categories/category.schema';

// Who is logged in and which menu sections they may edit (set by BasicAuthGuard).
export type AdminScope = { username: string; sections: CategorySection[] };

export const Admin = createParamDecorator(
  (_: unknown, context: ExecutionContext): AdminScope => context.switchToHttp().getRequest().admin,
);

export function assertCanEdit(admin: AdminScope, section: string | undefined) {
  if (admin.sections.length && !admin.sections.includes(section as CategorySection)) {
    throw new ForbiddenException("This account can't edit that part of the menu.");
  }
}
