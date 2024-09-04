# 2.3. Implement task assignment

Finally, we'll add the ability to assign users to tasks and see who is the assignee for a particular task.

## New component: `UserTag`

### Specification

[Link to `UserTag` component in Figma](https://www.figma.com/file/8eRDNyOrYRgyN7NNb0mIXA/Onboarding-Todo-App?type=design&node-id=38-552&mode=design&t=sAnv6Hgp6SzriN7g-4)

- This component should receive an optional User object as a prop.
- If the user is null or undefined, then display the "Not assigned" message as shown in Figma.
- If there is no profile picture URL, then use the default icon provided in Figma.
- The profile picture should be a 32px by 32px circle.

### Walkthrough

1. Export the user icon from Figma as an SVG.
   1. Right-click on the icon, choose "Select layer > User icon", then click "Export User icon" in the Export panel of the right sidebar.
   2. Save the SVG in the `frontend/public` folder with a name like `userDefault.svg`.
2. In `frontend/src/components`, create two new files: `UserTag.tsx` and `UserTag.module.css`.
3. Write the `UserTag` component. It should be a "pure" component (no state or side effects). Make sure you cover all the possible cases with conditional rendering.

   1. Use an [`<img>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) to display the profile picture. To use the default icon we just downloaded, pass in `src="/userDefault.svg"` (or whatever file name you used).
   <details>
   <summary><strong>❓ Hint: CORS errors</strong></summary>

   _You might encounter a CORS (Cross-Origin Resource Sharing) permission error caused by the profile picture. This happens because browsers block requests for any resource that's not from the same origin (in our case, `localhost:3000`) by default for security reasons. You can ignore these errors and just use the example profile pictures that we provided (see [Part 2.1](./2-1-Users.md))._
   </details>

4. Add styles to the `UserTag` component. You should just need some layout styling and a `border-radius` on the profile picture.
5. Export `UserTag` from `components/index.ts`.
6. **Optional:** Add a `className` prop and pass it along to the outermost element in your `UserTag` JSX. You can use this prop to make layout easier in the next steps.

## Update to component: `TaskItem`

### Specification

[Link to updated `TaskItem` component in Figma](https://www.figma.com/file/8eRDNyOrYRgyN7NNb0mIXA/Onboarding-Todo-App?type=design&node-id=36-307&mode=design&t=sAnv6Hgp6SzriN7g-4)

- `TaskItem` should render a `UserTag` to show who is assigned to the task.

### Walkthrough

1. Add a `UserTag` within the `TaskItem` component. Pass in the task's assignee as the user prop.
2. Add styling for the `UserTag` to give it a fixed width. If you added a `className` prop to `UserTag`, you can pass down styles to it just like with any built-in element. If not, it might be easiest to wrap the `UserTag` in another `<div>`.
   1. You can pick a reasonable width, such as 12rem (192px).
   2. Be sure the `UserTag` sticks to the right side of the `TaskItem` too. The `TaskItem` CSS we wrote earlier should make this happen already, but you might still have to fix something.
3. Check the Home page to verify that `UserTag`s are displayed correctly.

## Update to component: `TaskForm`

### Specification

[Link to updated `TaskForm` component in Figma](https://www.figma.com/file/8eRDNyOrYRgyN7NNb0mIXA/Onboarding-Todo-App?type=design&node-id=38-620&mode=design&t=sAnv6Hgp6SzriN7g-4)

- The `TaskForm` should have another text field for the optional assignee ID.
- In `"edit"` mode, the `TaskForm` should call `updateTask` instead of `createTask`. It does not need to reset itself after submitting in this mode.

### Walkthrough

1. In the `TaskForm` component, add a `TextField` for the assignee and move the Save button next to it. You'll have to add a new row for these components in the JSX and another state variable like `title` and `description`.
2. Update the `handleSubmit` function to call `createTask` if `mode` is `"create"` and `updateTask` if `mode` is `"edit"`. For `updateTask`, make sure you include all Task fields, not just those visible in the form. Remember to call `onSubmit` as well if the request succeeds.
3. Since we're changing the functionality of this component, we should update its tests too. Skim through `TaskForm.test.tsx` if you haven't already to see how we use Vitest and React Testing Library to test a frontend component. It's okay if you don't understand everything, because the main focus in software development is getting the actual features done—but it's useful to write tests when you can.

   For this guide, you don't need to add any new tests. However, an existing test will now fail because we added a call to a new function, `updateTask`, without providing a "mock" version of that function to Vitest. Write a new mock for `updateTask` in the `vi.mock()` call (you can basically just copy the code for `createTask`). Then, update the third test (`"calls submit handler with edited fields"`) to use the correct mock, since we now expect the component to call `updateTask` instead of `createTask` when it's in `"edit"` mode.

   You can run the tests locally with the terminal command `npm run test`. You should also be able to see the test results on GitHub when you commit and push your changes.

## Update to page: `TaskDetail`

### Specification

[Link to updated `TaskDetail` page in Figma](https://www.figma.com/file/8eRDNyOrYRgyN7NNb0mIXA/Onboarding-Todo-App?type=design&node-id=38-575&mode=design&t=sAnv6Hgp6SzriN7g-4)

- Show a `UserTag` for the task's assignee.
- When "Edit task" is clicked, display the `TaskForm` component in edit mode with the data from this task.
- When the `TaskForm` is submitted, display the task information view again with the updated task data.

### Walkthrough

1. In the `TaskDetail` page component, import `UserTag` and use it to display the assignee.
2. Add another state variable `isEditing` which will store a boolean indicating whether the `TaskForm` is open.
3. Set `isEditing` to true when the "Edit task" button is clicked.
4. When `isEditing` is true, display a `TaskForm` in edit mode prefilled with this task's data; otherwise, display the task information as we just implemented. Upon submission of the `TaskForm`, change `isEditing` back to false and set the `task` state variable to the updated task in the callback.
5. Test your changes by opening the `TaskDetail` page, clicking "Edit task," changing the values, and clicking Save. You can copy and paste user IDs from mongosh. Try this for multiple different tasks and try some special cases: empty form fields, a task ID instead of a user ID, a nonexistent ID, no change in the form, etc.
   <details>
   <summary><strong>🤔 For new developers: Thinking about the user experience</strong></summary>

   _Pasting user IDs manually isn't a great user experience. In a real project, we could use some kind of dropdown selection menu, possibly with a search bar to filter by name. Can you think of other ways to design this interaction?_
   </details>

## Commit to Git

Remember to add, commit, and push your changes!

| Previous                                                    | Up           | Next                                              |
| ----------------------------------------------------------- | ------------ | ------------------------------------------------- |
| [2.2. Implement the task detail page](./2-2-Task-detail.md) | [Part 2](./) | [2.4. Make a pull request](./2-4-Pull-request.md) |
