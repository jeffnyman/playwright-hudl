/**
 * Playwright fixture for creating an "already authenticated" browser context.
 *
 * Purpose:
 *  - Logs into Hudl once, saves the storage state (cookies, localStorage, etc).
 *  - Lets other test suites skip the login UI and start from an authenticated page.
 *  - Improves test speed and reduces duplication when authentication is *not* the feature under test.
 *
 * Relationship to my decision framework:
 *  - Stabilize phase: Prove login/logout flows directly (see authentication.spec.ts).
 *  - Sustain phase: Use this fixture in other specs to keep them focused and maintainable.
 *  - Scale phase: Reuse the saved storageState across browsers / CI shards for efficiency.
 */

import { test as base } from "@playwright/test";
import { HudlLandingPage } from "../pages/hudl.landing.page";

export const test = base.extend<{ authedPage }>({
  authedPage: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const hudl = new HudlLandingPage(page);

    await hudl.goto();
    await hudl.validLogin();
    await ctx.storageState({ path: "results/hudl.storage.json" });
    await use(page);
    await ctx.close();
  },
});

export const expect = base.expect;

/**
 * Example of how this would look. This is not actual Hudl
 * functionality. The main thing to note is any such spec
 * would starts tests already logged in and this is due to
 * the authedPage fixture. That Keeps any specs like this
 * exmaple focused on post-auth functionality.

import { test, expect } from "../../../support/fixtures/auth";
import { HudlLandingPage } from "../../../support/pages/hudl.landing.page";

test.describe("Hudl Dashboard (authenticated)", () => {
  test("shows the user menu with display name and email", async ({ authedPage }) => {
    const hudl = new HudlLandingPage(authedPage);

    // We’re already logged in thanks to the fixture, so just verify profile.
    await hudl.verifyProfile();
  });

  test("navigates to the library from the dashboard", async ({ authedPage }) => {
    await authedPage.click('a[href*="library"]');
    await expect(authedPage.getByRole("heading", { name: /library/i })).toBeVisible();
  });
});
*/
