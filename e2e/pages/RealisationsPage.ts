import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RealisationsPage extends BasePage {
  readonly pageTitle: Locator;
  readonly projectCards: Locator;
  readonly techPills: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, h2').first();
    this.projectCards = page.locator('article');
    this.techPills = page.locator('.tag-chip, span');
  }

  async visit() {
    await this.goto('/realisations');
  }

  async expectPageLoaded() {
    await expect(this.page).toHaveTitle(/Réalisations/i);
    await expect(this.header).toBeVisible();
    await expect(this.projectCards.first()).toBeVisible({ timeout: 10000 });
  }
}
