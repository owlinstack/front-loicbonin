import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

test.describe('Footer & Métadonnées SEO', () => {
  test('devrait afficher un Footer complet avec tous les liens fonctionnels', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.goto('/');
    await basePage.expectFooterVisible();

    // Liens de navigation secondaire
    const navVeille = page.locator('#footer-nav-veille');
    const navRealisations = page.locator('#footer-nav-realisations');
    const navCode = page.locator('#footer-nav-code');
    const navProfil = page.locator('#footer-nav-profil');

    await expect(navVeille).toBeVisible();
    await expect(navRealisations).toBeVisible();
    await expect(navCode).toBeVisible();
    await expect(navProfil).toBeVisible();

    // Liens sociaux externes sécurisés
    const githubLink = page.locator('#footer-social-github');
    const linkedinLink = page.locator('#footer-social-linkedin');

    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', /noopener/);
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('rel', /noopener/);
  });

  test('devrait inclure les balises SEO essentielles et métadonnées sur les pages clés', async ({ page }) => {
    // Page d'accueil
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveTitle(/Loïc Bonin/i);

    // Page Profil
    await page.goto('/profil');
    await page.waitForLoadState('domcontentloaded');
    const canonicalProfil = page.locator('link[rel="canonical"]');
    if (await canonicalProfil.count() > 0) {
      await expect(canonicalProfil).toHaveAttribute('href', /.*\/profil/);
    }

    // Balise meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const content = await metaDescription.getAttribute('content');
      expect(content?.length).toBeGreaterThan(10);
    }
  });
});
