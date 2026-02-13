import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/');
  }

  
  async isLoaded() {
    return this.page.getByTestId('#twotabsearchtextbox').first();
  }
}