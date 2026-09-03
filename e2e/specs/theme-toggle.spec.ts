import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

test.describe('Gestion du Thème Clair / Sombre', () => {
  test('devrait basculer entre le thème sombre et clair et persister le choix', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.goto('/');

    // Récupérer le thème initial
    const initialTheme = await basePage.getActiveTheme();
    const targetTheme = initialTheme === 'dark' ? 'light' : 'dark';

    // Cliquer sur le bouton de bascule de thème
    await basePage.toggleTheme();

    // Vérifier le nouvel attribut data-theme sur html
    await expect(page.locator('html')).toHaveAttribute('data-theme', targetTheme);

    // Vérifier la valeur dans le localStorage
    const storedTheme = await page.evaluate(() => localStorage.getItem('lb-theme'));
    expect(storedTheme).toBe(targetTheme);

    // Recharger la page pour vérifier la persistance
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', targetTheme);
  });
});
