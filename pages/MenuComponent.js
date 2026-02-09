class MenuComponent {
  constructor(page) {
    this.page = page;
    this.burgerBtn = page.locator("#react-burger-menu-btn");
    this.burgerClose = page.locator("#react-burger-cross-btn");
    this.resetLink = page.locator("#reset_sidebar_link");
    this.logoutLink = page.locator("#logout_sidebar_link");
  }

  async open() {
    await this.burgerBtn.click();
    await expect(this.page.locator(".bm-menu")).toBeVisible();
  }

  async close() {
    await this.burgerClose.click();
  }

  async resetAppState() {
    await this.open();
    await this.resetLink.click();
    await this.close();
  }

  async logout() {
    await this.open();
    await this.logoutLink.click();
  }
}

module.exports = { MenuComponent };
