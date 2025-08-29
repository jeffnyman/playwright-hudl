import { expect, type Locator, type Page } from "@playwright/test";

export class LudicArticlePage {
  readonly page: Page;
  readonly body: Locator;
  readonly header: Locator;
  readonly pageHeader: Locator;
  readonly lightMode: Locator;
  readonly darkMode: Locator;
  readonly progressScroll: Locator;

  constructor(page: Page) {
    this.page = page;
    this.body = page.locator("body");
    this.header = page.locator("header");
    this.pageHeader = page.locator("h1");
    this.lightMode = page.locator('label[for="mode-light"]');
    this.darkMode = page.locator('label[for="mode-dark"]');
    this.progressScroll = page.locator("#progress-scroll");
  }

  async goto() {
    await this.page.goto(
      "https://testerstories.com/xyzzy/ludic/article/precis.html",
    );
  }

  async confirmPageHeader() {
    await expect(this.pageHeader).toBeVisible();
    await expect(this.pageHeader).toHaveText("A Ludic Historian Précis");
  }

  async confirmInitialScrollState() {
    await expect(this.header).toHaveClass("nav-down");
  }

  async confirmScrollDownState() {
    // const pageHeight = await this.page.evaluate(
    //   () => document.body.scrollHeight,
    // );
    await this.page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

    await expect(this.header).toHaveClass("nav-up");
  }

  async confirmScrollUpState() {
    await this.page.evaluate("window.scrollTo(0, 0)");
    await expect(this.header).toHaveClass("nav-down");
  }

  async confirmInitialProgress() {
    await expect(this.progressScroll).toHaveCSS("visibility", "hidden");
  }

  async confirmScrollingProgress() {
    await this.page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await expect(this.progressScroll).toHaveCSS("visibility", "visible");
  }

  async confirmScrollAtBottom() {
    await this.page.waitForTimeout(3000);
    await expect(this.progressScroll).toHaveCSS("visibility", "visible");
  }

  async confirmScrollingHide() {
    await this.page.evaluate(
      "window.scrollTo(0, document.body.scrollHeight / 2)",
    );
    await this.page.waitForTimeout(3000);
    await expect(this.progressScroll).toHaveCSS("visibility", "hidden");
  }

  async confirmLightBackground() {
    const lightBgColor = await this.body.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    // expect(lightBgColor).toBe("hsla(0, 0%, 100%, 1)");
    expect(lightBgColor).toBe("rgb(255, 255, 255)");
  }

  async confirmDarkBackground() {
    const darkBgColor = await this.body.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    //expect(darkBgColor).toBe("hsla(0, 0%, 0%, 1)");
    expect(darkBgColor).toBe("rgb(0, 0, 0)");
  }
}
