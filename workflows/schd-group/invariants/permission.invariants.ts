/**
 * Permission Invariants - NOT NEEDED FOR TESTS
 * 
 * These functions were designed to validate permissions in test code.
 * However, permissions are properly validated by the API backend.
 * 
 * Instead of testing permission logic here, tests should:
 * 1. Make API calls with specific user IDs (via X-User-Id header)
 * 2. Verify response status codes:
 *    - 201/200 = Success (user has permission)
 *    - 403 = Forbidden (user lacks permission)
 *    - 401 = Unauthorized (no user auth)
 * 3. Trust that the backend API correctly enforces permissions
 * 
 * The commented code below is kept as reference only.
 */

// import { UserRole } from '../../../core/auth/roles';
// import { Scope } from '../../../core/permission/permission.types';
// import { schedulingGroupPermissions } from '../../../core/permission/permission.schd-group';

// type Context = {
//   userRole: UserRole;
//   userArea: string;
//   groupArea: string;
// };

// export function assertCanCreateSchedulingGroup(ctx: Context) {
//   const scope = schedulingGroupPermissions[ctx.userRole].create;

//   if (scope === Scope.ANY) return;
//   if (scope === Scope.OWN_AREA && ctx.userArea === ctx.groupArea) return;

//   throw new Error(`Create permission denied`);
// }

// export function assertCanEditSchedulingGroup(ctx: Context) {
//   const scope = schedulingGroupPermissions[ctx.userRole].edit;

//   if (scope === Scope.ANY) return;
//   if (scope === Scope.OWN_AREA && ctx.userArea === ctx.groupArea) return;

//   throw new Error(`Edit permission denied`);
// }
