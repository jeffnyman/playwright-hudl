import { test } from "@playwright/test";
import { LudicArticlePage } from "./pages/LudicArticlePage";

let ludicArticlePage;

test.beforeEach(async ({ page }) => {
  ludicArticlePage = new LudicArticlePage(page);
  await ludicArticlePage.goto();
});

test("page has expected title text", async () => {
  await ludicArticlePage.confirmPageHeader();
});

test("header conditionally displays", async () => {
  await ludicArticlePage.confirmInitialScrollState();
  await ludicArticlePage.confirmScrollDownState();
});

test("scroll-to-top widget has conditional visibility", async () => {
  await ludicArticlePage.confirmInitialProgress();
  await ludicArticlePage.confirmScrollingProgress();
  await ludicArticlePage.confirmScrollAtBottom();
  await ludicArticlePage.confirmScrollingHide();
});

test("dark/light mode changes background", async () => {
  await ludicArticlePage.lightMode.click();
  await ludicArticlePage.confirmLightBackground();

  await ludicArticlePage.darkMode.click();
  await ludicArticlePage.confirmDarkBackground();
});
