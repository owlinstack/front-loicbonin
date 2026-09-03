import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilPage extends BasePage {
  readonly profileName: Locator;
  readonly profileBio: Locator;
  readonly timelineItems: Locator;
  readonly skillsChips: Locator;

  constructor(page: Page) {
    super(page);
    this.profileName = page.locator('main h1, .profile-hero h1, main h2').first();
    this.profileBio = page.locator('main p').first();
    this.timelineItems = page.locator('.timeline-item, li, main section');
    this.skillsChips = page.locator('.tag-chip, span');
  }

  async visit() {
    await this.goto('/profil');
  }

  async expectPageLoaded() {
    await expect(this.page).toHaveTitle(/Profil/i);
    await expect(this.header).toBeVisible();
    await expect(this.profileName).toBeVisible();
  }
}
