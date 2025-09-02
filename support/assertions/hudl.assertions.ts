import { expect, type Locator } from "@playwright/test";
import { hudlUiContract as ui } from "../contracts/hudl.ui.contract";

/**
 * Resilient error-state assertion:
 * - optional text match (exact or regex)
 * - optional class regex
 * - computed color (defaults to the contract's error red)
 * - double-RAF + expect.poll to avoid CSS/transition races
 */
export async function expectError(
  el: Locator,
  opts: {
    text?: string | RegExp;
    klass?: RegExp;
    colorLocator?: Locator; // if the color is applied on a different element
    color?: string; // override expected color if needed
    timeoutMs?: number; // default 20s
  } = {},
) {
  const {
    text,
    klass,
    colorLocator,
    color = ui.colors.errorRed,
    timeoutMs = 20_000,
  } = opts;

  await expect(el).toBeVisible();

  if (text !== undefined) {
    if (text instanceof RegExp) {
      await expect(el).toContainText(text, { timeout: timeoutMs });
    } else {
      await expect(el).toHaveText(text, { timeout: timeoutMs });
    }
  }

  if (klass) {
    await expect(el).toHaveClass(klass, { timeout: timeoutMs });
  }

  // Let styles settle across two paints. This can seem a bit odd.
  // After all, how does this reflect usage? By itself, it doesn't.
  // But while users may not be aware of the various paints, those
  // paints *do* happen. Automation needs to be aware of things that
  // users may not be.
  await el.evaluate(
    () =>
      new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r())),
      ),
  );

  const target = colorLocator ?? el;
  await expect
    .poll(
      async () =>
        await target.evaluate((e) => getComputedStyle(e as HTMLElement).color),
      { timeout: timeoutMs, message: "Waiting for error color to apply" },
    )
    .toBe(color);
}
