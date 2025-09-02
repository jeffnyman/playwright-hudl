import { expect, type Locator, type Page } from "@playwright/test";
import { getRequiredEnv } from "../env";
import { expectError } from "../assertions/hudl.assertions";
import { hudlUiContract as ui } from "../contracts/hudl.ui.contract";

// Helper for resilience: support either data-testid or data-qa-id.
function byAnyTestId(page: Page, id: string): Locator {
  return page.locator(`[data-testid="${id}"], [data-qa-id="${id}"]`);
}

export class HudlLandingPage {
  readonly page: Page;
  readonly logInDropDown: Locator;
  readonly hudlLogin: Locator;
  readonly hudlLogout: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly emailError: Locator;
  readonly invalidEmail: Locator;
  readonly passwordError: Locator;
  readonly missingPassword: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logInDropDown = byAnyTestId(page, "login-select");
    this.hudlLogin = byAnyTestId(page, "login-hudl");
    this.hudlLogout = byAnyTestId(page, "webnav-usermenu-logout");

    this.username = page.locator("#username");
    this.password = page.locator("#password");

    this.emailError = page.locator("#error-cs-email-required");
    this.invalidEmail = page.locator("#error-cs-email-invalid");
    this.passwordError = page.locator("#error-element-password");
    this.missingPassword = page.locator("#error-cs-password-required");

    this.continueBtn = page.getByRole("button", {
      name: "Continue",
      exact: true,
    });
  }

  static async checkSiteHealth(page: Page): Promise<boolean> {
    try {
      const res = await page.request.get("https://www.hudl.com/", {
        timeout: 10_000,
      });
      if (!res.ok())
        throw new Error(`HTTP ${res.status()}: ${res.statusText()}`);
      await page.goto("https://www.hudl.com/", {
        waitUntil: "domcontentloaded",
        timeout: 20_000,
      });
      return true;
    } catch {
      return false;
    }
  }

  async goto() {
    await this.page.goto("/", {
      waitUntil: "domcontentloaded",
      timeout: 20_000,
    });
    await this.logInDropDown.waitFor({ state: "visible", timeout: 15_000 });
  }

  async logout() {
    const userMenuTrigger = this.page.locator(".hui-globaluseritem");
    await userMenuTrigger.waitFor({ state: "visible" });
    await userMenuTrigger.click();

    await this.hudlLogout.first().waitFor({ state: "visible" });
    await this.hudlLogout.first().click();
  }

  async fillUsername(value = getRequiredEnv("HUDL_EMAIL")) {
    await this.username.waitFor({ state: "visible" });
    await this.username.fill(value);
  }

  async fillPassword(value = getRequiredEnv("HUDL_PASSWORD")) {
    await this.password.waitFor({ state: "visible" });
    await this.password.fill(value);
  }

  async continue() {
    await this.continueBtn.waitFor({ state: "visible" });
    await this.continueBtn.click();
  }

  async verifyProfile() {
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

  // ---------- Semantic assertion helpers (delegate to expectError) ----------

  async assertInvalidEmailError() {
    // Text is on #error-cs-email-invalid; color might be applied on #error-cs-email-required.
    await expectError(this.invalidEmail, {
      text: ui.errors.emailInvalid,
      // class is optional here if Hudl doesn't apply one consistently for this case
      colorLocator: this.emailError, // use this if you've observed color there
    });
  }

  async assertMissingEmailError() {
    await expectError(this.emailError, {
      text: ui.errors.emailRequired,
      klass: /ulp-error-info/,
    });
  }

  async assertIncorrectPasswordErrorGeneric() {
    await expectError(this.passwordError, {
      text: ui.errors.badCredsGeneric,
      klass: /ulp-input-error-message/,
    });
  }

  async assertMissingPasswordError() {
    await expectError(this.missingPassword, {
      text: ui.errors.passwordRequired,
      klass: /ulp-validator-error/,
    });
  }

  async assertBadCredsSpecificError() {
    await expectError(this.passwordError, {
      text: ui.errors.badCredsSpecific,
      klass: /ulp-input-error-message/,
    });
  }

  // ---------- Negative flows using the semantic assertions ----------

  async invalidLogin_Invalid_Email() {
    await this.logInDropDown.click();
    await this.hudlLogin.click();
    await this.fillUsername("example.com");
    await this.continue();
    await this.assertInvalidEmailError();
  }

  async invalidLogin_Missing_Email() {
    await this.logInDropDown.click();
    await this.hudlLogin.click();
    await this.fillUsername("");
    await this.continue();
    await this.assertMissingEmailError();
  }

  async invalidLogin_Incorrect_Password() {
    await this.logInDropDown.click();
    await this.hudlLogin.click();
    await this.fillUsername("tester@example.com");
    await this.continue();
    await this.fillPassword("invalid");
    await this.continue();
    await this.assertIncorrectPasswordErrorGeneric();
  }

  async invalidLogin_Missing_Password() {
    await this.logInDropDown.click();
    await this.hudlLogin.click();
    await this.fillUsername("tester@example.com");
    await this.continue();
    await this.fillPassword("");
    await this.continue();
    await this.assertMissingPasswordError();
  }

  async invalidLogin_Credential_Error() {
    await this.logInDropDown.click();
    await this.hudlLogin.click();
    await this.fillUsername();
    await this.continue();
    await this.fillPassword("invalid");
    await this.continue();
    await this.assertBadCredsSpecificError();
  }
}
