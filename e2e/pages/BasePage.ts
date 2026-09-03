import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Classe de base contenant les interactions et sélecteurs communs
 * (Navigation Header, Footer, Thème).
 */
export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly logo: Locator;
  readonly themeToggle: Locator;
  readonly footer: Locator;
  readonly footerLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header').first();
    this.logo = page.locator('header a[aria-label*="accueil"]').first();
    this.themeToggle = page.locator('#theme-toggle').first();
    this.footer = page.locator('footer').first();
    this.footerLogo = page.locator('#footer-logo-link');
  }

  async goto(path = '/') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }

  async getActiveTheme(): Promise<string | null> {
    return await this.page.locator('html').getAttribute('data-theme');
  }

  async navigateTo(label: 'Veille' | 'Réalisations' | 'Code' | 'Profil') {
    const desktopLink = this.page.locator(`nav.header-nav a:has-text("${label}")`).first();
    if (await desktopLink.isVisible()) {
      await desktopLink.click();
    } else {
      // Vérifier le bouton hamburger mobile
      const hamburger = this.page.locator('button.hamburger-btn');
      if (await hamburger.isVisible()) {
        await hamburger.click();
        const mobileLink = this.page.locator(`nav[aria-label="Menu mobile"] a:has-text("${label}")`).first();
        await mobileLink.click();
      } else {
        // Fallback icônes navigation mobile compacte
        const minifiedLink = this.page.locator(`.minified-mobile-nav a[aria-label="${label}"]`).first();
        if (await minifiedLink.isVisible()) {
          await minifiedLink.click();
        }
      }
    }
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectHeaderVisible() {
    await expect(this.header).toBeVisible();
    await expect(this.logo).toBeVisible();
  }

  async expectFooterVisible() {
    await expect(this.footer).toBeVisible();
    await expect(this.footerLogo).toBeVisible();
  }
}
