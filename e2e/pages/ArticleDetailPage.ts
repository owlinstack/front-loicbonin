import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticleDetailPage extends BasePage {
  readonly articleTitle: Locator;
  readonly articleContent: Locator;
  readonly backToArticlesLink: Locator;
  readonly progressBar: Locator;

  constructor(page: Page) {
    super(page);
    this.articleTitle = page.locator('main h1').first();
    this.articleContent = page.locator('main').first();
    this.backToArticlesLink = page.locator('a:has-text("Veille"), a[href="/"]').first();
    this.progressBar = page.locator('#reading-progress');
  }

  async visit(slug: string) {
    await this.goto(`/article/${slug}`);
  }

  async expectArticleLoaded() {
    await expect(this.articleTitle).toBeVisible({ timeout: 10000 });
    await expect(this.articleContent).toBeVisible();
  }

  async expectProgressBarAttached() {
    await expect(this.progressBar).toBeAttached();
  }
}
