import { test } from "@playwright/test";
import { HudlLandingPage } from "../../../support/pages/hudl.landing.page";

let hudlLandingPage: HudlLandingPage;

test.beforeEach(async ({ page }) => {
  if (!process.env.HUDL_EMAIL || !process.env.HUDL_PASSWORD) {
    throw new Error("Missing HUDL_EMAIL and HUDL_PASSWORD variables.");
  }

  hudlLandingPage = new HudlLandingPage(page);
  await hudlLandingPage.goto();
});

test("VALID LOGIN", async () => {
  await hudlLandingPage.validLogin();
});
