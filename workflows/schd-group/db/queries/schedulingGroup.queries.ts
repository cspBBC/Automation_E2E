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
}
