# Hudl Auth Tests — Sustain & Scale Update (High-Level)

My test automation choices follow my particular decision framework, which I can break down like this:

- **Stabilize**: get it working reliably
- **Sustain**: make it maintainable for the team
- **Scale**: optimize for growth and complexity

This doc summarizes what I implemented from the initial examples (submitted for the assessment) to move through **Sustain** and set up **Scale** for the team review. If something says "(optional)" below, I did not implement that but indicate it as a possible option.

---

## What Changed (at a glance)

### Stabilize → Reliability first
- **Deterministic navigation:** `goto()` now waits for `domcontentloaded` and then a real, stable element (`login-select`) instead of `networkidle`.
- **Await everything:** all field `fill()` calls and critical interactions are awaited; elements are pre-waited for visibility.
- **Site health gate:** faster, typed `checkSiteHealth()` with shorter timeouts to avoid slow-start flakes.

### Sustain → Maintainability & clarity
- **Resilient selectors:** `byAnyTestId()` supports either `data-testid` or `data-qa-id` without code churn.
- **UI Contract:** `support/contracts/hudl.ui.contract.ts` centralizes user-facing strings and tokens.
- **Assertion helper:** `support/assertions/hudl.assertions.ts` owns brittle checks (text/class/color) with double-RAF + `expect.poll` to avoid CSS/animation races.
- **Semantic page object assertions:** Page object delegates to the helper via methods like `assertMissingPasswordError()` for clean specs and a single assertion path.
- **Table-driven negatives:** Specs drive error cases from a small data table (one row = one new scenario) and keep one "canary" exact-copy assertion.
- **Logout robustness:** New `expectLoggedOut()` accepts multiple valid post-logout states (home header or `/login`) and falls back to home explicitly. This is commented to show the different conditions.
- **Targeted time budgets (optional):** Per-project `navigationTimeout`/`expect.timeout` tuned; `trace: on-first-retry` for actionable flake forensics.

### Scale → Ready for growth
- **Pre-auth fixture:** `support/fixtures/auth.ts` creates/stores `storageState` for post-auth suites (feature tests skip the login UI).
- **Contract suite (optional):** a small "UI contract" test can fail fast when hooks/copy drift.
- **Tagging & sharding (optional):** `@auth`, `@negatives`, `@contract`, `@smoke` to run the right slices in PR vs nightly.
- **Governance (optional):** CODEOWNERS on page objects/contracts; flake budget + quarantine lane.

---

## Usage Patterns

- **authentication.*.spec.ts**
  - Purpose: *prove* login/logout; cover invalid states.
  - Behavior: *always* uses the UI, never uses the pre-auth fixture.
  - Assertions: call page object semantic methods (which delegate to the helper) *or* call the helper directly.

- **Post-auth feature specs** (`dashboard.spec.ts`; shown in a comment)
  - Purpose: test features after auth.
  - Behavior: use `support/fixtures/auth.ts` (or `storageState` in project config) to start logged in.
  - Avoid re-testing login here.

---

## Guardrails

- Prefer **semantics over style**: assert error presence/class/ARIA first; treat color as a secondary check (via the helper).
- Keep **copy/tokens** in the contract, not scattered in specs.
- Let the **helper** own timing tricks (double-RAF + `expect.poll`); don't reintroduce raw `toHaveCSS` checks elsewhere.
- Logout is **route-flexible**: assert logged-out state, not a specific page.

---

## Backlog (Optional Next Steps)

- Add a tiny **UI contract suite** to PR checks.
- Introduce **test tags** and shard in CI.
- Expand **execution matrix** (browsers/devices) in nightly runs.
- Track **flaky-on-retry** tests in the summary reporter.

---

### Why this fits my decision framework

- **Stabilize:** deterministic waits, awaited actions, health gate.
- **Sustain:** single sources of truth (contract + helper), table-driven cases, clean PO/spec boundaries.
- **Scale:** pre-auth fixture, fast-fail contracts, CI ergonomics for larger teams and test counts.
