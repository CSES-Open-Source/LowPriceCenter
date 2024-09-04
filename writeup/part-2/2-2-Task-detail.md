# 2.2. Implement the task detail page

Next, we'll add a new frontend page that displays information about a particular task.

## New page: `TaskDetail` (`/task/:id`)

### Specifications

[Link to `TaskDetail` page in Figma](https://www.figma.com/file/8eRDNyOrYRgyN7NNb0mIXA/Onboarding-Todo-App?type=design&node-id=37-624&mode=design&t=sAnv6Hgp6SzriN7g-4)

- Retrieve the task with the ID in the URL on page load.
- Display the task's title, description, assignee, status, and creation date according to the Figma design.
  - We'll implement the user profile component in [Part 2.3](./2-3-Task-assignment.md). For now, you can just display the assignee's ID as a string.
  - If `isChecked` is true, status is "Done"; otherwise, status is "Not done".
  - If no task exists with the ID from the URL, just display the message as shown in the Figma.
- For now, the "Edit task" button should do nothing. (We'll come back to it in [Part 2.3](./2-3-Task-assignment.md).)
- The page title should be "&lt;task title&gt; | TSE Todos".

### Walkthrough

1. Study the variations of the `TaskDetail` page in the Figma carefully.
2. Create a new file `frontend/src/pages/TaskDetail.tsx`. You can copy code from `Home.tsx` or `About.tsx` to set up the basic page outline. Make sure the exported function component is named `TaskDetail`.
3. In `pages/index.ts`, add another line to re-export `TaskDetail` (like `About` and `Home`).
4. In `frontend/src/App.tsx`, add a new [`Route` component](https://reactrouter.com/en/main/route/route) with path `"/task/:id"` and element `<TaskDetail />`.
5. With the frontend running locally, test that the new page is reachable by entering the following URL in your browser: `localhost:3000/task/<id>`, where <id> is the ID of any Task object in your local database.
6. Within the `TaskDetail` component, add a state variable `task` which will store the Task object and add a `useEffect` hook which retrieves the task and puts it into that state variable.
   1. Use the [`useParams` hook](https://reactrouter.com/en/main/hooks/use-params) from React Router to get the task ID from the URL (this is called a [dynamic segment](https://reactrouter.com/en/main/route/route#dynamic-segments)). This ID should be the only dependency of the `useEffect` hook.
   2. Use the `getTask` function from `frontend/src/api/tasks.ts` to retrieve the task from the backend.
7. Add the various text components, Home page link, and "Edit task" button as shown in the Figma. Be sure to style them correctly—you can add a new CSS file `pages/TaskDetail.module.css` for font and layout styling—and to conditionally render things as needed. Also, use the `Helmet` component to set the page title as specified above.
   <details>
   <summary><strong>❓ Hint: Date-time formatting</strong></summary>

   _We recommend using the JavaScript built-in class [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) to format dates and times consistently. In this case, for the task creation date, you can use the `"en-US"` locale, `"full"` date style, and `"short"` time style._
   </details>

8. Verify that different tasks from your local database are displayed correctly on the page. Make sure to check special cases like overflowing text, empty description, and nonexistent ID.

## Update to component: `TaskItem`

### Specification

[Link to updated `TaskItem` component in Figma](https://www.figma.com/file/8eRDNyOrYRgyN7NNb0mIXA/Onboarding-Todo-App?type=design&node-id=36-307&mode=design&t=sAnv6Hgp6SzriN7g-4)

- Allow the user to click on the title of a `TaskItem`, linking to the task detail page.
- Highlight each `TaskItem` when the user's pointer is hovering over it.

### Walkthrough

1. In `frontend/src/components/TaskItem.tsx`, wrap the task title in a React Router [`Link` component](https://reactrouter.com/en/main/components/link) that links to the new `TaskDetail` page. Use the ID of the `TaskItem`'s task.
2. Add some more CSS in `TaskItem.module.css` to override the default `<a>` styling (which comes from `src/globals.css`) for these links.
   1. The text color should match what it was before: primary if not checked, secondary if checked. You can use the [`inherit` CSS keyword](https://developer.mozilla.org/en-US/docs/Web/CSS/inherit) to achieve this.
   2. The underline should only appear on hover.
3. Add more CSS to change the background color of the outermost `<div>` to `--color-surface` on hover.
4. Test your changes by opening the Home page and clicking on some different `TaskItem`s in the list of tasks. You should be directed to the corresponding task detail pages.

## Commit to Git

Remember to add, commit, and push your changes!

| Previous                                | Up           | Next                                                       |
| --------------------------------------- | ------------ | ---------------------------------------------------------- |
| [2.1. Add User objects](./2-1-Users.md) | [Part 2](./) | [2.3. Implement task assignment](./2-3-Task-assignment.md) |
