/**
 * Allocations SQL Queries
 * Used for test data setup and validation
 * 
 * ONLY ACTIVE QUERIES - Unused queries removed to keep codebase clean
 */

export const AllocationQueries = {
  /**
   * Call stored procedure to get AllocationsDutyID after creating a duty
   * This SP returns the newly generated ID
   */
  getLatestAllocationsDutyId: `
    DECLARE @AllocationsDutyID INT
    EXEC usp_GetLatestAllocationsDutyID 
      @DutyName = @DutyName,
      @DutyDate = @DutyDate,
      @AllocationsDutyID = @AllocationsDutyID OUTPUT
    SELECT @AllocationsDutyID AS AD_AllocationsDutyID
  `,

  /**
   * Verify duty created in database - Get allocationsDutyId confirmation
   * Returns most recently created duty record by DutyName only (ordered by highest ID = most recent)
   * Uses unique DutyName with timestamp to avoid conflicts
   */
  verifyDutyCreated: `
    SELECT TOP 1
      ad.AD_AllocationsDutyID,
      ad.AD_AllocationsID,
      ad.AD_DutyName,
      ad.AD_DutyDate,
      ad.AD_StartTimeSec,
      ad.AD_EndTimeSec,
      ad.AD_DutyBreakTime,
      ad.AD_DutyColourID,
      ad.AD_IsDutyEdited
    FROM dbo.AllocationsDuties ad
    WHERE ad.AD_DutyName = @DutyName
    ORDER BY ad.AD_AllocationsDutyID DESC
  `,

  /**
   * Verify duty was edited in database - Query by AllocationsDutyID
   * Returns all duty fields to confirm edit was applied
   */
  verifyDutyEdited: `
    SELECT 
      ad.AD_AllocationsDutyID,
      ad.AD_DutyName,
      ad.AD_StartTimeSec,
      ad.AD_EndTimeSec,
      ad.AD_DutyBreakTime,
      ad.AD_DutyColourID,
      ad.AD_DutyDate,
      ad.AD_IsDutyEdited,
      ad.AD_UpdatedDate
    FROM dbo.AllocationsDuties ad
    WHERE ad.AD_AllocationsDutyID = @AllocationsDutyID
  `,

  /**
   * Get duty history records - Verify edit operation was recorded
   * Retrieves history for a specific duty with change details
   */
  getDutyHistory: `
    SELECT TOP 100
      h.HistoryID,
      h.DateTime as ChangeDateTime,
      h.HistoryType,
      ud.UD_NetLogin as ChangedByUser,
      h.History as ChangeDetails
    FROM dbo.History h
    LEFT JOIN dbo.UserDetails ud ON h.UserID = ud.UD_UserID
    WHERE h.AttributeID = @AttributeID
      AND h.HistoryType = @HistoryType
    ORDER BY h.DateTime DESC
  `,
};
