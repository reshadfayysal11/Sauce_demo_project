// playwright.config.js
// Central configuration for Playwright test execution

const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({

  // Where all test files are located
  testDir: "./tests",

  // Maximum time allowed per test
  timeout: 60_000,

  // No retries (kept simple for assignment)
  retries: 0,

  // Test result reporters
  reporter: [
    ["list"],                        // Console output (pass/fail)
    ["html", { open: "never" }],     // Playwright HTML report
    ["allure-playwright"]            // Allure raw results
  ],

  // Common browser settings for all tests
  use: {
    baseURL: "https://www.saucedemo.com",
    headless: true,                 // Run without opening browser
    screenshot: "only-on-failure",  // Screenshot only if test fails
    video: "retain-on-failure",     // Video only if test fails
    trace: "retain-on-failure"      // Trace only if test fails
  }
});
