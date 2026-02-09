class InventoryPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.locator(".shopping_cart_link");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async goToCart() {
    await this.cartIcon.click();
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async sortByNameZA() {
    await this.sortDropdown.selectOption("za");
  }
}

module.exports = { InventoryPage };
