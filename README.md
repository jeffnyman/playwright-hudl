<h1 align="center">
  🎭 Playwright Hudl <img src="assets/hudl.png">
</h1>

<p align="center">
  <em>Playwright Project for Hudl Assessment</em>
</p>

<p align="center">
  <a href="https://github.com/jeffnyman/playwright-hudl/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Playwright Hudl is released under the MIT license.">
  </a>
</p>

<p align="center">
  Works on <img src="assets/win_sm.png" alt="Windows"> Windows,
  <img src="assets/apple_sm.png" alt="macOS"> macOS and
  <img src="assets/linux_sm.png" alt="Linux"> Linux.
</p>

---

<p align="center">
  <a href="https://playwright.dev/docs/intro"><img src="https://img.shields.io/badge/Documentation-Playwright-1c8620.svg?logo=playwright" alt="Playwright.dev"></a>
  <a href="https://github.com/microsoft/playwright/tree/main"><img src="https://img.shields.io/badge/GitHub-Playwright-1c8620.svg?logo=github" alt="Playwright - GitHub"></a>
  <a href="https://stackoverflow.com/questions/tagged/playwright"><img src="https://img.shields.io/badge/stackoverflow-Playwright-e87922.svg?logo=stackoverflow" alt="Playwright - Stack Overflow"></a>
</p>

## 🟢 Prerequisites

Make sure you have [Node.js](https://nodejs.org/en). The LTS version should be fine. You will also need the `npm` package manager, which comes with Node.js. A development environment or IDE with TypeScript/JavaScript support will help. [Visual Studio Code](https://code.visualstudio.com/) is a good choice.

## ⚡ Quick Start

Clone the repository and then set everything up:

```shell
npm ci
```

Make sure to install the browsers that Playwright will need.

```shell
npx playwright install
```

## 💻 Execution

In Playwright, a project is a logical group of tests that run using the same configuration. The sections below will each be shown with a command that executes the specific project. For any examples that are marked as UI, you can pass the `--headed` argument in order to see the browser execution.

You can run any Playwright tests using the [VS Code extension](https://playwright.dev/docs/getting-started-vscode) if you have it installed.

### 🔸 Tautology Tests

These tests do not use a browser at all. They are meant to showcase the idea of simply writing tests and having some general tautologies that validate the basic operation of the testing framework.

One of the tautology tests isn't entirely frivolous since it serves as a small API test as well. My [Swagger UI](https://testerstories.com/swagger-ui) is set up with some simple OpenAPI specs, one of which is my [tautology spec](https://testerstories.com/files/api/openapi_test.yml) which is run as part of this project.

```shell
npx playwright test --project "Tautology Tests"
```

Try running just the tests marked as `@canary`. You have to do this differently based on the operating system. For any POSIX-based system:

```shell
npx playwright test --project "Tautology Tests" --grep @canary
```

For Windows, particularly in Powershell:

```shell
npx playwright test --project "Tautology Tests" --grep "@canary"
```

---

## 👨‍💻 Jeff's Principles of Coding

- Embrace small code.
- Abstraction encourages clarity.
- No computation is too small to be put into a helper function.
- No expression is too simple to be given a name.
- Small code is more easily seen to be obviously correct.
- Code that’s more obviously correct can be more easily composed.
- Be willing to trade elegance of design for practicality of implementation.
- Embrace brevity, but do not sacrifice readability. Concise, not terse.
- Prefer elegance over efficiency where efficiency is less than critical.

---

## ⚖ License

The code used in this project is licensed under the [MIT license](https://github.com/jeffnyman/playwright-hudl/blob/main/LICENSE).
