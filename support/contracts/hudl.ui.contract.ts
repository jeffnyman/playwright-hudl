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

export type HudlUiContract = typeof hudlUiContract;
