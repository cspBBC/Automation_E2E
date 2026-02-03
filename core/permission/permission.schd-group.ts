import { UserRole } from '../auth/roles';
import { Scope } from './permission.types';

export type SchedulingGroupPermissions = {
  view: Scope;
  create: Scope;
  edit: Scope;
  delete: Scope;
};

export const schedulingGroupPermissions: Record<
  UserRole,
  SchedulingGroupPermissions
> = {
  [UserRole.SYSTEM_ADMIN]: {
    view: Scope.ANY,
    create: Scope.ANY,
    edit: Scope.ANY,
    delete: Scope.ANY,
  },

  [UserRole.AREA_ADMIN]: {
    view: Scope.OWN_AREA,
    create: Scope.OWN_AREA,
    edit: Scope.OWN_AREA,
    delete: Scope.NONE,
  },

  [UserRole.VIEW_ONLY]: {
    view: Scope.OWN_AREA,
    create: Scope.NONE,
    edit: Scope.NONE,
    delete: Scope.NONE,
  },
};
