import { test, expect } from '@playwright/test';
import { RealisationsPage } from '../pages/RealisationsPage';
import { ProfilPage } from '../pages/ProfilPage';

test.describe('Parcours Portfolio & Profil', () => {
  test('devrait afficher les projets et leurs technologies sur la page Réalisations', async ({ page }) => {
    const realisationsPage = new RealisationsPage(page);
    await realisationsPage.visit();
    await realisationsPage.expectPageLoaded();

    const projectCount = await realisationsPage.projectCards.count();
    expect(projectCount).toBeGreaterThan(0);

    // Vérifier la présence de tags de technologies
    const pillsCount = await realisationsPage.techPills.count();
    expect(pillsCount).toBeGreaterThan(0);
  });

  test('devrait afficher les informations professionnelles sur la page Profil', async ({ page }) => {
    const profilPage = new ProfilPage(page);
    await profilPage.visit();
    await profilPage.expectPageLoaded();

    await expect(profilPage.profileName).toBeVisible();
    await expect(profilPage.profileBio).toBeVisible();

    // Vérifier les compétences affichées
    const skillsCount = await profilPage.skillsChips.count();
    expect(skillsCount).toBeGreaterThan(0);
  });
});
