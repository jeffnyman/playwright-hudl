/**
 * Centralized "UI contract" for Hudl authentication flows.
 *
 * Purpose:
 *  - Capture the expected UI texts, colors, and tokens that our tests rely on.
 *  - Avoid scattering hard-coded strings across multiple specs.
 *  - Make copy / style changes easier to update in one place.
 *
 * Think of this as the source of truth for what the UI should say/look like,
 * while the page objects define how to interact with it.
 */

export const hudlUiContract = {
  colors: {
    errorRed: "rgb(232, 28, 0)",
  },
  errors: {
    emailRequired: "Enter an email address",
    emailInvalid: "Enter a valid email.",
    passwordRequired: "Enter your password.",
    badCredsGeneric: "Incorrect username or password.",
    badCredsSpecific: "Your email or password is incorrect. Try again.",
  },
};

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
