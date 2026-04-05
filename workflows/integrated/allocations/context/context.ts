/**
 * Allocation Context - DTO
 *
 * Stores duty allocation data shared between steps in the same scenario.
 * Captures IDs and details from creation step, reused by edit verification steps.
 * 
 * DESIGN PATTERN:
 * - allocationsDutyId: Captured from DB after duty creation, used in edit operations
 * - allocationsSpId: Captured from DB after duty creation, required for edit requests
 * - dutyName: Created duty name, used for assertions and verification
 * - schedulingPersonId: Person ID from creation, stored for context
 * - schedulingTeamId: Team ID from creation, stored for context
 * - dutyDate: Date of duty creation, used for assertions
 *
 * FLOW:
 * 1. Create scenario: Stores allocationsDutyId, allocationsSpId, dutyName after DB confirmation
 * 2. Edit scenario: Retrieves stored values and substitutes them in edit payload before API call
 * 3. Enables cross-scenario data sharing within same test execution
 *
 * @example
 * // In Create step - store after DB confirmation:
 * ctx.allocationsDutyId = dbResult.AD_AllocationsDutyID;
 * ctx.allocationsSpId = dbResult.AD_AllocationsSpId;
 * ctx.dutyName = testParams.DutyName;
 *
 * // In Edit step - retrieve and use:
 * const editParams = substituteTemplateVariables(params, ctx);
 */

export interface AllocationContext {
  /**
   * Unique identifier for the allocation duty record in database.
   * Captured from AD_AllocationsDutyID after duty creation.
   * Used in edit operations to identify which duty to update.
   * Null until duty is successfully created.
   */
  allocationsDutyId: number | null;

  /**
   * Unique identifier for the allocation scheduling person record.
   * Captured from AD_AllocationsSpId after duty creation.
   * Required for edit requests to link duty to person allocation.
   * Null until duty is successfully created.
   */
  allocationsSpId: number | null;

  /**
   * Name of the duty created in this scenario.
   * Set when duty is created, used by edit operations to update it.
   * Used in assertions to verify correct duty was modified.
   */
  dutyName: string | null;

  /**
   * ID (DutyID) of the duty from feature file.
   * Set during creation, preserved during edit operations.
   * Used to maintain proper duty reference across operations.
   */
  dutyId: string | null;

  /**
   * Person ID who the duty is assigned to.
   * Set during creation, used for verification and assertions.
   */
  schedulingPersonId: string | null;

  /**
   * Team ID associated with the duty.
   * Set during creation, used for verification.
   */
  schedulingTeamId: string | null;

  /**
   * Date of the created/edited duty.
   * Set during creation, used for DB queries and assertions.
   */
  dutyDate: string | null;
}
