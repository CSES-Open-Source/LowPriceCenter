# 1.1. Implement the task list

In the starter code, we already have the ability to create tasks, but there's no way for the user to see them after submitting the form. Let's add that feature now!

## New API route: `GET /api/tasks`

### Specification

Retrieves an array of all Tasks in the database, sorted by creation date in reverse chronological order (most recent first). If there are no Tasks, the array is empty.

**Example request:**

`GET /api/tasks`

**Example response:**

200

```json
{
  "tasks": [
    {
      "_id": "64ebc7a5fa1e11e2d987a8eb",
      "title": "Task 2",
      "description": "This is another task",
      "isChecked": false,
      "dateCreated": "2023-08-27T22:01:09.704Z",
      "__v": 0
    },
    {
      "_id": "64f294ac0e688c8cf9dd199d",
      "title": "Task 1",
      "description": "This is a task",
      "isChecked": true,
      "dateCreated": "2023-08-27T22:00:06.488Z",
      "__v": 0
    }
  ]
}
```

<details>
<summary><strong>🤔 For new developers: More possibilities</strong></summary>

_In a real project, we could use a route like this to search and sort/filter Tasks. For example, we could add query parameters for searching titles and adjusting the sort order—something like `GET /api/tasks?search=user+input+string&order=asc`. Consider that as extra credit!_

</details>

### Walkthrough

1. In `backend/src/controllers`, create a new file `tasks.ts`.
2. Copy the skeleton code below into tasks.ts.

   ```typescript
   import { RequestHandler } from "express";
   import TaskModel from "src/models/task";

   export const getAllTasks: RequestHandler = async (req, res, next) => {
     try {
       // your code here
     } catch (error) {
       next(error);
     }
   };
   ```

3. Use the [`Model.find()`](<https://mongoosejs.com/docs/api/model.html#Model.find()>) and [`Query.prototype.sort()`](<https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()>) Mongoose functions to retrieve a sorted list of Tasks.
   1. `Model.find()` is a static function on the `Model` class, which our `TaskModel` extends. It returns a `Query` object. Refer to `getTask` in `controllers/task.ts` for an example of how to use the similar `findById()` function.
   2. `Query.prototype.sort()` is an instance function on the `Query` class (for JavaScript, when you see "prototype," that means it's an instance member). It returns the new `Query`. We want to sort by the `dateCreated` field in descending order, so that determines what we should pass in to `sort()`.
   3. Remember to `await` the `Query`.
4. Return a response with status code 200 and JSON body matching the format of the example above. Refer to `getTask` in `controllers/task.ts` for an example of how to return a response with Express.
5. In `backend/src/routes`, create a new file `tasks.ts` with the following contents:

   ```typescript
   import express from "express";
   import * as TasksController from "src/controllers/tasks";

   const router = express.Router();

   router.get("/", TasksController.getAllTasks);

   export default router;
   ```

   Similar to `routes/task.ts`, this creates a router which calls the function we just wrote.

6. In `src/app.ts`, add the following code:

   ```typescript
   import taskRoutes from "src/routes/task";
   import tasksRoutes from "src/routes/tasks"; // add this line

   // ...

   app.use("/api/task", taskRoutes);
   app.use("/api/tasks", tasksRoutes); // add this line
   ```

   Be careful to write "tasks" plural instead of singular. This tells Express to use the router we just created for any request that starts with `/api/tasks`.

7. Test your implementation. Make sure your backend is running locally and you've created at least three different Tasks, then call the new route through Postman or run the following command:
   ```shell
   curl http://127.0.0.1:3001/api/tasks
   ```
   You should see a list of your Task objects in order from latest to earliest creation date.
8. In `frontend/src/api/tasks.ts`, copy the skeleton code below to the bottom of the file:
   ```typescript
   export async function getAllTasks(): Promise<APIResult<Task[]>> {
     try {
       // your code here
     } catch (error) {
       return handleAPIError(error);
     }
   }
   ```
9. Using the existing `getTask` and `createTask` functions as guides, complete the implementation of `getAllTasks`. Be sure to process each individual element of the list from JSON into a `Task` object using `parseTask`.

## New component: `TaskItem`

### Specification

[Link to `TaskItem` component in Figma](https://www.figma.com/file/8eRDNyOrYRgyN7NNb0mIXA/Onboarding-Todo-App?type=design&node-id=18-209&mode=design&t=sAnv6Hgp6SzriN7g-4)

- Use the provided `CheckButton` component and global font styles. You can leave the `CheckButton` with no functionality for now; we'll implement that in [Part 1.2](./1-2-Task-checkoff.md).
- Since this component will be displayed as part of a `TaskList` (coming up next), it should receive a `Task` as a prop.

### Walkthrough

1. Study the `TaskItem` component in the Figma carefully. Note how its appearance varies according to two properties: whether there is a description and whether the task is checked.
2. In `frontend/src/components`, create two new files: `TaskItem.tsx` and `TaskItem.module.css`.
3. Copy the following skeleton code into `TaskItem.tsx`:

   ```tsx
   import React from "react";
   import type { Task } from "src/api/tasks";
   import { CheckButton } from "src/components";
   import styles from "src/components/TaskItem.module.css";

   export interface TaskItemProps {
     task: Task;
   }

   export function TaskItem({ task }: TaskItemProps) {
     return (
       <div>
         {/* render CheckButton here */}
         <div>
           <span>{/* render title here */}</span>
           {task.description && <span>{/* render description here */}</span>}
         </div>
       </div>
     );
   }
   ```

   As you can see, the `TaskItem` component only has one prop, which is of type `Task`. We don't need any other information to render the component.

4. For later convenience, add the following line to `frontend/src/components/index.ts`:

   ```typescript
   export { TaskItem } from "./TaskItem";
   ```

   This allows us to import `TaskItem` from `"src/components"` together with other components, instead of individually specifying `"src/components/TaskItem"`.

   <details>
   <summary><strong>✅ Good practice: No barrel files</strong></summary>

   _This `index.ts` file is known as a "barrel file." It's common to use these in order to simplify imports, but [Vite actually recommends against using them](https://vitejs.dev/guide/performance.html#avoid-barrel-files) for performance reasons. Maybe one day we'll get around to removing them from this repo._

   </details>

5. First, we'll complete the structure of this component. It's mostly done already in the skeleton code (using divs and spans), but we need to display the data from the task object.
   1. Fill in the placeholders to render `task.title` and `task.description`. Refer to `components/Button.tsx` for an example of how to render a string (the `label` variable in that case). Note that we use [JavaScript shortcutting to conditionally render](https://react.dev/learn/conditional-rendering#logical-and-operator-) the description.
   2. Fill in the placeholder to render a `CheckButton` component. Refer to `components/TaskForm.tsx` for an example of how to use other custom components (`TextField` and `Button` in that case). For now, just pass in the prop `checked={task.isChecked}`—the button won't do anything until [Part 1.2](./1-2-Task-checkoff.md).
6. Render a `TaskItem` on the Home page for testing purposes. We'll pass in a fake `Task` so we can see what the component looks like. In `frontend/src/pages/Home.tsx`, copy the following code under the line `<TaskForm mode="create" />`.
   ```tsx
   <TaskItem
     task={{
       _id: "foo123",
       title: "My title",
       description: "My description",
       isChecked: true,
       dateCreated: new Date(),
     }}
   />
   ```
   Also add `TaskItem` to the import from `"src/components"`.
7. Start the frontend if it's not already running and open http://localhost:5173. You should see a check mark, "My title", and "My description" somewhere on the page, although it won't look like the design yet.
8. Next, we'll implement styles for `TaskItem`. With CSS Modules, we add styles by writing a CSS class (such as `.exampleClass`) in `TaskItem.module.css`, then assigning it to a particular React element using the prop `className={styles.exampleClass}`. Refer to `components/TextField.tsx` and the corresponding `TextField.module.css` for an example.

There are many valid approaches to writing CSS—we'll use flexbox layout, which is highly versatile. Note that the `<div>`s in `TaskItem.tsx` correspond directly to the frame elements within a `TaskItem` in Figma.

1.  Copy the following CSS class for the **outermost** `<div>` into `TaskItem.module.css`, then add the corresponding `className` prop (`className={styles.item}`) to that `<div>` in `TaskItem.tsx`.

    ```css
    .item {
      height: 3rem;
      border-bottom: 1px solid var(--color-text-secondary);
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      column-gap: 0.25rem;
    }
    ```

    This sets the `<div>` to use flexbox layout, have its content axis in the row direction (so its children will be laid out side-by-side), center its children on the cross axis (so they will be vertically centered), and add a gap of 0.25rem (4px) between children. Refer to the [CSS-Tricks flexbox guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) or the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction) for more information on each property and its possible values.

2.  Add another CSS class for the **inner** `<div>`, which contains the title and description labels. It should be similar to the previous class, but we want the children to be laid out in the column direction (vertical), to be centered vertically, and to stretch out as much as possible horizontally. We also want the `<div>` itself to take up all remaining space in the parent `<div>` and to have a bottom border. You can copy and fill in the template below.

    ```css
    .textContainer {
      height: 100%;
      flex-grow: ???;
      display: flex;
      flex-direction: ???;
      justify-content: ???;
      align-items: ???;
      overflow: hidden;
    }

    .textContainer span {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ```

    Remember to add the new `className` prop in `TaskItem.tsx` as well.
    <details>
    <summary><strong>❓ Hint: Truncating overflowing text</strong></summary>

    _It can be surprisingly complicated to truncate overflowing text using only CSS. The `.textContainer span` styles in the above code block achieve this in combination with the `overflow: hidden;` on `.textContainer`. This may come in handy when implementing other components! (Credit to this [CSS-Tricks snippet](https://css-tricks.com/snippets/css/truncate-string-with-ellipsis/) and this particular [comment](https://css-tricks.com/snippets/css/truncate-string-with-ellipsis/#comment-1607839).)_
    </details>

3.  Add two more CSS classes, one for the title label and one for the description label. For both, you only need to set the font property using one of the app fonts in `globals.css`. The `TaskItem` title uses the label font and the description uses the body font. Here's CSS for the title:
    ```css
    .title {
      font: var(--font-label);
    }
    ```
    Follow the same pattern for the description label. Apply these classes to the corresponding `<span>` elements in `TaskItem.tsx`.
4.  Add one last CSS class which will adjust the appearance when the task is checked. Currently, all we need is to change the text color to --color-text-secondary.

    ```css
    .checked {
      color: var(--color-text-secondary);
    }
    ```

    Refactor the `className` on the text container `<div>` to work as follows: if `task.isChecked`, then use `styles.textContainer + " " + styles.checked`; else, use `styles.textContainer`. See `components/TextField.tsx` for one way to do this.

5.  View the temporary `TaskItem` on the Home page. It should look like the Figma design now, besides possibly the width. Edit the fake `Task` in `pages/Home.tsx` to test all 4 variations of the `TaskItem` (this is part of "manual testing"). If something still looks wrong and you can't figure out the problem, ping us in **#onboarding** on Slack.
6.  When you're done testing, remove the temporary `TaskItem` from the Home page. Be sure to remove it from the imports too.

## New component: `TaskList`

### Specification

[Link to `TaskList` component in Figma](https://www.figma.com/file/8eRDNyOrYRgyN7NNb0mIXA/Onboarding-Todo-App?type=design&node-id=19-358&mode=design&t=sAnv6Hgp6SzriN7g-4)

- Use the `getAllTasks` helper function from earlier to retrieve the list of all tasks on initial render.
- If there are no tasks, display a short message as shown in Figma. (This includes the case where an error prevents the request from succeeding.)

### Walkthrough

1. Study the `TaskList` on the Home page of the Figma designs. It simply contains a bunch of `TaskItem`s, or displays a short message if there are no tasks.
2. In `frontend/src/components`, create two new files: `TaskList.tsx` and `TaskList.module.css`.
3. Copy the following skeleton code into `TaskList.tsx`:

   ```tsx
   import React, { useEffect, useState } from "react";
   import { getAllTasks, type Task } from "src/api/tasks";
   import { TaskItem } from "src/components";
   import styles from "src/components/TaskList.module.css";

   export interface TaskListProps {
     title: string;
   }

   export function TaskList({ title }: TaskListProps) {
     const [tasks, setTasks] = useState<Task[]>([]);

     useEffect(() => {
       // your code here
     }, []);

     return (
       <div>
         <span>{/* render list title here */}</span>
         <div>
           {tasks.length === 0 ? (
             // your code here
           ) : tasks.map((task) => (
             // your code here
           ))}
         </div>
       </div>
     );
   }
   ```

   Note the following points about this code:

   1. We have a state variable called `tasks` whose type is `Task[]` (an array of `Task` objects). The initial value is an empty array.
   2. We have a `useEffect` hook which we'll fill out to fetch the list of `Tasks` from our backend and store it in the state.
   3. In the returned JSX, we use [conditional rendering with the ternary operator](https://react.dev/learn/conditional-rendering#conditional-ternary-operator--) to show something (message) if `tasks.length` is 0, and something else (the list of tasks) if not.

4. Add `TaskList` to the exports in `frontend/src/components/index.ts`:
   ```typescript
   export { TaskList } from "./TaskList";
   ```
5. Fill in the list title placeholder in the skeleton code. This should be similar to the title and description of `TaskItem`.
6. Fill in the case where `tasks` is empty (`tasks.length === 0`). You can just render a paragraph (`<p>...</p>`) and paste the empty list message from Figma.
7. Fill in the other case, where `tasks` is not empty. Here we want to [render a list](https://react.dev/learn/rendering-lists) of `TaskItem` components (we recommend that you skim the linked tutorial if you're new to React, because this pattern is very common). Use the `_id` of each task as the key.
8. Add `TaskList` to the Home page (`frontend/src/pages/Home.tsx`) with the title "All tasks". Verify that it shows up with the empty list message (since we haven't implemented retrieving the list from the backend yet).
9. Fill in the `useEffect` hook. We want to call the `getAllTasks` function that we wrote earlier (it's already been imported). If the request succeeds, use `setTasks()` to replace the `tasks` state variable with the newly retrieved array of `Tasks`. If it fails, use `alert()` to display the error. See the `handleSubmit` function in `components/TaskForm.tsx` for an example of how to handle the result of a request (the request is `createTask` in that case).
10. Add some CSS classes to `TaskList.module.css` and add the corresponding `className` props to `TaskList.tsx`.
    1. We need one class for the list title, which uses the heading font. This works similarly to the title and description classes from `TaskItem`.
    2. We need another class for the inner `<div>`, which is the item container. Use flexbox again to align its children: column direction, horizontally stretched. The item container itself should also have `width: 100%`.
    3. Finally, we need a class for the outermost list container `<div>`. This just needs a top margin of 3rem.
11. Check the Home page again. You should see all the Tasks that you've created so far, matching the Figma design. Submit some more through the "New task" form (making sure to test things like super long titles and descriptions) and refresh the page. The new Tasks should appear in the list. Again, if something's not working and you can't figure it out, ping us in **#onboarding** on Slack.

<details>
<summary><strong>✅ Good practice: List element instead of generic div</strong></summary>

_Since this component is a list of items, it would be better to use the actual unordered list and list item elements (`<ul>` and `<li>` respectively) instead of a bunch of nested `<div>`s. (Alternatively, we could use the ARIA `list` and `listitem` roles.) Doing so would help screen readers and other assistive software determine the purpose of these elements more easily. However, we would also have to override some default styling (such as removing the bullet points of each `<li>`), so we chose to avoid that in this guide for simplicity._

</details>

## Commit to Git

Once you have all of the above working correctly, follow the steps below to save your changes to GitHub.

1. In your command prompt, `cd` to your repository folder.
2. Run `git status` and check the output to make sure you're on your Part 1 branch. If not, run `git checkout part-1`. The output should also list all the files you've changed so far under "Changes not staged for commit."
3. Run `git add .` to "stage" all of the changes. (The `.` denotes everything in the current folder; you can also specify particular folders or files.) If you run `git status` again, you should see that your changes have become "Changes to be committed."
4. Run `git commit -m 'Implement part 1.1'` to commit your changes to the `part-1` branch locally. You can write your own commit message in between the quotes.
5. Wait for the pre-commit hook to finish. This uses a custom TSE script to check that all files are correctly formatted. If the pre-commit hook fails, read through the output and fix the problems, then run the `git commit` command again.
6. Run `git push` to push the current state of your branch to your remote fork. Since this is the first time you're pushing this branch, it will fail and give you another command to run instead. Paste that command and run it. In the future, on this branch, you can just run `git push`.
7. Open your fork in GitHub and click on the branch dropdown on the left. You should see a new branch called `part-1`. You'll probably also see a banner at the top of the page telling you that you have a new branch.

We'll follow this commit-and-push process every time we make changes. You can commit more often than you push—we suggest committing every time your code reaches a good working state (with descriptive commit messages!), and pushing when you're done for the day.

| Previous                                         | Up           | Next                                                   |
| ------------------------------------------------ | ------------ | ------------------------------------------------------ |
| [1.0. Prepare for development](./1-0-Prepare.md) | [Part 1](./) | [1.2. Implement task checkoff](./1-2-Task-checkoff.md) |
