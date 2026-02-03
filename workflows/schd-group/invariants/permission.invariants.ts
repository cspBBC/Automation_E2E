import { UserRole } from '../../../core/auth/roles';
import { Scope } from '../../../core/permission/permission.types';
import { schedulingGroupPermissions } from '../../../core/permission/permission.schd-group';

type Context = {
  userRole: UserRole;
  userArea: string;
  groupArea: string;
};

export function assertCanCreateSchedulingGroup(ctx: Context) {
  const scope = schedulingGroupPermissions[ctx.userRole].create;

  if (scope === Scope.ANY) return;
  if (scope === Scope.OWN_AREA && ctx.userArea === ctx.groupArea) return;

  throw new Error(`Create permission denied`);
}

export function assertCanEditSchedulingGroup(ctx: Context) {
  const scope = schedulingGroupPermissions[ctx.userRole].edit;

  if (scope === Scope.ANY) return;
  if (scope === Scope.OWN_AREA && ctx.userArea === ctx.groupArea) return;

  throw new Error(`Edit permission denied`);
}
