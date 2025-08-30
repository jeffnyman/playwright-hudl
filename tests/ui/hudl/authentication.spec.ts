import { test } from "@playwright/test";
import { HudlLandingPage } from "../../../support/pages/hudl.landing.page";
import { getHudlCredentials } from "../../../support/env";

let hudlLandingPage: HudlLandingPage;

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

test("handles invalid password", async () => {
  await hudlLandingPage.invalidLogin_Incorrect_Password();
});

test("handles missing password", async () => {
  await hudlLandingPage.invalidLogin_Missing_Password();
});
