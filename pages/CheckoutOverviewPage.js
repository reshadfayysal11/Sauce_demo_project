function toNumber(priceText) {
  return Number(priceText.replace("$", "").trim());
}

class CheckoutOverviewPage {
  constructor(page) {
    this.page = page;
    this.finishBtn = page.locator('[data-test="finish"]');
    this.successHeader = page.locator(".complete-header");
    this.itemTotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
  }

  async getItems() {
    const rows = this.page.locator(".cart_item");
    const count = await rows.count();
    const items = [];

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const name = await row.locator(".inventory_item_name").innerText();
      const price = toNumber(await row.locator(".inventory_item_price").innerText());
      items.push({ name, price });
    }

    return items;
  }

  async expectTotalsMatch(items) {
    const itemTotal = Number((await this.itemTotalLabel.innerText()).split("$")[1]);
    const tax = Number((await this.taxLabel.innerText()).split("$")[1]);
    const total = Number((await this.totalLabel.innerText()).split("$")[1]);

    const sum = items.reduce((acc, x) => acc + x.price, 0);

    expect(Math.abs(sum - itemTotal)).toBeLessThan(0.01);
    expect(Math.abs((itemTotal + tax) - total)).toBeLessThan(0.01);
  }

  async finishAndExpectSuccess() {
    await this.finishBtn.click();
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.successHeader).toHaveText("Thank you for your order!");
  }
}

module.exports = { CheckoutOverviewPage };
