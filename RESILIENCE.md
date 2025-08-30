## Resilience and External Site Testing

Testing against live external websites presents unique challenges that require specific strategies to maintain test reliability. Interesingly, with Hudl, I found my tests were running fine without too much resilience logic built in but on Saturday that was very much not the case. In this document, I'll outline some strategies I took.

### Site Health Monitoring

The test suite includes proactive health checking to avoid running tests against unresponsive sites.

```javascript
// Static method for reusable health checks
static async checkSiteHealth(page) {
  // HTTP response check + basic navigation test
  // Used in beforeAll() to skip entire test suites if site is down
}
```

This approach fails fast when external dependencies are unavailable, providing clear feedback instead of mysterious timeouts.

### Timeout Configuration Strategy

Right now, I'm leaving the logic as it is which might mean that the Playwright reports list a flaky test or two. However, what might I do to change that? Different test categories require different timeout strategies. The Hudl tests could extended timeouts to accommodate external site variability.

**Project-Level Configuration:**
- Test timeout: 120,000ms (2 minutes vs. default 30 seconds)
- Action timeout: 30,000ms (for individual clicks, fills, etc.)
- Navigation timeout: 60,000ms (for page loads)

**Rationale:** External sites like Hudl.com can experience variable response times due to network conditions, server load, and geographic distribution. Rather than making all tests slower, these project-specific timeouts would target only the tests that need them. Here is how I might do that in my `playwright.config.ts`:

```javascript
{
  name: "Hudl Tests",
  testDir: "./tests/ui/hudl",
  testMatch: "**/*.spec.ts",
  timeout: 120000, // 2 minutes per test
  retries: 2, // Retry failed tests twice
  use: {
    testIdAttribute: "data-qa-id",
    baseURL: "https://www.hudl.com/",
    actionTimeout: 30000, // Individual actions
    navigationTimeout: 60000, // Page loads
    ...devices["Desktop Chrome"],
  },
}
```

### Retry Mechanisms

The configuration implements multiple layers of retry logic.

**Test-Level Retries:**

```javascript
retries: 3 // Automatically retry failed tests
```

**Custom Navigation Retries:**

I could do something like this as well, although I don't in this assessment project.

```javascript
async goto(retries = 2) {
  // Custom retry logic with fallback strategies
  // Handles network issues and slow page loads
}
```

**CSS Loading Resilience:**

```javascript
await expect(element).toHaveCSS('color', 'rgb(232, 28, 0)', { timeout: 10000 });
```

Extended timeouts for CSS assertions handle the race condition between DOM element appearance and stylesheet application.

### Flaky Test Handling

The test framework distinguishes between:

- **Hard failures** (actual bugs or configuration issues)
- **Flaky tests** (intermittent external site issues that resolve on retry)

Flaky test reports indicate the resilience mechanisms are working correctly! This means that the tests recover from temporary issues without manual intervention.

### Trade-offs in Resilience

**Chosen Approach:**

- Proactive health checks to avoid wasted test runs
- Generous timeouts for external site dependencies
- Automatic retries for intermittent failures
- Graceful degradation with clear error messages

**Alternative Approaches Not Taken:**

- Mocking/stubbing external services (reduces real-world validation)
- Circuit breaker patterns (adds complexity for limited benefit in test automation)
- Complex retry algorithms (simple retry counts proved sufficient)

My resilience strategy acknowledges that external site testing inherently involves some unpredictability while providing mechanisms to distinguish between real issues and temporary service disruptions.
