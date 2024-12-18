# orikan-ui-automation-test

## Description

Technical test code including documentation for Orikan's UI Automation Test. This project is an automated testing suite built with **Jest** and **Playwright** to test the functionalities of a web application. 

---

### File list:
```bash
/orikan-ui-automation-test
├── /docs
│   └── raymond-caucci-orikan-ui-automation-test-documentation.pdf
├── emailRegistration.test.js
├── contactRegistration.test.js
├── paymentRegistration.test.js
├── termsAndConditions.test.js
├── playwright.config.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

### Prerequisites

Make sure you have **Node.js** and **npm** installed on your machine.

### Installation

To get started with this project, follow the steps below:

1. **Initialize the Project:**
   Run the following command to initialize your project:
   ```bash
   npm init -y
   ```

2. **Install Dependencies:**
   Install the necessary dependencies:
   ```bash
   npm install
   ```

3. **Install Playwright Browsers:**
   ```bash
   npx playwright install
   ```

4. **Run Tests:**
   To run the tests, use the following command:
   ```bash
   npx jest
   ```

   This will run all the test suites in the project.

5. **Run Specific Test Suites:**
   If you want to run a specific test suite and ignore others, use this to exclude the suite specified:
   ```bash
   npx jest --testPathIgnorePatterns=".*testSuiteName.test.js"
   ```
   For excluding multiple suites:
   ```bash
    npx jest --testPathIgnorePatterns=".*(testSuiteName1|testSuiteName2).test.js"
   ```
   Replace `testSuiteName` with the name of the test suite you want to exclude. (i.e. emailRegistration)

---
