import { expect, type Locator, type Page } from "@playwright/test";
import { getRequiredEnv } from "../env";

export class HudlLandingPage {
  readonly page: Page;
  readonly logInDropDown: Locator;
  readonly hudlLogin: Locator;
  readonly hudlLogout: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logInDropDown = page.getByTestId("login-select");
    this.hudlLogin = page.getByTestId("login-hudl");
    this.username = page.locator("#username");
    this.password = page.locator("#password");
    this.hudlLogout = page.getByTestId("webnav-usermenu-logout");
    this.emailError = page.locator("#error-cs-email-required");
    this.passwordError = page.locator("#error-element-password");
  }

  async goto() {
    await this.page.goto("/");
  }

  async logout() {
    // Here I'm clicking the menu trigger to expose the logout.
    // This is an area where I would prefer to have a specific
    // testability hook, like an `id` or `data-qa-id`. Notice
    // also that the use of first() might be something I expect
    // to at least be questioned in a PR for this code.

    await this.page.locator(".hui-globaluseritem").click();
    await this.hudlLogout.first().click();
  }

  async fillUsername() {
    try {
      await this.username.fill(getRequiredEnv("HUDL_EMAIL"));
      return true;
    } catch (error) {
      console.log("Failed to fill username field:", error.message);
      return false;
    }
  }

  async fillPassword() {
    try {
      await this.password.fill(getRequiredEnv("HUDL_PASSWORD"));
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

  async verifyProfile() {
    // There are various ways to handle this given the nesting in
    // the CSS. The CSS classes seem specifically designed for this
    // user menu component and are likely to be stable. By that, I
    // mean the selectors are quite specific and should reliably
    // target exactly what I need. That said, I would work with the
    // developers on adding some testability hooks here, such as a
    // specific `id` or even a `data-qa-id`. Because I am uncertain
    // on this, note I have not enshrined these as locators on the
    // page object itself quite yet. If someone was doing a code
    // review on a PR for this, I would expect that to be called out.

    await expect(
      this.page.locator(".hui-globaluseritem__display-name span"),
    ).toHaveText(getRequiredEnv("HUDL_DISPLAY_NAME"));
    await expect(this.page.locator(".hui-globaluseritem__email")).toHaveText(
      getRequiredEnv("HUDL_EMAIL"),
    );
  }

  async validLogin() {
    await this.logInDropDown.click();
    await this.hudlLogin.click();
    await this.fillUsername();
    await this.continue();
    await this.fillPassword();
    await this.continue();
    await this.verifyProfile();
  }

  async invalidLogin_Missing_Email() {
    await this.logInDropDown.click();
    await this.hudlLogin.click();
    this.username.fill("");
    await this.continue();

    await expect(this.emailError).toHaveText("Enter an email address");

    // Note that even though the CSS variable is showing as
    // a hex value of #E81C00, browsers typically return
    // colors in RGB format so you want to check for that. You
    // could also check the CSS custom property. Note that
    // both checks below might be overkill. I would expect a
    // PR with this code to at least be challenged on that.
    await expect(this.emailError).toHaveCSS("color", "rgb(232, 28, 0)");
    await expect(this.emailError).toHaveClass(/ulp-error-info/);
  }

  async invalidLogin_Incorrect_Password() {
    await this.logInDropDown.click();
    await this.hudlLogin.click();
    this.username.fill("tester@example.com");
    await this.continue();
    this.password.fill("invalid");
    await this.continue();

    await expect(this.passwordError).toHaveText(
      "Incorrect username or password.",
    );

    await expect(this.passwordError).toHaveCSS("color", "rgb(232, 28, 0)");
    await expect(this.passwordError).toHaveClass(/ulp-input-error-message/);
  }
}
