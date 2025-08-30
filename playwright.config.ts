import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

config();

/**
 * Configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  outputDir: "./results",

  fullyParallel: true,

  /* CI Configurations */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /**
   * Test reporting
   * See See https://playwright.dev/docs/test-reporters
   */
  reporter: [
    ["list", { printSteps: true }],
    ["html", { open: "never", outputFolder: "results" }],
    ["json", { outputFile: "results/results.json" }],
    ["junit", { outputFile: "results/results.xml" }],
  ],

  /**
   * Shared project settings
   * See https://playwright.dev/docs/api/class-testoptions
   */
  use: {
    /**
     * Trace viewing
     * See https://playwright.dev/docs/trace-viewer
     */
    trace: "on-first-retry",
  },

  /**
   * Projects
   * See https://playwright.dev/docs/test-projects
   */
  projects: [
    {
      name: "Tautology Tests",
      testDir: "./tests/tautology",
      testMatch: "**/*.spec.ts",
    },
    {
      name: "Ludic UI Tests",
      testDir: "./tests/ui/ludic",
      testMatch: "**/*.spec.ts",
      use: {
        baseURL: "https://testerstories.com",
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "Playground UI Tests",
      testDir: "./tests/ui/playground",
      testMatch: "**/*.spec.ts",
      use: {
        baseURL: "https://testerstories.com",
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "Hudl Tests",
      testDir: "./tests/ui/hudl",
      testMatch: "**/*.spec.ts",
      use: {
        testIdAttribute: "data-qa-id",
        baseURL: "https://www.hudl.com/",
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
