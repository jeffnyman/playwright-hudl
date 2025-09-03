/* UPDATED

Minimal surface-area change: This leans on my page object flows
and locators, so it's easy to review as a PR).

Table-driven negatives: Adding/altering a case is one JSON-ish row.
I kept one exact-copy assertion as a "canary" and used regex/contains
for others to reduce churn.

Visual/semantic checks: I left a single CSS color check per negative
path bucket to retain my intent without overfitting every assertion.
*/

// NOTE: I ended up skipping this for my contract based test instead.
// But I kept to this to show evolution of thought.

test.skip(); // ADDED THIS TO AVOID THESE OLDER SPECS FROM RUNNING

import { test, expect } from "@playwright/test";
import { HudlLandingPage } from "../../../../support/pages/hudl.landing.page";
import { getHudlCredentials } from "../../../../support/env";

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
      expectText: "Enter an email address",
      exact: true, // keep one canary exact-copy assertion
    },
    {
      name: "invalid email",
      email: "example.com",
      password: null,
      expectLocator: (p) => p.invalidEmail,
      // Slightly softer to tolerate punctuation/copy tweaks
      expectText: /Enter a valid email/i,
    },
    {
      name: "missing password",
      email: "tester@example.com",
      password: "",
      expectLocator: (p) => p.missingPassword,
      expectText: /Enter your password/i,
    },
    {
      name: "invalid password (generic message for non-existent user)",
      email: "tester@example.com",
      password: "invalid",
      expectLocator: (p) => p.passwordError,
      expectText: /Incorrect username or password/i,
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

      // Keep one visual/semantics check to assert invalid state without overfitting copy.
      // (Color token can churn; leaving it in for now because I already rely on it.)
      if (
        target === hudl.emailError ||
        target === hudl.missingPassword ||
        target === hudl.passwordError
      ) {
        await expect(target).toHaveCSS("color", "rgb(232, 28, 0)", {
          timeout: 10_000,
        });
      }
    });
  }

  // Specific “valid user but invalid password” variant that uses env email
  // and expects the more specific copy I called out.
  test("handles valid user but invalid password (specific copy)", async () => {
    await hudl.logInDropDown.click();
    await hudl.hudlLogin.click();

    // Use env HUDL_EMAIL for the 'known user' branch
    await hudl.fillUsername(); // from env
    await hudl.continue();

    await hudl.fillPassword("invalid");
    await hudl.continue();

    // Expect the specific copy variant
    await expect(hudl.passwordError).toHaveText(
      "Your email or password is incorrect. Try again.",
    );

    await expect(hudl.passwordError).toHaveCSS("color", "rgb(232, 28, 0)", {
      timeout: 10_000,
    });
  });
});
