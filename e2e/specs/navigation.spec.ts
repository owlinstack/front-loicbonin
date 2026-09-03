import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RealisationsPage } from '../pages/RealisationsPage';
import { ProfilPage } from '../pages/ProfilPage';
import { CodeExplorerPage } from '../pages/CodeExplorerPage';

test.describe('Navigation & Liens Globaux', () => {
  test('devrait afficher la page d\'accueil et naviguer vers chaque section principale', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.visit();
    await homePage.expectPageLoaded();

    // Navigation vers Réalisations
    await homePage.navigateTo('Réalisations');
    const realisationsPage = new RealisationsPage(page);
    await realisationsPage.expectPageLoaded();
    await expect(page).toHaveURL(/.*\/realisations/);

    // Navigation vers Code
    await realisationsPage.navigateTo('Code');
    const codePage = new CodeExplorerPage(page);
    await codePage.expectPageLoaded();
    await expect(page).toHaveURL(/.*\/code/);

    // Navigation vers Profil
    await codePage.navigateTo('Profil');
    const profilPage = new ProfilPage(page);
    await profilPage.expectPageLoaded();
    await expect(page).toHaveURL(/.*\/profil/);

    // Retour à l'accueil via le logo
    await profilPage.logo.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/$/);
  });

  test('devrait ouvrir et fermer le menu drawer mobile', async ({ page, isMobile }) => {
    const homePage = new HomePage(page);
    await homePage.visit();

    const hamburger = page.locator('button.hamburger-btn');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      const mobileNav = page.locator('nav[aria-label="Menu mobile"]');
      await expect(mobileNav).toBeVisible();

      // Fermer le menu
      await hamburger.click();
      await expect(mobileNav).not.toBeVisible();
    }
  });

  test('devrait afficher une réponse 404 pour une URL inexistante', async ({ page }) => {
    const response = await page.goto('/page-inexistante-random-404');
    expect(response?.status()).toBe(404);
    await expect(page.locator('body')).toContainText(/404|could not be found|non trouvé|introuvable/i);
  });
});
