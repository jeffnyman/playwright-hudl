import { expect, type Locator } from "@playwright/test";
import { hudlUiContract as ui } from "../contracts/hudl.ui.contract";

/**
 * Resilient error-state assertion.
 *
 * What it does:
 *  - Checks visibility.
 *  - (Optional) Checks text (exact or regex).
 *  - (Optional) Checks class via regex.
 *  - Checks the computed color (defaults to contract's error red).
 *  - Uses double-RAF + expect.poll to avoid CSS/animation/timing races.
 *
 * Usage:
 *   await expectError(page.locator('#error-id'), {
 *     text: ui.errors.emailRequired,
 *     klass: /ulp-error-info/,
 *   });
 *
 * If the color is applied to a different node than the text:
 *   await expectError(textEl, { colorLocator: colorEl });
 */
export async function expectError(
  el: Locator,
  opts: {
    text?: string | RegExp;
    klass?: RegExp;
    colorLocator?: Locator; // when the color lives on a sibling/container
    color?: string; // override expected color (default = ui.colors.errorRed)
    timeoutMs?: number; // default 20s
  } = {},
): Promise<void> {
  const {
    text,
    klass,
    colorLocator,
    color = ui.colors.errorRed,
    timeoutMs = 20_000,
  } = opts;

  // Element must exist and be visible.
  await expect(el).toBeVisible({ timeout: timeoutMs });

  // Text check (exact or partial/regex).
  if (text !== undefined) {
    if (text instanceof RegExp) {
      await expect(el).toContainText(text, { timeout: timeoutMs });
    } else {
      await expect(el).toHaveText(text, { timeout: timeoutMs });
    }
  }

  // Class check (regex).
  if (klass) {
    await expect(el).toHaveClass(klass, { timeout: timeoutMs });
  }

  // Give styles two paints to settle (avoids transient default color).
  await el.evaluate(
    () =>
      new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r())),
      ),
  );

  // Compute color on either the element itself or a provided target.
  const colorTarget = colorLocator ?? el;

  await expect
    .poll(
      async () =>
        colorTarget.evaluate((e) => getComputedStyle(e as HTMLElement).color),
      {
        timeout: timeoutMs,
        message: "Waiting for error color to apply",
      },
    )
    .toBe(color);
}
