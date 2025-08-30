import { test } from "@playwright/test";
import { HudlLandingPage } from "../../../support/pages/hudl.landing.page";
import { getHudlCredentials } from "../../../support/env";

let hudlLandingPage: HudlLandingPage;

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

  hudlLandingPage = new HudlLandingPage(page);
  await hudlLandingPage.goto();
});

test("handles a valid login attempt", async () => {
  await hudlLandingPage.validLogin();
  await hudlLandingPage.logout();
});

test("handles missing email", async () => {
  await hudlLandingPage.invalidLogin_Missing_Email();
});

test("handles invalid email", async () => {
  await hudlLandingPage.invalidLogin_Invalid_Email();
});

test("handles invalid password", async () => {
  await hudlLandingPage.invalidLogin_Incorrect_Password();
});

test("handles missing password", async () => {
  await hudlLandingPage.invalidLogin_Missing_Password();
});

test("handles valid user, but invalid password", async () => {
  await hudlLandingPage.invalidLogin_Credential_Error();
});
