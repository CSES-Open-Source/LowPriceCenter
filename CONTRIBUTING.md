# Contributing to CSES Low-Price Center

First off, thank you for considering contributing to Low-Price Center! 🎉 We welcome all contributions and are excited to see what you'll bring to the project.

## Table of Contents

- [Contributing to CSES Low-Price Center](#contributing-to-cses-low-price-center)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
    - [Setting Up the Environment](#setting-up-the-environment)
      - [Downloading Git (and Git Bash)](#downloading-git-and-git-bash)
      - [Downloading Node.JS](#downloading-nodejs)
    - [Setting Up the Local Repository](#setting-up-the-local-repository)
    - [Installing Dependencies](#installing-dependencies)
    - [Setting Up the Local Development Database](#setting-up-the-local-development-database)
    - [Running the Backend and Frontend](#running-the-backend-and-frontend)
    - [Phew... That was a lot of setting up. But you are good to go now!](#phew-that-was-a-lot-of-setting-up-but-you-are-good-to-go-now)
  - [How to Contribute](#how-to-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Features](#suggesting-features)
    - [Improving Documentation](#improving-documentation)
    - [Submitting a Pull Request](#submitting-a-pull-request)
  - [Development Guidlines](#development-guidlines)
    - [Code Style](#code-style)
    - [Commit Messages](#commit-messages)
  - [Contact](#contact)

## Code of Conduct

By participating in this project, you agree to uphold the [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand what actions will and will not be tolerated.

## Getting Started

### Setting Up the Environment

**Note**: You may have to restart terminal after installing each environment.

#### Downloading Git (and Git Bash)

1. Download git and git bash by following [this link](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
2. Set up Git Bash as the shell for running command line prompts (in VSCode or directly openning Git Bash)
3. Run:
   ```bash
   git -v
   ```
   This should output something like this:
   ```bash
   git version 2.46.0.windows.1
   ```

#### Downloading Node.JS

1. Download **nvm (Node Version Manager)**. Follow the instructions on in [this link](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) for the details.
2. Run:
   ```bash
   nvm -v
   ```
   This should output the version of nvm you installed.
3. Install **Node.js v18.20.4**:
   ```bash
   nvm install v18.20.4**
   ```
4. Switch to the installed version:
   ```bash
   nvm use v18.20.4**
   ```
5. Run:
   ```bash
   node -v
   npm -v
   ```
   The results should be something like:
   ```bash
   v18.20.4
   10.7.0
   ```

### Setting Up the Local Repository

1. **Fork the repository** to your GitHub account.
2. **Clone** the origin repository locally:
   ```bash
   git clone https://github.com/CSES-Open-Source/LowPriceCenter.git
   ```
3. Create a **remote repository**:
   ```bash
   git remote add [your-username] https://github.com/[your-username]/LowPriceCenter.git
   ```
4. Run:
   ```bash
   git remote -v
   ```
   The output should be something like the following:
   ```bash
   [your-username]    https://github.com/[your-username]/LowPriceCenter.git (fetch)
   [your-username]    https://github.com/[your-username]/LowPriceCenter.git (push)
   origin  https://github.com/CSES-Open-Source/LowPriceCenter.git (fetch)
   origin  https://github.com/CSES-Open-Source/LowPriceCenter.git (push)
   ```

### Installing Dependencies

1. Open an instance of git bash and run:
   ```bash
   cd frontend
   ```
2. Install frontend libraries:
   ```bash
   npm install
   ```
3. Open another instance of git bash and run:
   ```bash
   cd backend
   ```
4. Install backend libraries:
   ```bash
   npm install
   ```

### Setting Up the Local Development Database

1. Go to [mongodb.com](https://www.mongodb.com/) and create a new account (or login to an existing account if you already have one).
2. **Create a new project** and name it Low-Price Center (or anything you like).
3. **Create a new cluster** in this project by selecting M0 as the plan and deselect **Automate security setup** and **Preload sample datase**. Feel free to choose and name for the cluster and select any location that is closest to you.
4. Go to **Database Access** (under security in the side bar) and create a new user for yourself. Make sure to select **Atlas Admin** as your role.
5. Go to **Network Access** (under security again) and add a new IP address. Click on **Allow access from anywhere**.
6. Go back to **Database** and click **connect** for the cluster you created. Then select **Drivers** and set the drivers to **Node.js**. Copy the link provided below.
7. Create a new file in the local repo under the `backend` folder called `.env` and add the following to the file:
   ```
   MONGODB_URI=[link-copied-from-mongodb]
   PORT=3500
   ```
   Make sure to fill in the `<db_password>` field with the password of your account.

### Running the Backend and Frontend

1. Open an instance of git bash and run:
   ```bash
   cd frontend
   ```
2. Install frontend libraries:
   ```bash
   npm start
   ```
3. Open another instance of git bash and run:
   ```bash
   cd backend
   ```
4. Install backend libraries:
   ```bash
   npm start
   ```

### Phew... That was a lot of setting up. But you are good to go now!

## How to Contribute

### Reporting Bugs

1. Open the [CSES OpenSource Low-Price Center Github Repo](https://github.com/CSES-Open-Source/LowPriceCenter/).
2. Click on the **issues** tab (next to code).
3. Create a **new issue**.
4. Select **Bug report** as the type of issue.
5. Fill in the title and description and submit the issue.

### Suggesting Features

1. Open the [CSES Opensource Low-Price Center Github Repo](https://github.com/CSES-Open-Source/LowPriceCenter/).
2. Click on the **issues** tab (next to code).
3. Create a **new issue**.
4. Select **Feature request** as the type of issue.
5. Fill in the title and description and submit the issue.

### Improving Documentation

### Submitting a Pull Request

1. Create a new branch for the current issue you are working on:
   ```bash
   git checkout -b origin/main [name-of-branch]
   ```
2. Make changes to the branch and **commit changes**. I would recomment using VSCode version control or GitHub Desktop for making commits.
3. Run lint in respective frontend and backend directories:
   ```bash
   npm run lint-check
   ```
   Make sure to fix all lint errors before pushing your code.
4. **Push** the commits to your forked repository:
   ```bash
   git push [your-username] HEAD
   ```
   `[your-username]` is whatever you chose to set the name of your remote repository as. To check this type:
   ```bash
   git remote -v
   ```
5. Go to your forked repository and make a **pull request** to the main branch of the original repository. Make sure to fill in the title and description of the pull request.

## Development Guidlines

### Code Style

Please follow these coding style guidelines:

- We recommend using Prettier to format on save, and then running ESLint before making a pull request.
- Indent with tabs and use a 2-space indentation.
- Use semicolons and the end of each line.
- Write clear, concise comments where necessary.
- Use meaningful variable and function names.

### Contributing Guidelines
- Create a feature branch from main (e.g., feat/add-postgres-stack).
- Use Conventional Commits (feat:, fix:, chore:) to keep history clean and readable.
- Include tests where applicable.
- Run linting and tests before submitting a pull request.
- Ensure your changes follow the existing project structure and registry-based stack system.

---

## Issue Labels

When opening issues or reviewing pull requests, please apply the most relevant label(s) to help maintainers triage and prioritize them. Here’s a basic guide:

| Label | When to Use |
|-------|-------------|
| `bug` | A reproducible error, crash, or incorrect behavior in Taco. |
| `feature` | A new capability or enhancement that does not exist yet. |
| `enhancement` | Improvements to existing features, performance, or developer experience. |
| `docs` | Documentation updates, typos, or README/CONTRIBUTING changes. |
| `refactor` | Code cleanup or restructuring without changing behavior. |
| `ci` | Issues related to GitHub Actions, testing, or build pipelines. |
| `good first issue` | Small, well-scoped issues suitable for new contributors. |

**Tips:**
- Most issues should have **one primary label**.
- If an issue touches multiple areas (e.g., a feature that also needs docs), feel free to add more than one.
- PRs should ideally match the label of the issue they close.

---
### Commit Messages

Please write a rough description for the changes made in each commits

## Contact

For any issues or questions, please contact Chase Peterson (cepeters@ucsd.edu) or UC San Diego CSES (cses@ucsd.edu).
