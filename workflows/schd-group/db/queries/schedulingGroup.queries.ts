import sql from 'mssql';

export class SchedulingGroupQueries {

  // first check if table SchedulingGroups exists

  static async tableExists(db: sql.ConnectionPool): Promise<boolean> {
    const result = await db
      .request()
      .query(`
        SELECT *
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME = 'SchedulingGroups'
      `);

    return result.recordset.length > 0;
  }



  static async getByName(
    db: sql.ConnectionPool,
    name: string
  ) {
    const result = await db
      .request()
      .input('name', sql.VarChar, name)
      .query(`
        SELECT *
        FROM SchedulingGroups
        WHERE SchedulingGroupsName = @name
      `);

    return result.recordset[0];
  }

  static async getById(
    db: sql.ConnectionPool,
    id: number
  ) {
    const result = await db
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT *
        FROM SchedulingGroups
        WHERE SchedulingGroupsID = @id
      `);

    return result.recordset[0];
  }

  static async exists(
    db: sql.ConnectionPool,
    name: string
  ): Promise<boolean> {
    const record = await this.getByName(db, name);
    return !!record;
  }

  static async listByArea(
    db: sql.ConnectionPool,
    area: string
  ) {
    const result = await db
      .request()
      .input('area', sql.VarChar, area)
      .query(`
        SELECT *
        FROM SchedulingGroups
        WHERE area = @area
      `);

    return result.recordset;
  }

  static async getHistory(
    db: sql.ConnectionPool,
    groupId: number
  ) {
    const result = await db
      .request()
      .input('id', sql.Int, groupId)
      .query(`
        SELECT *
        FROM scheduling_group_history
        WHERE scheduling_group_id = @id
        ORDER BY amended_date DESC
      `);

    return result.recordset;
  }

  /**
   * Get scheduling group by ID with permission check for specific user
   * 
   * Permission Rules:
   * - System Admin: area is NULL (can access all groups in any area)
   * - Area Admin: area is specific value (can access only groups in their area)
   * - Creator: Can access groups they created
   * 
   * @param db - Database connection pool
   * @param groupId - Scheduling group ID to retrieve
   * @param userId - User ID to check permissions for
   * @returns Scheduling group if user has access, undefined otherwise
   */
  static async getByIdForUser(
    db: sql.ConnectionPool,
    groupId: number,
    userId: number
  ) {
    // First, get the group with division info
    const result = await db
      .request()
      .input('groupId', sql.Int, groupId)
      .query(`
        SELECT g.*, d.DivisionName
        FROM SchedulingGroups g
        LEFT JOIN Divisions d ON d.DivisionID = g.DivisionID
        WHERE g.SchedulingGroupsID = @groupId
      `);

    const group = result.recordset[0];
    if (!group) {
      return undefined;
    }

    // Check if user created this group
    if (group.CreatedBy === userId) {
      return group;
    }

    // Check permission based on user's area
    // System Admin: area is NULL (can access any area)
    // Area Admin: area is specific value (can access only their area)
    const userArea = await this.getUserArea(db, userId);
    if (userArea === null || group.DivisionName === userArea) {
      return group;
    }

    // No permission
    return undefined;
  }

  /**
   * Get user's area (division)
   * 
   * - System Admin (UR_RoleID = 1): Returns NULL (can access all areas)
   * - Area Admin (UR_RoleID = 2+): Returns their assigned Division
   */
  static async getUserArea(
    db: sql.ConnectionPool,
    userId: number
  ): Promise<string | null> {
    const result = await db
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT TOP 1 d.DivisionName, r.UR_RoleID
        FROM UserRoles r
        INNER JOIN Divisions d ON d.DivisionID = r.UR_DivisionId
        WHERE r.UR_UserID = @userId
        AND r.UR_EndDate >= CAST(GETDATE() AS DATE)
        ORDER BY r.UR_EndDate DESC
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    const record = result.recordset[0];
    
    // System Admin has NULL area (can access all areas)
    if (record.UR_RoleID === 1) {
      return null;
    }

    // Area Admin returns their division
    return record.DivisionName;
  }

  /**
   * List all Scheduling Groups accessible to a user based on their role
   * 
   * Permission Rules:
   * - System Admin (UR_RoleID = 1): Returns ALL groups
   * - Area Admin (UR_RoleID = 2+): Returns only groups in their assigned division
   * 
   * @param db - Database connection pool
   * @param userId - User ID to retrieve groups for
   * @returns Array of scheduling groups user has access to
   */
  static async listAllGroupsForUser(
    db: sql.ConnectionPool,
    userId: number
  ) {
    // Get user's area/division (null for System Admin, division name for Area Admin)
    const userArea = await this.getUserArea(db, userId);

    if (userArea === null) {
      // System Admin: Get ALL groups from all divisions
      const result = await db.request().query(`
        SELECT sg.SchedulingGroupsID, sg.SchedulingGroupsName, 
               sg.CreatedBy, sg.DivisionID, d.DivisionName
        FROM SchedulingGroups sg
        LEFT JOIN Divisions d ON d.DivisionID = sg.DivisionID
        ORDER BY sg.SchedulingGroupsName
      `);
      return result.recordset;
    } else {
      // Area Admin: Get only groups in their division
      const result = await db
        .request()
        .input('userId', userId)
        .query(`
          SELECT sg.SchedulingGroupsID, sg.SchedulingGroupsName, 
                 sg.CreatedBy, sg.DivisionID, d.DivisionName
          FROM SchedulingGroups sg
          INNER JOIN Divisions d ON d.DivisionID = sg.DivisionID
          INNER JOIN UserRoles ur ON d.DivisionID = ur.UR_DivisionId
          WHERE ur.UR_UserID = @userId 
          AND ur.UR_EndDate >= CAST(GETDATE() AS DATE)
          ORDER BY sg.SchedulingGroupsName
        `);
      return result.recordset;
    }
  }}
