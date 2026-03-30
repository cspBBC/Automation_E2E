import fs from 'fs';
import path from 'path';
import { BrowserContext } from '@playwright/test';

export interface SessionState {
  cookies: any[];
  storageState: any;
  username: string;
  userId: number;
  createdAt: string;
  expiresAt: string;
}

export class SessionManager {
  private sessionDir = '.auth';
  private sessionFile: string;

  constructor(private userAlias: string) {
    if (!fs.existsSync(this.sessionDir)) {
      fs.mkdirSync(this.sessionDir, { recursive: true });
    }
    this.sessionFile = path.join(this.sessionDir, `${userAlias}.json`);
  }

  /**
   * Save browser session (cookies + storage state)
   */
  async saveSession(context: BrowserContext, username: string, userId: number): Promise<void> {
    const storageState = await context.storageState();
    const session: SessionState = {
      cookies: storageState.cookies,
      storageState,
      username,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    fs.writeFileSync(this.sessionFile, JSON.stringify(session, null, 2));
    console.log(`✅ Session saved for user: ${this.userAlias}`);
  }

  /**
   * Load saved session
   */
  loadSession(): SessionState | null {
    if (!fs.existsSync(this.sessionFile)) {
      return null;
    }

    const session: SessionState = JSON.parse(fs.readFileSync(this.sessionFile, 'utf-8'));

    // Check if session expired
    if (new Date(session.expiresAt) < new Date()) {
      console.log(`⚠️ Session expired for user: ${this.userAlias}`);
      return null;
    }

    console.log(`✅ Session loaded for user: ${this.userAlias}`);
    return session;
  }

  /**
   * Get cookies from saved session (for API tests)
   */
  getCookies(): string | null {
    const session = this.loadSession();
    if (!session) return null;

    // Format cookies as a cookie string for API requests
    const cookieString = session.cookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    return cookieString;
  }

  /**
   * Clear saved session
   */
  clearSession(): void {
    if (fs.existsSync(this.sessionFile)) {
      fs.unlinkSync(this.sessionFile);
      console.log(`🗑️ Session cleared for user: ${this.userAlias}`);
    }
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    const session = this.loadSession();
    return session !== null && new Date(session.expiresAt) > new Date();
  }
}
