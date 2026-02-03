import sql from 'mssql';

export class SchedulingGroupQueries {
  static async getByName(
    db: sql.ConnectionPool,
    name: string
  ) {
    const result = await db
      .request()
      .input('name', sql.VarChar, name)
      .query(`
        SELECT *
        FROM scheduling_groups
        WHERE scheduling_group_name = @name
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
        FROM scheduling_groups
        WHERE id = @id
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
        FROM scheduling_groups
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
