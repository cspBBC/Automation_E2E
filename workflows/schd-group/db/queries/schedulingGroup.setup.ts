import sql from 'mssql';

/**
 * Scheduling Group Setup/Seed utilities for testing
 * Handles test data setup with proper permissions and audit trails
 */
export class SchedulingGroupSetup {
  
  /**
   * Test fixture constants for Scheduling Groups
   * Centralized test data definitions used across all tests
   */
  static readonly TEST_GROUPS = {
    SYSTEM_ADMIN_GROUP: {
      id: 26,
      name: 'WA Scheduling Group',
      description: 'Group created by System Admin in different division'
    },
    AREA_ADMIN_GROUP: {
      id: 24,
      name: 'Area_Shekhar_POC',
      area: 'News',
      description: 'Group created by Area Admin in News division'
    }
  } as const;
  
  /**
   * Get List of Divisions from database
   * Used to map divisions for test group creation
   */
  static async getDivisions(db: sql.ConnectionPool) {
    const result = await db.request().query(`
      SELECT TOP 2 DivisionID, DivisionName 
      FROM Divisions 
      ORDER BY DivisionID
    `);
    
    if (result.recordset.length < 2) {
      throw new Error('Expected at least 2 divisions in database');
    }

    return {
      newsDivId: result.recordset.find(d => d.DivisionName === 'News')?.DivisionID || 1,
      otherDivId: result.recordset.find(d => d.DivisionName !== 'News')?.DivisionID || 2,
    };
  }

  /**
   * Create or update a Scheduling Group for testing
   * 
   * @param db Database connection pool
   * @param groupId Scheduling group ID
   * @param name Group name
   * @param divisionId Division ID
   * @param createdBy User ID who created the group
   * @param updatedBy User ID who last updated (optional)
   */
  static async createOrUpdateGroup(
    db: sql.ConnectionPool,
    groupId: number,
    name: string,
    divisionId: number,
    createdBy: number,
    updatedBy?: number
  ): Promise<void> {
    const now = new Date();
    
    await db
      .request()
      .input('id', sql.Int, groupId)
      .input('name', sql.VarChar, name)
      .input('divId', sql.Int, divisionId)
      .input('createdBy', sql.Int, createdBy)
      .input('updatedBy', sql.Int, updatedBy ?? createdBy)
      .input('createdDate', sql.DateTime2, now)
      .input('updatedDate', sql.DateTime2, now)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM SchedulingGroups WHERE SchedulingGroupsID = @id)
          INSERT INTO SchedulingGroups 
            (SchedulingGroupsID, SchedulingGroupsName, DivisionID, CreatedBy, CreatedDate, 
             UpdatedBy, UpdatedDate, IsIncludeINMenu, Notes)
          VALUES (@id, @name, @divId, @createdBy, @createdDate, @updatedBy, @updatedDate, 1, 'Test Group')
        ELSE
          UPDATE SchedulingGroups 
          SET SchedulingGroupsName = @name, DivisionID = @divId, CreatedBy = @createdBy,
              UpdatedBy = @updatedBy, UpdatedDate = @updatedDate, IsIncludeINMenu = 1
          WHERE SchedulingGroupsID = @id
      `);
  }

  /**
   * Setup test groups for NP035 permission testing
   * 
   * Group 26: System Admin in different division (tests permission denial)
   * Group 24: Area Admin in News division (tests permission grant + audit trail)
   * 
   * @param db Database connection pool
   * @param systemAdminId User ID of system admin creating Group 26
   * @param areaAdminId User ID of area admin creating Group 24
   */
  static async setupTestGroups(
    db: sql.ConnectionPool,
    systemAdminId: number,
    areaAdminId: number
  ): Promise<void> {
    try {
      const { newsDivId, otherDivId } = await this.getDivisions(db);

      // SCENARIO 1: System Admin Creates Group in non-News division
      // Purpose: Test that Area Admin from News cannot access groups in other divisions (permission control)
      await this.createOrUpdateGroup(
        db,
        this.TEST_GROUPS.SYSTEM_ADMIN_GROUP.id,
        this.TEST_GROUPS.SYSTEM_ADMIN_GROUP.name,
        otherDivId,
        systemAdminId
      );

      // SCENARIO 2: Area Admin Creates Group in News division
      // Purpose: Test that Area Admin can access and see correct audit trail of their own groups
      await this.createOrUpdateGroup(
        db,
        this.TEST_GROUPS.AREA_ADMIN_GROUP.id,
        this.TEST_GROUPS.AREA_ADMIN_GROUP.name,
        newsDivId,
        areaAdminId,
        areaAdminId  // Same user created and last updated
      );

      console.log(`✓ Test groups setup complete: Group ${this.TEST_GROUPS.SYSTEM_ADMIN_GROUP.id} (System Admin ${systemAdminId}) and Group ${this.TEST_GROUPS.AREA_ADMIN_GROUP.id} (Area Admin ${areaAdminId})`);
    } catch (err) {
      console.error('Failed to setup test groups:', err);
      throw err;
    }
  }
}
