import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CodeExplorerPage extends BasePage {
  readonly pageContainer: Locator;
  readonly codeEditorContainer: Locator;
  readonly projectCards: Locator;
  readonly githubCards: Locator;

  constructor(page: Page) {
    super(page);
    this.pageContainer = page.locator('main, div[style*="minHeight"], div[style*="min-height"]').first();
    this.codeEditorContainer = page.locator('div:has-text("GitHub"), div:has-text("Explorateur"), pre, code').first();
    this.projectCards = page.locator('.project-card, button:has-text("Explorer")');
    this.githubCards = page.locator('a[href*="github.com"]');
  }

  async visit() {
    await this.goto('/code');
  }

  async expectPageLoaded() {
    await expect(this.page).toHaveTitle(/Explorateur de Code/i);
    await expect(this.header).toBeVisible();
    await expect(this.codeEditorContainer).toBeVisible({ timeout: 10000 });
  }
}
