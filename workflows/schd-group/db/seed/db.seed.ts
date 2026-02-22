import sql from 'mssql';
import { getDbPool } from '@core/db/connection';

/**
 * Seed test data for Scheduling Group testing (NP035.02 - Create Scheduling Group)
 * Creates test users with specific roles, areas, and scheduling teams
 */
export async function applySeed(pool?: sql.ConnectionPool) {
  const db = pool || (await getDbPool());

  try {
    // ============================================
    // 1. SEED TEST AREAS
    // ============================================
    await db.request().query(`
      IF OBJECT_ID('dbo.areas', 'U') IS NOT NULL
      BEGIN
        -- Area 10: North Region
        IF NOT EXISTS (SELECT 1 FROM areas WHERE id = 10)
          INSERT INTO areas (id, name, description) 
          VALUES (10, 'North Region', 'Test area for North region scheduling')
        
        -- Area 20: South Region
        IF NOT EXISTS (SELECT 1 FROM areas WHERE id = 20)
          INSERT INTO areas (id, name, description) 
          VALUES (20, 'South Region', 'Test area for South region scheduling')
      END
    `);
  } catch (err) {
    console.log('⚠️  Areas seed skipped (table may not exist):', (err as Error).message);
  }

  try {
    // ============================================
    // 2. SEED TEST USERS
    // ============================================
    await db.request().query(`
      IF OBJECT_ID('dbo.users', 'U') IS NOT NULL
      BEGIN
        -- System Admin: Can manage ALL areas
        IF NOT EXISTS (SELECT 1 FROM users WHERE id = 1001)
          INSERT INTO users (id, username, full_name, role) 
          VALUES (1001, 'sysadmin_test', 'System Admin Test User', 'SystemAdmin')
        
        -- Area Admin for Area 10: Can manage ONLY Area 10
        IF NOT EXISTS (SELECT 1 FROM users WHERE id = 1002)
          INSERT INTO users (id, username, full_name, role) 
          VALUES (1002, 'areaadmin_area10', 'Area Admin Area 10 Test User', 'AreaAdmin')
        
        -- Area Admin for Area 20: Can manage ONLY Area 20
        IF NOT EXISTS (SELECT 1 FROM users WHERE id = 1003)
          INSERT INTO users (id, username, full_name, role) 
          VALUES (1003, 'areaadmin_area20', 'Area Admin Area 20 Test User', 'AreaAdmin')
        
        -- Regular User: No admin permissions
        IF NOT EXISTS (SELECT 1 FROM users WHERE id = 1004)
          INSERT INTO users (id, username, full_name, role) 
          VALUES (1004, 'regular_user_test', 'Regular User Test User', 'User')
      END
    `);
  } catch (err) {
    console.log('⚠️  Users seed skipped (table may not exist):', (err as Error).message);
  }

  try {
    // ============================================
    // 3. SEED USER-AREA PERMISSIONS
    // ============================================
    // Grant Area Admin permissions to specific areas
    await db.request().query(`
      IF OBJECT_ID('dbo.user_areas', 'U') IS NOT NULL
      BEGIN
        -- User 1002 (Area Admin) has permission for Area 10
        IF NOT EXISTS (SELECT 1 FROM user_areas WHERE user_id = 1002 AND area_id = 10)
          INSERT INTO user_areas (user_id, area_id, role) 
          VALUES (1002, 10, 'AREA_ADMIN')
        
        -- User 1003 (Area Admin) has permission for Area 20
        IF NOT EXISTS (SELECT 1 FROM user_areas WHERE user_id = 1003 AND area_id = 20)
          INSERT INTO user_areas (user_id, area_id, role) 
          VALUES (1003, 20, 'AREA_ADMIN')
      END
    `);
  } catch (err) {
    console.log('⚠️  User-Area permissions seed skipped:', (err as Error).message);
  }

  try {
    // ============================================
    // 4. SEED SCHEDULING TEAMS (for Area 10)
    // ============================================
    await db.request().query(`
      IF OBJECT_ID('dbo.scheduling_teams', 'U') IS NOT NULL
      BEGIN
        -- Team A in Area 10
        IF NOT EXISTS (SELECT 1 FROM scheduling_teams WHERE id = 2001)
          INSERT INTO scheduling_teams (id, name, area_id, description) 
          VALUES (2001, 'Team A - North', 10, 'Test team A in North region')
        
        -- Team B in Area 10
        IF NOT EXISTS (SELECT 1 FROM scheduling_teams WHERE id = 2002)
          INSERT INTO scheduling_teams (id, name, area_id, description) 
          VALUES (2002, 'Team B - North', 10, 'Test team B in North region')
        
        -- Team C in Area 10
        IF NOT EXISTS (SELECT 1 FROM scheduling_teams WHERE id = 2003)
          INSERT INTO scheduling_teams (id, name, area_id, description) 
          VALUES (2003, 'Team C - North', 10, 'Test team C in North region')
      END
    `);
  } catch (err) {
    console.log('⚠️  Scheduling Teams (Area 10) seed skipped:', (err as Error).message);
  }

  try {
    // ============================================
    // 5. SEED SCHEDULING TEAMS (for Area 20)
    // ============================================
    await db.request().query(`
      IF OBJECT_ID('dbo.scheduling_teams', 'U') IS NOT NULL
      BEGIN
        -- Team X in Area 20
        IF NOT EXISTS (SELECT 1 FROM scheduling_teams WHERE id = 2101)
          INSERT INTO scheduling_teams (id, name, area_id, description) 
          VALUES (2101, 'Team X - South', 20, 'Test team X in South region')
        
        -- Team Y in Area 20
        IF NOT EXISTS (SELECT 1 FROM scheduling_teams WHERE id = 2102)
          INSERT INTO scheduling_teams (id, name, area_id, description) 
          VALUES (2102, 'Team Y - South', 20, 'Test team Y in South region')
        
        -- Team Z in Area 20
        IF NOT EXISTS (SELECT 1 FROM scheduling_teams WHERE id = 2103)
          INSERT INTO scheduling_teams (id, name, area_id, description) 
          VALUES (2103, 'Team Z - South', 20, 'Test team Z in South region')
      END
    `);
  } catch (err) {
    console.log('⚠️  Scheduling Teams (Area 20) seed skipped:', (err as Error).message);
  }

  console.log('✅ Seed data applied successfully');

  if (!pool) await db.close();
}


/**
 * Cleanup temporary test data (data created by tests with AUTO_ prefix)
 * Only deletes test-created scheduling groups, not seed data
 */
export async function cleanupSeed(pool?: sql.ConnectionPool) {
  const db = pool || (await getDbPool());
  try {
    await db.request().query(`
      IF OBJECT_ID('dbo.scheduling_groups', 'U') IS NOT NULL
      BEGIN
        DELETE FROM scheduling_groups 
        WHERE scheduling_group_name LIKE 'AUTO_SG_%'
        OR scheduling_group_name LIKE 'TEST_%'
      END
    `);
    console.log('✅ Cleanup completed');
  } catch (err) {
    console.log('⚠️  Cleanup skipped:', (err as Error).message);
  }

  if (!pool) await db.close();
}


/**
 * Start a database transaction (for test isolation)
 */
export async function startTransaction(db: sql.ConnectionPool) {
  await db.request().query('BEGIN TRANSACTION');
  console.log('📌 Transaction started');
}

/**
 * Rollback database transaction (undo test changes)
 */
export async function rollbackTransaction(db: sql.ConnectionPool) {
  await db.request().query('ROLLBACK TRANSACTION');
  console.log('🔙 Transaction rolled back');
}

/**
 * Get seeded test data for use in tests
 * Returns user IDs and metadata for the test scenario
 */
export async function getSeedTestData(db: sql.ConnectionPool) {
  try {
    const result = await db.request().query(`
      SELECT 
        u.id as user_id, 
        u.username, 
        u.role,
        ua.area_id
      FROM users u
      LEFT JOIN user_areas ua ON u.id = ua.user_id
      WHERE u.id IN (1001, 1002, 1003, 1004)
      ORDER BY u.id
    `);

    const users = result.recordset;
    return {
      systemAdmin: users.find((u: any) => u.role === 'SystemAdmin'),
      areaAdmin_Area10: users.find((u: any) => u.area_id === 10),
      areaAdmin_Area20: users.find((u: any) => u.area_id === 20),
      regularUser: users.find((u: any) => u.role === 'User'),
      allUsers: users
    };
  } catch (err) {
    console.error('Error fetching seed test data:', err);
    throw err;
  }
}

/**
 * Grant Area Admin permission to a user for a specific area (if needed)
 * Note: Normally permissions are seeded, but this helper can grant additional permissions
 */
export async function grantAreaAdminViaDb(db: sql.ConnectionPool, userId: number, areaId: number) {
  try {
    if (await tableExists(db, 'user_areas')) {
      await db.request()
        .input('userId', sql.Int, userId)
        .input('areaId', sql.Int, areaId)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM user_areas WHERE user_id = @userId AND area_id = @areaId)
            INSERT INTO user_areas (user_id, area_id, role) VALUES (@userId, @areaId, 'AREA_ADMIN')
        `);
      console.log(`✅ Granted AreaAdmin for user ${userId} on area ${areaId}`);
      return;
    }

    if (await tableExists(db, 'user_roles')) {
      await db.request()
        .input('userId', sql.Int, userId)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = @userId AND role = 'AREA_ADMIN')
            INSERT INTO user_roles (user_id, role) VALUES (@userId, 'AREA_ADMIN')
        `);
      console.log(`✅ Granted AreaAdmin role for user ${userId}`);
      return;
    }

    throw new Error('No user permission table found - confirm schema with DB team');
  } catch (err) {
    console.error('Error granting area admin permission:', err);
    throw err;
  }
}


/**
 * Helper: Check if a table exists in the database
 */
async function tableExists(db: sql.ConnectionPool, tableName: string): Promise<boolean> {
  try {
    const res = await db.request().input('name', sql.VarChar, tableName).query(`
      SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = @name
    `);
    return res.recordset.length > 0;
  } catch (err) {
    return false;
  }
}
