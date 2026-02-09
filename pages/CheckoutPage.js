class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.zip = page.locator('[data-test="postalCode"]');
    this.continueBtn = page.locator('[data-test="continue"]');
  }

  async fillInfo({ first = "reshad", last = "faysal", zip = "8200" } = {}) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.zip.fill(zip);
    await this.continueBtn.click();
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
  }
}

module.exports = { CheckoutPage };
