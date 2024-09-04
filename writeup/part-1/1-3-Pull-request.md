# 1.3. Make a pull request

1. Open your repository in GitHub (your fork, not the original).
2. [Start a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request#creating-the-pull-request) from your `part-1` branch into `main`.
3. Scroll through the diff (difference comparison) to make sure you haven't accidentally left in debugging code, TODO comments, etc. If you have, remove them and push a new commit.
   <details>
   <summary><strong>✅ Good practice: Fix problems before review</strong></summary>

   _You can do this step before or after creating the pull request. Just try to fix any problems before someone else reviews your code, so they can focus on the actual changes._
   </details>

4. Fill out the template by briefly describing the changes you've made. Since this is just a tutorial, you don't have to include screenshots, testing evidence, or issue numbers, but feel free to add some as practice.
5. Click "Create pull request."
   <details>
   <summary><strong>❓ Hint: Draft pull requests</strong></summary>

   _You can also create "draft" pull requests for cases where you want the PR in place but aren't quite finished with making changes yet. The option is available by clicking the down arrow next to "Create pull request."_
   </details>

6. Merge the PR once all checks have passed (it should only take a minute or two).
   <details>
   <summary><strong>🤔 For new developers: Automatic PR checks</strong></summary>

   _We use GitHub Actions to run some automatic checks on every PR in this repo. They make sure that all files follow Prettier and ESLint rules and that all unit tests pass before you're allowed to merge. If one of these checks fails, investigate it by clicking on the Details link and try to fix the problem. If you're still stuck, feel free to reach out in **#onboarding** for help._
   </details>
   <details>
   <summary><strong>✅ Good practice: Keep main commit history clean</strong></summary>

   _There are [multiple ways to merge a PR](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github) on GitHub: merge commit, squash-and-merge, or rebase-and-merge. We generally recommend that you do one of the latter two in order to keep the `main` commit history clean. Your engineering manager will decide the policy for your project._
   </details>
   <details>
   <summary><strong>✅ Good practice: Enforce these practices with your repo settings</strong></summary>

   _You can enable or disable each PR merge method in your repository settings, as well as set [branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) to, say, require automatic checks to pass before a PR can be merged into the `main` branch. These options are set in the template repo, but they're not copied to repos created from it. Your engineering manager should handle the settings on your future project repository._
   </details>

7. Back in your command prompt, checkout and pull the `main` branch to update it on your local computer:
   ```shell
   git checkout main
   git pull
   ```
   You can also delete your old branch locally:
   ```shell
   git branch -d part-1
   ```

| Previous                                               | Up           | Next                                |
| ------------------------------------------------------ | ------------ | ----------------------------------- |
| [1.2. Implement task checkoff](./1-2-Task-checkoff.md) | [Part 1](./) | [Part 2. More features](../part-2/) |
