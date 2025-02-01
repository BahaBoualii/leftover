import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';

export const ROLES_KEY = 'roles';

// Accept either a single role or an array of roles
export const Roles = (...roles: Role[] | Role[][]) => {
  
  const flattenedRoles = roles.flat();
  return SetMetadata(ROLES_KEY, flattenedRoles);
};
