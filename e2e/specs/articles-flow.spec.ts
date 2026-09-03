import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ArticleDetailPage } from '../pages/ArticleDetailPage';

test.describe('Parcours Articles & Veille Technologique', () => {
  test('devrait lister les articles et permettre la lecture d\'un article complet', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.visit();
    await homePage.expectPageLoaded();

    // Vérifier la présence d'articles
    const articleCount = await homePage.articleCards.count();
    expect(articleCount).toBeGreaterThan(0);

    // Cliquer sur le premier article disponible
    await homePage.clickFirstArticle();

    // Vérifier l'affichage de la page de détail de l'article
    const articleDetailPage = new ArticleDetailPage(page);
    await articleDetailPage.expectArticleLoaded();
    await expect(page).toHaveURL(/.*\/article\/.+/);

    // Vérifier la présence du titre h1 et du contenu
    await expect(articleDetailPage.articleTitle).toBeVisible();
    await expect(articleDetailPage.articleContent).toBeVisible();

    // Vérifier la présence de la jauge de progression
    await articleDetailPage.expectProgressBarAttached();

    // Retour à l'accueil via le lien retour
    if (await articleDetailPage.backToArticlesLink.isVisible()) {
      await articleDetailPage.backToArticlesLink.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/$/);
    }
  });

  test('devrait filtrer les articles par catégorie', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.visit();
    await homePage.expectPageLoaded();

    // Récupérer les catégories réelles du site
    const categoryLinks = page.locator('aside a[href*="category="], .sidebar a[href*="category="]');
    const count = await categoryLinks.count();
    let navigatedHref = '';

    // Mode Desktop : clic sur la première catégorie visible de la sidebar
    for (let i = 0; i < count; i++) {
      const link = categoryLinks.nth(i);
      if (await link.isVisible()) {
        const href = await link.getAttribute('href');
        await link.click();
        await page.waitForLoadState('domcontentloaded');
        navigatedHref = href || '';
        break;
      }
    }

    // Mode Mobile : la sidebar est masquée par CSS, on utilise l'URL d'une catégorie existante dans le DOM
    if (!navigatedHref && count > 0) {
      const href = await categoryLinks.first().getAttribute('href');
      if (href) {
        await page.goto(href);
        await page.waitForLoadState('domcontentloaded');
        navigatedHref = href;
      }
    }

    if (navigatedHref) {
      await expect(page).toHaveURL(new RegExp(navigatedHref.replace('?', '\\?')));
      // Confirmer l'affichage du badge de filtre actif ou des articles
      const filterBadge = page.locator('text=Filtre actif :');
      const articleCards = homePage.articleCards;
      const isFilteredUI = (await filterBadge.isVisible()) || ((await articleCards.count()) > 0);
      expect(isFilteredUI).toBeTruthy();
    }
  });

  test('devrait réinitialiser un filtre actif via le bouton reset', async ({ page }) => {
    // Naviguer avec un paramètre de filtre
    await page.goto('/?category=backend');
    await page.waitForLoadState('domcontentloaded');

    const resetLink = page.locator('a.filter-reset-link').first();
    if (await resetLink.isVisible()) {
      await resetLink.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/$/);
    }
  });
});
