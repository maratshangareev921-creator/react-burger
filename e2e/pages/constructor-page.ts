import { expect, type Locator, type Page } from '@playwright/test';

const TEST_IDS = {
  burgerConstructor: 'burger-constructor',
  checkoutButton: 'checkout-button',
  ingredientDetails: 'ingredient-details',
  modal: 'modal',
  modalCloseButton: 'modal-close-button',
  orderDetails: 'order-details',
} as const;

const INGREDIENT_CARD_PREFIX = 'ingredient-card';
const INGREDIENT_LINK_PREFIX = 'ingredient-link';
const CONSTRUCTOR_ITEM_PREFIX = 'constructor-item';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TEST_ACCESS_TOKEN = 'Bearer test-access-token';
const TEST_REFRESH_TOKEN = 'test-refresh-token';

export class ConstructorPage {
  readonly constructorDropTarget: Locator;
  readonly checkoutButton: Locator;
  readonly ingredientDetails: Locator;
  readonly modal: Locator;
  readonly modalCloseButton: Locator;
  readonly orderDetails: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.constructorDropTarget = page.getByTestId(TEST_IDS.burgerConstructor);
    this.checkoutButton = page.getByTestId(TEST_IDS.checkoutButton);
    this.ingredientDetails = page.getByTestId(TEST_IDS.ingredientDetails);
    this.modal = page.getByTestId(TEST_IDS.modal);
    this.modalCloseButton = page.getByTestId(TEST_IDS.modalCloseButton);
    this.orderDetails = page.getByTestId(TEST_IDS.orderDetails);
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async authorize(): Promise<void> {
    await this.page.addInitScript(
      ({ accessTokenKey, refreshTokenKey, accessToken, refreshToken }) => {
        localStorage.setItem(accessTokenKey, accessToken);
        localStorage.setItem(refreshTokenKey, refreshToken);
      },
      {
        accessTokenKey: ACCESS_TOKEN_KEY,
        refreshTokenKey: REFRESH_TOKEN_KEY,
        accessToken: TEST_ACCESS_TOKEN,
        refreshToken: TEST_REFRESH_TOKEN,
      }
    );
  }

  async dragIngredientToConstructor(ingredientId: string): Promise<void> {
    await this.page
      .getByTestId(`${INGREDIENT_CARD_PREFIX}-${ingredientId}`)
      .dragTo(this.constructorDropTarget);
  }

  async openIngredientDetails(ingredientId: string): Promise<void> {
    await this.page.getByTestId(`${INGREDIENT_LINK_PREFIX}-${ingredientId}`).click();
  }

  constructorItem(ingredientId: string): Locator {
    return this.page.getByTestId(`${CONSTRUCTOR_ITEM_PREFIX}-${ingredientId}`);
  }

  async createOrder(): Promise<void> {
    await this.checkoutButton.click();
  }

  async closeModal(): Promise<void> {
    await this.modalCloseButton.click();
    await expect(this.modal).toBeHidden();
  }
}
