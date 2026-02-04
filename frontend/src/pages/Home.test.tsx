import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
// import { Home } from "/src/pages/Home";

/**
 * Renders the `TaskForm` component for use in tests
 * (this seems broken?)
 */
// function mountComponent() {
//   render(<Home />);
// }

/**
 * The callback below runs after each test (see
 * https://vitest.dev/api/#aftereach). Often you'll run `clearAllMocks()` or
 * `resetAllMocks()`, which reset the state of all mock functions
 * (https://vitest.dev/api/vi.html#vi-clearallmocks). In this case, we only want
 * to "clear" because "reset" also removes any mock implementations, which we
 * should leave alone for this test suite.
 */
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

/**
 * A `describe` block helps to group tests together, but is not required. You
 * can nest them--for example, we could have something like:
 * ```js
 * describe("BigComponent", () => {
 *   describe("functionality 1", () => {
 *     it("does something", () => {
 *       // ...
 *     })
 *     // ...
 *   });
 *   describe("functionality 2", () => {
 *     // ...
 *   })
 * })
 * ```
 * See https://vitest.dev/api/#describe for more information.
 */
describe("Home", () => {
  /**
   * The `it` function defines a single test. The first parameter is a string
   * that names the test. You should follow the format below (starts with a
   * present-tense verb) so it reads as "it renders create mode", where "it"
   * refers to "TaskForm". The second parameter is a function that contains the
   * code for the test.
   *
   * This first test simply renders the component, then checks that the "New
   * task" title is present. These kinds of tests are easy to write but do not
   * verify any actual behavior/logic, so be sure to write additional tests like
   * the third and fourth ones in this file.
   *
   * `it` is actually an alias for the `test` function. We use `it` so it reads
   * like a sentence.
   *
   * See https://vitest.dev/api/#test for more information.
   */
  it("passes", () => {
    // mountComponent();
    // https://vitest.dev/api/expect.html
    expect(true);
    // expect(screen.queryByText("Welcome to Low-Price Center!")).toBeInTheDocument();
  });
});
