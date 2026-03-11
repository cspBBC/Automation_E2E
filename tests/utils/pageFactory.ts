import { Page } from '@playwright/test';
import { ScheduledGroupPage } from '@pages/NP035/ScheduledGroupPage';

// Type definition for page objects
export type PageObject = ScheduledGroupPage;

/**
 * Page Factory: Maps page names to their corresponding page objects
 * Add new pages here as your test suite grows
 */
const pageFactory: Record<string, (page: Page) => PageObject> = {
  "Scheduled Group": (page: Page) => new ScheduledGroupPage(page),
  "Scheduling Team": (page: Page) => new ScheduledGroupPage(page),
  // Add new pages here in the future:
  // "New Page Name": (page: Page) => new NewPageClass(page),
};

/**
 * Get a page object instance based on the page name
 * @param pageName - The name of the page (e.g., "Scheduled Group")
 * @param page - The Playwright Page instance
 * @returns The page object instance
 * @throws Error if the page name is not supported
 */
export const getPageObject = (pageName: string, page: Page): PageObject => {
  if (!pageFactory[pageName]) {
    throw new Error(
      `Unknown page: "${pageName}". Supported pages: ${getSupportedPages().map(p => `"${p}"`).join(', ')}`
    );
  }
  return pageFactory[pageName](page);
};

/**
 * Get list of all supported page names
 * @returns Array of supported page names
 */
export const getSupportedPages = (): string[] => Object.keys(pageFactory);

/**
 * Register a new page to the factory
 * Useful for dynamic page registration if needed
 * @param pageName - The name of the page
 * @param pageFactory - Factory function that creates the page object
 */
export const registerPage = (
  pageName: string,
  pageFactoryFn: (page: Page) => PageObject
): void => {
  pageFactory[pageName] = pageFactoryFn;
};
