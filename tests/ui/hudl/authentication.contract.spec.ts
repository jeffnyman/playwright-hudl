// This is another file added post assessment but pre-review.
// My goal here is to show how the spec modularizes a bit
// more with a contract style approach. This is based on the
// updated authentication spec.

import { test } from "@playwright/test";
import { HudlLandingPage } from "../../../support/pages/hudl.landing.page";
import { getHudlCredentials } from "../../../support/env";

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
    // Reduce timing flake from UI animations.
    await page.emulateMedia({ reducedMotion: "reduce" });

    getHudlCredentials();

    hudl = new HudlLandingPage(page);
    await hudl.goto();
  });

  test("valid login allows user to reach profile, then logout", async () => {
    await hudl.validLogin();
    await hudl.logout();
    await hudl.expectLoggedOut();
  });

  // Table-driven negative cases that delegate to page-object semantic assertions.
  type NegCase = {
    name: string;
    email: string | null; // null means "don't fill username yet"
    password: string | null; // null means "don't fill password"
    assert: (p: HudlLandingPage) => Promise<void>;
  };

  const negCases: NegCase[] = [
    {
      name: "missing email",
      email: "",
      password: null,
      assert: (p) => p.assertMissingEmailError(),
    },
    {
      name: "invalid email",
      email: "example.com",
      password: null,
      assert: (p) => p.assertInvalidEmailError(),
    },
    {
      name: "missing password",
      email: "tester@example.com",
      password: "",
      assert: (p) => p.assertMissingPasswordError(),
    },
    {
      name: "invalid password (generic message for non-existent user)",
      email: "tester@example.com",
      password: "invalid",
      assert: (p) => p.assertIncorrectPasswordErrorGeneric(),
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

      await c.assert(hudl);
    });
  }

  test("handles valid user but invalid password (specific copy)", async () => {
    await hudl.logInDropDown.click();
    await hudl.hudlLogin.click();

    await hudl.fillUsername(); // uses HUDL_EMAIL from env
    await hudl.continue();

    await hudl.fillPassword("invalid");
    await hudl.continue();

    await hudl.assertBadCredsSpecificError();
  });
});
