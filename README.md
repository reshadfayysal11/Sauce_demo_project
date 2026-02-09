# Sauce_demo_project
Sauce Demo Test 

This project includes automated tests for the Sauce Demo website using Playwright. These tests help check the login, shopping cart, and checkout functions. 

What is This Project? 

We created tests to mimic different users logging in, adding items to the cart, and checking out on the Sauce Demo website. We used Playwright, a tool that automates browser actions like clicking buttons and filling out forms. 

How the Code Works 

1. Page Object Model (POM) 

We use a method called the Page Object Model to keep things organized. This means we create separate classes for each page (like the login page) to manage actions (like logging in or showing error messages). For example, the LoginPage class handles the login form, error messages, and logging in with different users. 

Example of the login part: 
 

class LoginPage { 

  constructor(page) { 

    this.page = page; 

    this.username = page.locator('[data-test="username"]'); 

    this.password = page.locator('[data-test="password"]'); 

    this.loginBtn = page.locator('[data-test="login-button"]'); 

    this.error = page.locator('[data-test="error"]'); 

  } 

 

  async login(user, pass) { 

    await this.username.fill(user); 

    await this.password.fill(pass); 

    await this.loginBtn.click(); 

  } 

} 

 

module.exports = { LoginPage }; 

 

 

2. Writing the Tests 

Each test checks a different feature of the website. For example, we test: 

Logging in with a locked_out_user and looking for an error. 

Logging in with a standard_user, adding items to the cart, and completing the checkout. 

Logging in with a performance_glitch_user, sorting products, and checking out. 

Running the Tests 

1. Install Playwright 

If you haven't installed Playwright yet, run this command: 
npm install 

2. Run the Tests 

After installing, you can run the tests with this command: 
npx playwright test 

3. View Test Results 

You can also generate Allure reports to view detailed test results: 
First, install Allure: 
npm install -g allure-commandline --save-dev 
Generate the Allure report: 
npx allure generate allure-results --clean 
Open the Allure report:  

npx allure open 

 

 

Folder Structure 

test: Contains the Playwright test files. 

page: Contains page classes like LoginPage.js. 

package.json: Manages project dependencies. 
 

Playwright Test Report: 

 

 

Allure Report: 

 

 

 

 
