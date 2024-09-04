# 1.2. Implement task checkoff

Next, we'll add the ability to mark and unmark tasks as done.

## New API route: `PUT /api/task/:id`

### Specification

Updates an existing Task by replacing all of its fields with the data from the request body, then returns the updated Task. If no Task exists with the ID in the URL, returns a 404 error. If the ID in the request body doesn't match the ID in the URL or the request body is not a valid Task, returns a 400 error. These errors can be checked in any order.

**Example Task in database:**

```json
{
  "_id": "64ebc766fa1e11e2d987a8e9",
  "title": "Part 1.2 backend",
  "description": "Implement the PUT /api/task/:id route",
  "isChecked": false,
  "dateCreated": "2023-09-02T01:49:32.621Z"
}
```

**Example request:**

`PUT /api/task/64ebc766fa1e11e2d987a8e9`

```json
{
  "_id": "64ebc766fa1e11e2d987a8e9",
  "title": "Part 1.2 backend update",
  "description": "Implement the PUT /api/task/:id route update",
  "isChecked": true,
  "dateCreated": "2023-09-02T01:49:32.621Z"
}
```

**Example response:**

200

```json
{
  "_id": "64ebc766fa1e11e2d987a8e9",
  "title": "Part 1.2 backend update",
  "description": "Implement the PUT /api/task/:id route update",
  "isChecked": true,
  "dateCreated": "2023-09-02T01:49:32.621Z"
}
```

<details>
<summary><strong>🤔 For new developers: POST and PUT</strong></summary>

_Note that we use `POST` requests to create Tasks and `PUT` requests to update them. This isn't strictly necessary (we could, say, use `POST` for everything), but it's a standard industry practice because it follows the original HTTP specification more closely. The main difference between the two methods is "[idempotence](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)"—`PUT` actions are expected to be idempotent, while `POST` actions are not._

</details>

<details>
<summary><strong>✅ Good practice: Limit user-modifiable fields</strong></summary>

_Here we just replace the entire Task object with the provided data, even the `dateCreated` field. We do this for simplicity, but in a real project, it might be advisable to limit which fields can be modified by a user request._

</details>

### Walkthrough

1. Copy the skeleton code below into `backend/src/controllers/task.ts`.
   ```typescript
   export const updateTask: RequestHandler = async (req, res, next) => {
     // your code here
     try {
       // your code here
     } catch (error) {
       next(error);
     }
   };
   ```
2. Use the `validationResult` and `validationErrorParser` functions to validate the request body. See the `createTask` function in the same file for an example. `validationErrorParser` will stop the request and generate a 400 response by itself if the request body doesn't contain valid Task data.
3. Compare the `:id` from the request URL (`req.params.id`; see `getTask` for an example) with the `_id` in the request body (`req.body._id`). If they're not equal, return a 400 response (just call `res.status(400);`).
4. Use the [`Model.findByIdAndUpdate()`](<https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()>) Mongoose function to update the Task in the database with the given ID. (Actually, there are several functions you can use; any approach that works is valid.)
   1. Remember to `await` the returned `Query`.
   2. If the returned `Query` gives us null, then there was no object in the database with that ID. In that case, return a 404 response.
   3. Otherwise, return a 200 response containing the updated Task. The result of `findByIdAndUpdate` is the original Task, so you should execute a new query like in `getTask`.
5. Add the new route to `src/routes/task.ts`. Similar to `createTask`, use the `updateTask` validation chain provided in `src/validators/task.ts`.
6. Test your implementation. Make sure your backend is running locally, then call the new route through Postman or run the following command with your own values filled in:
   ```shell
   curl -X "PUT" http://127.0.0.1:3001/api/task/<paste a Task ID from your database here> \
     -H "Content-Type: application/json" \
     -d '{"_id":"<the same ID>","title":"<Your title>","description":"<Your description>","isChecked":false,"dateCreated":"2023-10-01T00:00Z"}'
   ```
   You should see the Task updated with its new data when you list all Tasks in mongosh and when you view the frontend Home page.
7. Copy the skeleton code below into `frontend/src/api/tasks.ts`:
   ```typescript
   export async function updateTask(task: UpdateTaskRequest): Promise<APIResult<Task>> {
     try {
       // your code here
     } catch (error) {
       return handleAPIError(error);
     }
   }
   ```
8. Using the existing functions as guides, complete the implementation of `updateTask`.

## Update to component: `TaskItem`

### Specification

- When the user presses the `CheckButton`, call the `updateTask` function to flip the value of `isChecked` for this `TaskItem`'s `Task` object.
- Re-render the `TaskItem` when `updateTask` resolves to the updated `Task`.
  - If an error occurs, then just `alert()` the user.
- Prevent the user from pressing the `CheckButton` again until `updateTask` has resolved (this will require at least one additional state variable).

### Walkthrough

1. In `frontend/src/components/TaskItem.tsx`, add new state variables `task` and `isLoading` and a helper function `handleToggleCheck`:

   ```tsx
   import React, { useState } from "react"; // update this line
   // ...
   export function TaskItem({ task: initialTask }: TaskItemProps) {
     // update the previous line and add the following
     const [task, setTask] = useState<Task>(initialTask);
     const [isLoading, setLoading] = useState<boolean>(false);

     const handleToggleCheck = () => {
       // your code here
     };

     // ...
   }
   ```

2. Within `handleToggleCheck`, set `isLoading` to true (by calling `setLoading`—never assign directly to a state variable, because React will ignore it), then call the `updateTask` function (be sure to import it from `src/api/tasks`). Pass in the `task` state variable, with the value of `isChecked` flipped.
   <details>
   <summary><strong>🤔 For new developers: Spread syntax</strong></summary>

   _An easy way to do this is to use JavaScript's [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals). You can write something like `{ ...task, isChecked: !task.isChecked }`. This is preferable because it's concise and it creates a (shallow) copy of `task`; we shouldn't modify `task` or any other props directly because that might cause unintended side effects._
   </details>

3. When `updateTask` resolves, call `setTask` with the new task from the response (or `alert()` the user again if it failed) and set `isLoading` back to false. See the `handleSubmit` function in `components/TaskForm.tsx` for an example of how to handle the result of a request (the request is `createTask` in that case).
   <details>
   <summary><strong>🤔 For new developers: await or async</strong></summary>

   _If you make `handleToggleCheck` an `async` function, you can use `await` syntax instead of `then()`. There's no real difference here, so it's up to preference. Just stay consistent and don't mix the two syntaxes together._
   </details>
   <details>
   <summary><strong>❓ Hint: Where to call setLoading</strong></summary>

   _Make sure you call `setLoading(false)` **inside** the `.then()` block. If it's outside, then it will run immediately instead of after the response-handling code finishes._
   </details>

4. Pass two props to the `CheckButton`: `onPress` and `disabled`. We want `handleToggleCheck` to be called when the `CheckButton` is pressed, and we want the `CheckButton` to be disabled when `isLoading` is true.
   <details>
   <summary><strong>✅ Good practice: Organize helper functions together</strong></summary>

   _We could write the `onPress` handler function directly inside the JSX instead of storing it in a named variable. However, we'd recommend only doing that for super simple, one-line functions. Otherwise, it's generally a good practice to organize nontrivial helper functions like `handleToggleCheck` separately from our rendering code, to make them easier to find._
   </details>

5. Test your changes by checking and unchecking some tasks on the Home page. Make sure that each `TaskItem` updates its text color correctly and that after clicking the `CheckButton`, you can't click it again until the `TaskItem` has updated. To be extra sure, you can verify that the value of `isChecked` changes in mongosh. Also make sure it works as expected when you shut down your local backend (to simulate network unavailability).

## Commit to Git

Follow the same process as in [Part 1.1](./1-1-Task-list.md): stage your changes using `git add`, commit them using `git commit` with a descriptive message, and push them using `git push`.

| Previous                                           | Up           | Next                                              |
| -------------------------------------------------- | ------------ | ------------------------------------------------- |
| [1.1. Implement the task list](./1-1-Task-list.md) | [Part 1](./) | [1.3. Make a pull request](./1-3-Pull-request.md) |
