import { expect, test } from '@playwright/test';

const bunId = 'bun-1';
const mainId = 'main-1';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('e2e/fixtures/burger-api.har', {
    url: '**/api/**',
  });
});

test('drags ingredients to constructor', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId(`ingredient-card-${bunId}`).dragTo(page.getByTestId('burger-constructor'));
  await page.getByTestId(`ingredient-card-${mainId}`).dragTo(page.getByTestId('burger-constructor'));

  await expect(page.getByText('Краторная булка').first()).toBeVisible();
  await expect(page.getByTestId(`constructor-item-${mainId}`)).toContainText('Биокотлета');
});

test('opens ingredient details modal and closes it', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId(`ingredient-link-${bunId}`).click();

  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('ingredient-details')).toContainText('Краторная булка');
  await expect(page.getByTestId('ingredient-details')).toContainText('420');

  await page.getByTestId('modal-close-button').click();
  await expect(page.getByTestId('modal')).toBeHidden();
});

test('creates order and closes order modal', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await page.goto('/');

  await page.getByTestId(`ingredient-card-${bunId}`).dragTo(page.getByTestId('burger-constructor'));
  await page.getByTestId(`ingredient-card-${mainId}`).dragTo(page.getByTestId('burger-constructor'));
  await page.getByTestId('checkout-button').click();

  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('order-details')).toContainText('12345');

  await page.getByTestId('modal-close-button').click();
  await expect(page.getByTestId('modal')).toBeHidden();
});
