//import { expect, type Locator, type Page } from "@playwright/test";
import { type Locator, type Page } from "@playwright/test";

export class HudlLandingPage {
  readonly page: Page;
  readonly logInDropDown: Locator;
  readonly hudlLogin: Locator;
  readonly username: Locator;
  readonly password: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logInDropDown = page.getByTestId("login-select");
    this.hudlLogin = page.getByTestId("login-hudl");
    this.username = page.locator("#username");
    this.password = page.locator("#password");
  }

  async goto() {
    await this.page.goto("/");
  }

  async fillUsername() {
    try {
      await this.username.fill(process.env.HUDL_EMAIL);
      return true;
    } catch (error) {
      console.log("Failed to fill username field:", error.message);
      return false;
    }
  }

  async fillPassword() {
    try {
      await this.password.fill(process.env.HUDL_PASSWORD);
      return true;
    } catch (error) {
      console.log("Failed to fill password field:", error.message);
      return false;
    }
  }

  async continue() {
    // Note: There are many ways to handle this. The approach below
    // uses the accessible name, which is the text of the button.
    // Other approaches would be to combine the type, name and value.
    // That's probably most specific:
    //    ('button[type="submit"][name="action"][value="default"]')
    // You could also filter by the type:
    //    ('button[type="submit"]').filter({ hasText: /^Continue$/ })

    await this.page
      .getByRole("button", { name: "Continue", exact: true })
      .click();
  }

  async validLogin() {
    await this.logInDropDown.click();
    await this.hudlLogin.click();
    await this.fillUsername();
    await this.continue();
    await this.fillPassword();
    await this.continue();

    await this.page.pause();
  }
}
