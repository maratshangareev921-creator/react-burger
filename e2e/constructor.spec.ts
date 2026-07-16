import { expect, test } from '@playwright/test';

import { ConstructorPage } from './pages/constructor-page';

const HAR_PATH = 'e2e/fixtures/burger-api.har';
const API_URL_PATTERN = '**/api/**';
const BUN_ID = 'bun-1';
const MAIN_ID = 'main-1';
const BUN_NAME = 'Краторная булка';
const MAIN_NAME = 'Биокотлета';
const BUN_CALORIES = '420';
const ORDER_NUMBER = '12345';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR(HAR_PATH, {
    url: API_URL_PATTERN,
  });
});

test('drags ingredients to constructor', async ({ page }) => {
  const constructorPage = new ConstructorPage(page);

  await constructorPage.open();
  await constructorPage.dragIngredientToConstructor(BUN_ID);
  await constructorPage.dragIngredientToConstructor(MAIN_ID);

  await expect(page.getByText(BUN_NAME).first()).toBeVisible();
  await expect(constructorPage.constructorItem(MAIN_ID)).toContainText(MAIN_NAME);
});

test('opens ingredient details modal and closes it', async ({ page }) => {
  const constructorPage = new ConstructorPage(page);

  await constructorPage.open();
  await constructorPage.openIngredientDetails(BUN_ID);

  await expect(constructorPage.modal).toBeVisible();
  await expect(constructorPage.ingredientDetails).toContainText(BUN_NAME);
  await expect(constructorPage.ingredientDetails).toContainText(BUN_CALORIES);

  await constructorPage.closeModal();
});

test('creates order and closes order modal', async ({ page }) => {
  const constructorPage = new ConstructorPage(page);

  await constructorPage.authorize();
  await constructorPage.open();
  await constructorPage.dragIngredientToConstructor(BUN_ID);
  await constructorPage.dragIngredientToConstructor(MAIN_ID);
  await constructorPage.createOrder();

  await expect(constructorPage.modal).toBeVisible();
  await expect(constructorPage.orderDetails).toContainText(ORDER_NUMBER);

  await constructorPage.closeModal();
});
