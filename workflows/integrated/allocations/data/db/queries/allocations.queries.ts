/**
 * Allocations SQL Queries
 * Used for test data setup and validation
 */

export const AllocationQueries = {
  /**
   * Create a test allocation record
   */
  createAllocation: `
    INSERT INTO allocations (duty_id, scheduling_person_id, scheduling_team_id, allocation_date, created_at)
    VALUES (@dutyId, @personId, @teamId, @allocationDate, GETDATE())
  `,

  /**
   * Get allocation by ID
   */
  getAllocationById: `
    SELECT *
    FROM allocations
    WHERE allocation_id = @allocationId
  `,

  /**
   * Get allocation with duty details
   */
  getAllocationWithDuty: `
    SELECT a.*, d.duty_name, d.start_time, d.end_time, d.duty_date
    FROM allocations a
    JOIN duties d ON a.duty_id = d.duty_id
    WHERE a.allocation_id = @allocationId
  `,

  /**
   * Update allocation published status
   */
  updateAllocationPublished: `
    UPDATE allocations
    SET is_published = @isPublished, updated_at = GETDATE()
    WHERE allocation_id = @allocationId
  `,

  /**
   * Delete test allocations by date range
   */
  deleteAllocationsByDateRange: `
    DELETE FROM allocations
    WHERE allocation_date BETWEEN @startDate AND @endDate
    AND created_by_test = 1
  `,

  /**
   * Verify allocation was updated
   */
  verifyAllocationUpdate: `
    SELECT allocation_id, start_time, end_time, break_time_hour, break_time_minute
    FROM duties
    WHERE duty_id = (SELECT duty_id FROM allocations WHERE allocation_id = @allocationId)
  `,
};
