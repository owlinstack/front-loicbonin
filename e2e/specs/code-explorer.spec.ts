import { test, expect } from '@playwright/test';
import { CodeExplorerPage } from '../pages/CodeExplorerPage';

test.describe('Explorateur de Code', () => {
  test('devrait charger la page de l\'explorateur de code et les projets associés', async ({ page }) => {
    const codePage = new CodeExplorerPage(page);
    await codePage.visit();
    await codePage.expectPageLoaded();

    await expect(page).toHaveURL(/.*\/code/);
    await expect(codePage.header).toBeVisible();

    // Vérifier les boutons de sélection de projet
    const projectButtons = page.locator('button[aria-label*="Ouvrir le projet"]');
    if (await projectButtons.count() > 0) {
      await projectButtons.first().click();
      await page.waitForLoadState('domcontentloaded');

      // En mode éditeur, le bouton retour "Projets" ou les cellules de code .code-cell doivent s'afficher
      const editorElement = page.locator('button:has-text("Projets"), button:has-text("Copier"), .code-cell');
      await expect(editorElement.first()).toBeVisible({ timeout: 10000 });
    }
  });
});
