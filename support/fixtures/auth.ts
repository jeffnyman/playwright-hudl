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
