// This is another file added post assessment but pre-review.
// My goal here is to show how the spec modularizes a bit
// more with a contract style approach. This is based on the
// updated authentication spec.

import { test, expect } from "@playwright/test";
import { HudlLandingPage } from "../../../support/pages/hudl.landing.page";
import { getHudlCredentials } from "../../../support/env";
import { hudlUiContract as ui } from "../../../support/contracts/hudl.ui.contract";

let hudl: HudlLandingPage;

test.describe("Hudl Authentication", () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    const isHealthy = await HudlLandingPage.checkSiteHealth(page);
    await page.close();

    if (!isHealthy) {
      test.skip(true, "Skipping Hudl tests. Site appears to be down or slow.");
    }
  });

  test.beforeEach(async ({ page }) => {
    getHudlCredentials();

    hudl = new HudlLandingPage(page);
    await hudl.goto();
  });

  test("valid login allows user to reach profile, then logout", async () => {
    await test.step("login with valid credentials", async () => {
      await hudl.validLogin();
    });

    await test.step("verify and logout", async () => {
      await hudl.logout();
      await expect(hudl.logInDropDown).toBeVisible({ timeout: 15000 });
    });
  });

  type NegCase = {
    name: string;
    email: string | null;
    password: string | null;
    expectLocator: (p: HudlLandingPage) => import("@playwright/test").Locator;
    expectText: string | RegExp;
    exact?: boolean;
  };

  const negCases: NegCase[] = [
    {
      name: "missing email",
      email: "",
      password: null,
      expectLocator: (p) => p.emailError,
      expectText: ui.errors.emailRequired,
      exact: true,
    },
    {
      name: "invalid email",
      email: "example.com",
      password: null,
      expectLocator: (p) => p.invalidEmail,
      expectText: new RegExp(ui.errors.emailInvalid, "i"),
    },
    {
      name: "missing password",
      email: "tester@example.com",
      password: "",
      expectLocator: (p) => p.missingPassword,
      expectText: new RegExp(ui.errors.passwordRequired, "i"),
    },
    {
      name: "invalid password (generic message for non-existent user)",
      email: "tester@example.com",
      password: "invalid",
      expectLocator: (p) => p.passwordError,
      expectText: new RegExp(ui.errors.badCredsGeneric, "i"),
    },
  ];

  for (const c of negCases) {
    test(`handles ${c.name}`, async () => {
      await hudl.logInDropDown.click();
      await hudl.hudlLogin.click();

      if (c.email !== null) {
        await hudl.fillUsername(c.email);
        await hudl.continue();
      }

      if (c.password !== null) {
        await hudl.fillPassword(c.password);
        await hudl.continue();
      }

      const target = c.expectLocator(hudl);
      if (c.exact) {
        await expect(target).toHaveText(c.expectText as string);
      } else {
        await expect(target).toContainText(c.expectText);
      }

      if (
        target === hudl.emailError ||
        target === hudl.missingPassword ||
        target === hudl.passwordError
      ) {
        await expect(target).toHaveCSS("color", ui.colors.errorRed, {
          timeout: 10_000,
        });
      }
    });
  }

  test("handles valid user but invalid password (specific copy)", async () => {
    await hudl.logInDropDown.click();
    await hudl.hudlLogin.click();

    await hudl.fillUsername();
    await hudl.continue();

    await hudl.fillPassword("invalid");
    await hudl.continue();

    await expect(hudl.passwordError).toHaveText(ui.errors.badCredsSpecific);
    await expect(hudl.passwordError).toHaveCSS("color", ui.colors.errorRed, {
      timeout: 10_000,
    });
  });
});
