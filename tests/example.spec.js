const { test, expect } = require("@playwright/test");

const creds = {
  lockedOut: { username: "locked_out_user", password: "secret_sauce" },
  standard: { username: "standard_user", password: "secret_sauce" },
  glitch: { username: "performance_glitch_user", password: "secret_sauce" }
};

function selectors(page) {
  return {
    username: page.locator('[data-test="username"]'),
    password: page.locator('[data-test="password"]'),
    loginBtn: page.locator('[data-test="login-button"]'),
    error: page.locator('[data-test="error"]'),

    burgerBtn: page.locator("#react-burger-menu-btn"),
    burgerClose: page.locator("#react-burger-cross-btn"),
    resetLink: page.locator("#reset_sidebar_link"),
    logoutLink: page.locator("#logout_sidebar_link"),

    cartIcon: page.locator(".shopping_cart_link"),
    checkoutBtn: page.locator('[data-test="checkout"]'),

    firstName: page.locator('[data-test="firstName"]'),
    lastName: page.locator('[data-test="lastName"]'),
    zip: page.locator('[data-test="postalCode"]'),
    continueBtn: page.locator('[data-test="continue"]'),

    finishBtn: page.locator('[data-test="finish"]'),
    successHeader: page.locator(".complete-header"),

    sortDropdown: page.locator('[data-test="product-sort-container"]'),

    overviewItemTotal: page.locator(".summary_subtotal_label"),
    overviewTax: page.locator(".summary_tax_label"),
    overviewTotal: page.locator(".summary_total_label")
  };
}

async function login(page, user) {
  const s = selectors(page);

  await page.goto("https://www.saucedemo.com/");
  await s.username.fill(user.username);
  await s.password.fill(user.password);
  await s.loginBtn.click();
}

async function openMenu(page) {
  const s = selectors(page);
  await s.burgerBtn.click();
  await expect(page.locator(".bm-menu")).toBeVisible();
}

async function resetAppState(page) {
  const s = selectors(page);
  await openMenu(page);
  await s.resetLink.click();
  await s.burgerClose.click();
}

async function logout(page) {
  const s = selectors(page);
  await openMenu(page);
  await s.logoutLink.click();
  await expect(s.loginBtn).toBeVisible();
}

async function addItem(page, itemName) {
  const productCard = page.locator(".inventory_item").filter({ hasText: itemName });
  await expect(productCard, `Product should exist: ${itemName}`).toHaveCount(1);
  await productCard.locator('button:has-text("Add to cart")').click();
}

async function addFirstVisibleItem(page) {
  const firstCard = page.locator(".inventory_item").first();
  const name = (await firstCard.locator(".inventory_item_name").innerText()).trim();
  await firstCard.locator('button:has-text("Add to cart")').click();
  return name;
}

async function goToCart(page) {
  const s = selectors(page);
  await s.cartIcon.click();
  await expect(page).toHaveURL(/cart\.html/);
}

async function startCheckout(page) {
  const s = selectors(page);
  await s.checkoutBtn.click();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
}

async function fillCustomerInfo(page, { first = "reshad", last = "faysal", zip = "8200" } = {}) {
  const s = selectors(page);
  await s.firstName.fill(first);
  await s.lastName.fill(last);
  await s.zip.fill(zip);
  await s.continueBtn.click();
  await expect(page).toHaveURL(/checkout-step-two\.html/);
}

function toNumber(priceText) {
  return Number(priceText.replace("$", "").trim());
}

async function getOverviewItems(page) {
  const rows = page.locator(".cart_item");
  const count = await rows.count();

  const items = [];
  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const name = (await row.locator(".inventory_item_name").innerText()).trim();
    const price = toNumber(await row.locator(".inventory_item_price").innerText());
    items.push({ name, price });
  }
  return items;
}

async function finishAndVerifySuccess(page) {
  const s = selectors(page);
  await s.finishBtn.click();
  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(s.successHeader).toHaveText("Thank you for your order!");
}

async function verifyTotalsMatch(page, overviewItems) {
  const s = selectors(page);

  const uiItemTotalText = await s.overviewItemTotal.innerText(); 
  const uiTaxText = await s.overviewTax.innerText();            
  const uiTotalText = await s.overviewTotal.innerText();        

  const uiItemTotal = Number(uiItemTotalText.split("$")[1]);
  const uiTax = Number(uiTaxText.split("$")[1]);
  const uiTotal = Number(uiTotalText.split("$")[1]);

  const calculated = overviewItems.reduce((sum, x) => sum + x.price, 0);


  expect(Math.abs(calculated - uiItemTotal)).toBeLessThan(0.01);
  expect(Math.abs((uiItemTotal + uiTax) - uiTotal)).toBeLessThan(0.01);
}

test.describe.serial("SauceDemo scenarios (Q1-Q3)", () => {

  test("Q1 - locked_out_user should see lockout error @q1 @q", async ({ page }) => {
    const s = selectors(page);

    await login(page, creds.lockedOut);

    await expect(s.error).toBeVisible();
    await expect(s.error).toHaveText("Epic sadface: Sorry, this user has been locked out.");
  });

  test("Q2 - standard_user reset, add 3 items, checkout, verify, finish, reset, logout @q2 @q", async ({ page }) => {
    await login(page, creds.standard);
    await expect(page).toHaveURL(/inventory\.html/);

    
    await resetAppState(page);

  
    const products = [
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt"
    ];
    for (const p of products) await addItem(page, p);


    await goToCart(page);
    for (const p of products) {
      await expect(page.locator(".cart_item").filter({ hasText: p })).toHaveCount(1);
    }

    await startCheckout(page);
    await fillCustomerInfo(page);

    const overviewItems = await getOverviewItems(page);
    const overviewNames = overviewItems.map(x => x.name).sort();
    expect(overviewNames).toEqual([...products].sort());

    await verifyTotalsMatch(page, overviewItems);

    await finishAndVerifySuccess(page);

    await resetAppState(page);
    await logout(page);
  });

  test("Q3 - glitch user reset, sort Z->A, add first, checkout verify, finish, reset, logout @q3 @q", async ({ page }) => {
    await login(page, creds.glitch);
    await expect(page).toHaveURL(/inventory\.html/);

    await resetAppState(page);

    const s = selectors(page);
    await s.sortDropdown.selectOption("za");

    const chosenName = await addFirstVisibleItem(page);

    await goToCart(page);
    await startCheckout(page);
    await fillCustomerInfo(page);

    const overviewItems = await getOverviewItems(page);
    expect(overviewItems.length).toBe(1);
    expect(overviewItems[0].name).toBe(chosenName);

    await verifyTotalsMatch(page, overviewItems);

    await finishAndVerifySuccess(page);

    await resetAppState(page);
    await logout(page);
  });

});
