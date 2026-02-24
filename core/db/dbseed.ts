import sql from 'mssql';

/**
 * Core database seed utilities for user validation
 * Verifies required users exist in the database before tests proceed
 */

interface UserData {
  id: number;
  username: string;
  envKey: string;
}

/**
 * Check if a user exists in the database
 * @param pool Database connection pool
 * @param userId User ID to check
 * @returns true if user exists, false otherwise
 */
export async function userExists(
  pool: sql.ConnectionPool,
  userId: number
): Promise<boolean> {
  try {
    const result = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query('SELECT 1 FROM UserDetails WHERE UD_UserID = @userId');
    return result.recordset.length > 0;
  } catch (err) {
    console.error(`Error checking user ${userId}:`, err);
    throw err;
  }
}

/**
 * Verify a user exists in the database
 * @param pool Database connection pool
 * @param user User data to verify
 * @throws Error if user does not exist
 */
export async function verifyUser(
  pool: sql.ConnectionPool,
  user: UserData
): Promise<void> {
  const exists = await userExists(pool, user.id);
  
  if (!exists) {
    throw new Error(`User ${user.id} (${user.username}) not found in database`);
  }

  console.log(`✓ User ${user.id} (${user.username}) verified in database`);
}
