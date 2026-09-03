import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly articleCards: Locator;
  readonly categoryFilterLinks: Locator;
  readonly tagChips: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('main').first();
    this.articleCards = page.locator('article');
    this.categoryFilterLinks = page.locator('aside nav a, .sidebar nav a, a[href*="category="]');
    this.tagChips = page.locator('.tag-chip, a[href*="tag="]');
  }

  async visit() {
    await this.goto('/');
  }

  async expectPageLoaded() {
    await expect(this.page).toHaveTitle(/Loïc Bonin/i);
    await expect(this.header).toBeVisible();
    await expect(this.articleCards.first()).toBeVisible({ timeout: 10000 });
  }

  async clickFirstArticle() {
    const firstArticleLink = this.page.locator('article a[href^="/article/"]').first();
    await expect(firstArticleLink).toBeVisible();
    await firstArticleLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async filterByCategory(categoryName: string) {
    const categoryLink = this.page.locator(`a[href*="category=${categoryName}"]`).first();
    await categoryLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
