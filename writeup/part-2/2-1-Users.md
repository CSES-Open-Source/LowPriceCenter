# 2.1. Add User objects

Let's add a simple "user account" system so we can implement task assignments later. This will be an extremely basic user implementation for the purpose of this guide.

## New schema: `User`

### Specification

The `User` schema should have the following fields:

- `name`: string, required
- `profilePictureURL`: string, optional

**Note:** In a real application, we would probably want some kind of image- or file-hosting service to store user profile pictures (such as Firebase Cloud Storage or AWS S3). For this guide, we'll just directly paste URLs when creating users.

### Walkthrough

1. Create a new file `backend/src/models/user.ts`.
2. Use `models/task.ts` as a guide to define and export the new `User` schema with Mongoose.
3. Create a new file `frontend/src/api/users.ts`.
4. Use `api/tasks.ts` as a guide to define and export a `User` interface matching the `User` schema. (Remember to include the `_id` field.)
   1. Since User objects are simple enough to be directly encoded as JSON, we don't need to define a separate `UserJSON` interface and `parseUser` function.

## New API route: `POST /api/user`

### Specification

Creates a new User object in the database with the fields provided in the request body, then returns the new User. If the request body doesn't contain valid User data, returns a 400 error.

**Example request:**

`POST /api/user`

```json
{
  "name": "John Doe",
  "profilePictureURL": null
}
```

**Example response:**

201

```json
{
  "_id": "64ebc766fa1e11e2d987a8e9",
  "name": "John Doe",
  "profilePictureURL": null
}
```

### Walkthrough

1. Create a new file `backend/src/controllers/user.ts`.
2. Use `createTask` from `controllers/task.ts` as a guide to define a new Express request handler `createUser`.
   ```typescript
   export const createUser: RequestHandler = async (req, res, next) => {
     // ...
   };
   ```
3. Create a new file `backend/src/validators/user.ts`.
4. Use `createTask` from `validators/task.ts` as a guide to define a new `express-validator` validation chain.
   ```typescript
   export const createUser = [
     // ...
   ];
   ```
5. Create a new file `backend/src/routes/user.ts`.
6. Use `routes/task.ts` as a guide to define and export a new Express router for user-related requests.
7. Modify `backend/src/app.ts` to import and use the router you just created to handle routes starting with `"/api/user"`.
8. Test your implementation by using Postman or running the following command a few times with different values:

   ```shell
   curl -X "POST" http://127.0.0.1:3001/api/user \
     -H "Content-Type: application/json" \
     -d '{"name":"<Some name>","profilePictureURL":"<Some URL to an image>"}'
   ```

   Feel free to use the example profile pictures that we've provided in the `frontend/public` folder. The URLs for these would be, for example, `/profile1.png` (including the leading slash).

   You should be able to see your new users in mongosh:

   ```
   use todoList
   db.users.find()
   ```

**Note:** We won't implement user creation in the frontend, so there's no need for an API client function in `frontend/src/api/users.ts` which corresponds to this route.

## New API route: `GET /api/user/:id`

### Specification

Returns the User object with the provided ID. If no such User exists in the database, returns a 404 error.

**Example request:**

`GET /api/user/64ebc766fa1e11e2d987a8e9`

**Example response:**

200

```json
{
  "_id": "64ebc766fa1e11e2d987a8e9",
  "name": "John Doe",
  "profilePictureURL": null
}
```

### Walkthrough

1. In `backend/src/controllers/user.ts`, add another request handler `getUser`. Use `getTask` from `controllers/task.ts` as a guide.
2. Add the new route to `src/routes/user.ts`.
3. Test your implementation by using Postman or running the following command with some different IDs:
   ```shell
   curl http://127.0.0.1:3001/api/user/<id>
   ```
   Try a couple User IDs that you got from mongosh, as well as some Task IDs and some nonexistent IDs.
4. In `frontend/src/api/users.ts`, add an API client function that makes requests to this route. Use `getTask` from `api/tasks.ts` as a guide.

## Update to schema: `Task`

### Specification

The `Task` schema should have the following additional fields:

- `assignee`: ObjectId, optional, ref to a Task document
  - For simplicity, validation of this field is not necessary. That is, we don't need to check whether it's a valid ID of an existing User object.

### Walkthrough

1. In `backend/src/models/task.ts`, update the `Task` schema with the new `assignee` field. Be sure to use the [ObjectId type](https://mongoosejs.com/docs/schematypes.html#objectids) from Mongoose and make it a [`ref`](https://mongoosejs.com/docs/populate.html) to the `'User'` schema.
2. Update all API routes that return a Task object to [populate](https://mongoosejs.com/docs/populate.html#population) the `assignee` field with the corresponding User object. This means Mongoose will automatically replace the ID with the actual object in the return value, or null if it doesn't exist. You should update `getTask`, `createTask`, `updateTask`, and `getAllTasks` in `backend/src/controllers`.

   1. For `createTask`, you may need to run a query for the newly created Task so you can populate it.
   <details>
   <summary><strong>🤔 For new developers: Populating objects</strong></summary>

   _Populating sub-objects isn't always necessary; it depends on your specific needs for each API route. In our case, User objects are very small, so it's convenient to just always include the assigned User within a Task—then we won't need to send a separate request to retrieve the User itself._
   </details>

3. In `frontend/src/api/tasks.ts`, add the following field to both the `Task` and `TaskJSON` interfaces:
   ```typescript
   assignee?: User;
   ```
   where `User` is imported from `api/users.ts`.
4. In the same file, add the following field to `CreateTaskRequest` and `UpdateTaskRequest`:
   ```typescript
   assignee?: string;
   ```
   This is a string instead of a `User` because we only want to send the ID, not the entire User object.
5. Update the `parseTask` function to include the assignee.

<details open>
<summary><strong>⚠️ Caution: Updating validators</strong></summary>

_If we did want to validate the `assignee` field, we would have to update `backend/src/validators/task.ts` as well. Don't forget to do this in your real projects!_

</details>

## Commit to Git

Remember to add, commit, and push your changes!

| Previous                                         | Up           | Next                                                        |
| ------------------------------------------------ | ------------ | ----------------------------------------------------------- |
| [2.0. Prepare for development](./2-0-Prepare.md) | [Part 2](./) | [2.2. Implement the task detail page](./2-2-Task-detail.md) |
