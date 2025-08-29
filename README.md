<h1 align="center">
  🎭 Playwright Hudl <img src="assets/hudl.png">
</h1>

<p align="center">
  <em>Playwright Project for Hudl Assessment</em>
</p>

<p align="center">
  <img src="https://badgen.net/badge/Built%20With/TypeScript/blue"> 
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

The reason for `npm ci` is covered best in this [Stack Overflow answer](https://stackoverflow.com/a/53325242).

Make sure to install the browsers that Playwright will need.

```shell
npx playwright install
```

## 💻 Execution

In Playwright, a project is a logical group of tests that run using the same configuration. The sections below will each be shown with a command that executes the specific project. For any examples that are marked as UI, you can pass the `--headed` argument in order to see the browser execution.

You can run any Playwright tests using the [VS Code extension](https://playwright.dev/docs/getting-started-vscode) if you have it installed.

### 🔸 Ludic UI Tests (EXTRA CREDIT)

I'm using my own site material for this. I have a sample article called [A Ludic Historian Précis](https://testerstories.com/xyzzy/ludic/article/precis.html).

The Ludic pages are simply designed as blog content pages. Their complexity comes in from how the header and the scroll-to-top functionality have dynamic aspects, in terms of how and when they display. The dark-light mode is a relatively simply implementation that also accounts for the system setting. There are two spec files here: one that uses a page object and the other that does not.

To run these tests:

```shell
npx playwright test --project "Ludic UI Tests"
```

### 🔸 Playground UI Tests (EXTRA CREDIT)

The application is here is my [Playwright Playwround](https://testerstories.com/xyzzy/). The playground area is designed to provide a simple landing page but then add some complexity. For example, the navigation pull out menu can have some challenges around checking for visibility and whether the widgets are in the viewport or not.

To run all the tests:

```shell
npx playwright test --project "Playground UI Tests"
```

The various pages within the playground are meant to run the gamut from relatively simple implementations of forms to slightly complex tables to elements that dynamically update but only upon the detection of certain user actions.

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
- Embrace brevity without sacrificing readability. Concise, not terse.
- Prefer elegance over efficiency where efficiency is less than critical.

These principles lean toward literate, intention-revealing code; code that is readable and maintainable without succumbing to over-engineering.

---

## 🧬 Code Quality

This project uses Prettier.

<p align="center">
  <a href="https://prettier.io/docs/en/index.html"><img src="https://img.shields.io/badge/Documentation-Prettier-f7ba3e.svg?logo=prettier" alt="Prettier"></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/GitHub-Prettier-f7ba3e.svg?logo=github" alt="Prettier - GitHub"></a>
  <a href="https://stackoverflow.com/questions/tagged/prettier"><img src="https://img.shields.io/badge/stackoverflow-Prettier-e87922.svg?logo=stackoverflow" alt="Prettier - Stack Overflow"></a>
</p>

This is critical for any automation-based project. To run Prettier and automatically fix any issues, you can do this:

```shell
npm run format
```

This project uses ESLint.

<p align="center">
  <a href="https://eslint.org/docs/latest/"><img src="https://img.shields.io/badge/Documentation-ESLint-4b32c3.svg?logo=eslint" alt="ESLint"></a>
  <a href="https://github.com/eslint/eslint"><img src="https://img.shields.io/badge/GitHub-ESLint-4b32c3.svg?logo=github" alt="ESLint - GitHub"></a>
  <a href="https://stackoverflow.com/questions/tagged/eslint"><img src="https://img.shields.io/badge/stackoverflow-ESLint-e87922.svg?logo=stackoverflow" alt="ESLint - Stack Overflow"></a>
</p>

You can run linting in this project by doing this:

```shell
npm run lint
```

If you're feeling confident that the linter will be able to auto-fix your isue, you can run it like this:

```shell
npm run lint:fix
```

---

## 👤 Author

<p align="center">
  Made with 🤍 by Jeff Nyman
</p>

<p align="center">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
</p>

<p align="center">
  <a href="https://testerstories.com" target="_blank" ><img alt="Website - Jeff Nyman" src="https://img.shields.io/badge/Website--%23F8952D?style=social"></a>&nbsp;&nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/jeffnyman/" target="_blank" ><img alt="Linkedin - Jeff Nyman" src="https://img.shields.io/badge/Linkedin--%23F8952D?style=social&logo=linkedin"></a>
</p>

---

## ⚖ License

The code used in this project is licensed under the [MIT license](https://github.com/jeffnyman/playwright-hudl/blob/main/LICENSE).
