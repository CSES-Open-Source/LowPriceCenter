# 0.3. Explore the designs and code

## Explore the Figma designs

Before we look more closely at the code, let's check out the Figma designs for this todo app. As a developer, you'll need to know the basics of navigating Figma projects and translating designs into code. Follow the steps below to familiarize yourself with Figma, and feel free to explore further!

1. Open the [Onboarding Todo App Figma project](https://www.figma.com/file/8eRDNyOrYRgyN7NNb0mIXA/Onboarding-Todo-App).
2. If you're not signed in already, click "Log in" in the top right corner. Once you're signed in, you should see "View only" in the center of the top bar.
3. **Move the viewport:** Scroll or middle-click and drag to pan around. Pinch (trackpad) or scroll while holding `Ctrl` to zoom in and out.
4. **Select an element:** Click on an element in the main viewport or left sidebar to select it.
   1. Generally, Figma only lets you select an element if its parent (such as a frame or group) is currently selected, which can be unwieldy for deeply nested elements. To **select an element directly,** right-click on it in the viewport and choose "Select layer," then choose the element you want to select.
5. **Navigator panel:** The left sidebar has two sections: a page selector and a tree navigator.
   1. You should start out on the "Part 1" page, which contains all the designs we need for Part 1. Click on "Part 2" to view the Part 2 designs.
   2. In the tree navigator, you can click on an element to highlight it in the main viewport or click on the triangle next to it to show/hide its children.
6. **Properties and Export panels:** The right sidebar has three tabs at the top: Comment, Properties, and Export. We generally don't need to add comments as developers, so click on one of the other two tabs to see those panels.

   1. **Properties:** This panel shows style information from the currently selected element. If no element is selected, it shows a list of preset text and color styles which the designers have chosen.
      <details>
      <summary><strong>❓ Hint: Style values</strong></summary>

      _As of writing, in view-only mode this list doesn't actually tell you anything about the style values (color, font size, etc.), so to see those, you can either look at the properties of individual elements or ask your designers to write out all the values somewhere. For this todo app, all colors and font styles are defined already in the frontend starter code (see below), so you'll just need to match them to things in the Figma designs._
      </details>

   2. **Export:** This panel allows you to export any element as an image. We'll use this while developing the todo app, and it's likely that your future TSE projects will also have some custom icons or graphics which you'll want to export. Follow the steps below to export an element.
      1. Select the element.
      2. In the Export panel, click the + next to the element you want to export.
      3. Choose a file type (PNG, JPG, SVG, or PDF). SVG is the best in most cases because it can display at any size.
      4. Click Export.

## Explore the repository contents

Finally, let's examine the structure of the project and some important files. Here we stay specific to MERN, but you'll see similar patterns across projects inside and outside of TSE, even those that use other tech stacks. Most of the files also have comments explaining what each part of the code does in greater detail—we encourage you to read through those as well.

As we've seen, the repo has two main folders: `backend` and `frontend`. Note that this is just one way to organize a full-stack project. Some projects place the frontend code inside the backend directory, structure the backend route handlers differently, place frontend style and test files in their own folders, etc. It doesn't really matter what convention you follow, as long as you stay consistent within each project.

In a deployed project, the frontend and backend are often hosted on their own servers with their own Node environments. During development, we simulate this by placing them in separate directories and running each Node environment on different ports.

### Backend files

- [`package.json`](/backend/package.json) **marks this folder as a Node package** and provides information so Node knows how to run the code. As a JSON file, it's formatted as a set of `"key": <value>` pairs. Most of the keys would only be relevant if we were publishing this as a library on NPM, so we'll just cover the ones that are important for us as developers. ([`package.json` documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json))
  <details>
  <summary><strong>Contents of package.json</strong></summary>

  - `dependencies`: Set of **packages that we use** in our own code and the allowed version numbers. NPM refers to this when it installs dependencies (`npm install`), and it automatically updates it when we add another package (`npm install <package>`). See the [`package.json dependencies` docs](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#dependencies) for more info about the syntax.
  - `devDependencies`: Set of **packages that we use only during development** (such as testing frameworks and documentation generators) and the allowed version numbers. If you run `npm install --save-dev <package>`, it adds the package to `devDependencies`. There's not really a difference between `dependencies` and `devDependencies`, except if we publish the package to NPM and someone else uses it. So, we recommend just adding packages to `dependencies` unless there's a special reason to use `devDependencies`. See the [`package.json devDependencies` docs](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#devdependencies) for more info.
  - `scripts`: Set of **scripts we can run** with `npm run <script-name>`. We can write arbitrary commands for Node to run as part of each script. For example, the `lint-check` script is from our [linting repo](https://github.com/TritonSE/linters) and runs ESLint to scan our code for inconsistencies. Some special scripts run at preset times—for example, `prepare` runs automatically after every `npm install`, and `start` runs when we run `npm start`. See the [NPM scripts docs](https://docs.npmjs.com/cli/v10/using-npm/scripts) for more info.
  - `_moduleAliases`: Map of **module aliases** to the corresponding file paths. We use this so we can write simpler import paths (such as "src/foo" instead of "../../src/foo"). This is custom behavior provided by the [module-alias package](https://www.npmjs.com/package/module-alias).
  </details>

- [`package-lock.json`](/backend/package-lock.json) **keeps track of the version of each dependency** which was last installed. This file is often quite large, and npm automatically updates it so there's generally no need to edit it manually. However, it's still very important to **include it in Git** because it ensures that different developers are using the same packages, thus avoiding conflicts.
- `node_modules` **contains the code from all our dependencies.** This folder is also often very large, and you generally won't need to look at anything inside it. Since `package.json` and `package-lock.json` have all the information that NPM needs to keep track of dependencies, we usually have Git ignore the `node_modules` folder.
- [`src/server.ts`](/backend/src/server.ts) is the **entry point** of our backend code, meaning Node runs this file first. In this file, we connect Mongoose to our MongoDB instance and start up our Express middleware.
- [`src/app.ts`](/backend/src/app.ts) **configures Express** to call our request handling code and sets up a generic error handler.
- [`src/models`](/backend/src/models/) stores the **Mongoose schemata** (plural of schema) that we use in our database. In general, a **schema** defines the expected "shape" of an object, including its field names and their data types. The starter code only has one type of object, a Task, whose schema you can find in `src/models/task.ts`.
- [`src/routes`](/backend/src/routes/) contains our **Express route definitions.** Each **route** is a specific path where the frontend can send an HTTP request to trigger the corresponding handler.
- [`src/validators`](/backend/src/validators/) contains our server-side **validation logic.** These validators check each request to ensure that its data have the correct format before any other route handling logic runs. If the format is correct, then the data get passed along to the route handler; if not, then it redirects to an error handler.
- [`src/controllers`](/backend/src/controllers/) contains the **request handler** (a.k.a. route handler) code. This is where the real business logic happens on the backend.

<details>
<summary><strong>🤔 For new developers: How Express runs this code</strong></summary>
<em>

Let's trace the code path from `src/server.ts` to `src/controllers/task.ts` to understand how Express runs this code.

1. In `server.ts`, we call `app.listen()` with two arguments: the port number and a callback function to run once Express has successfully initialized. `app` is imported from `app.ts`.
2. In `app.ts`, we set up Express by calling `const app = express()`, then we call `app.use("/api/task, taskRoutes")`. The latter tells Express that for any HTTP request whose path starts with `/api/task`, the handler code is in `taskRoutes`, imported from `routes/task.ts`.
3. In `routes/task.ts`, we create an `express.Router` to handle those `/api/task` routes. Each handler specifies a route suffix and one or more functions to call when handling requests on that route. Those functions come from `controllers/task.ts` and `validators/task.ts`.
   1. `router.get("/:id", TaskController.getTask)` handles requests to `GET /api/task/:id` (where `:id` is the ID of a Task object) by calling the `getTask` controller. The `router.delete` call works very similarly.
   2. `router.post("/", TaskValidator.createTask, TaskController.createTask)` handles requests to `POST /api/task` by calling the `createTask` validator and controller.
4. As we said above, the functions in `validators/task.ts` check that a Task object in a request has the correct fields and data types.
5. The functions in `controllers/task.ts` interact with the database, such as by creating new documents with the Task schema. That schema is imported from `models/task.ts`.
6. In `models/task.ts`, we define a Task object to have a required string `title`, optional string `description`, optional boolean `isChecked`, and required Date `dateCreated`. MongoDB will automatically give each object its own [unique ID](https://www.mongodb.com/docs/manual/reference/bson-types/#std-label-objectid) in a field called `_id`.

</em>
</details>

### Frontend files

- [`package.json`](/frontend/package.json), like the one in the backend folder, **denotes a Node package.** Similarly, we also have a `package-lock.json` file and a `node_modules` folder.
- [`index.html`](/frontend/index.html) contains the actual HTML document **where React injects all of its generated HTML** in the browser. Since we write all our pages and components in React, this is the only HTML file needed in the entire project. The file itself was generated by Vite, and we added some extra code to download the Rubik font from Google Fonts and tell the browser where the site favicon is located.
- [`src/main.tsx`](/frontend/src/main.tsx) is our **frontend's entry point.** It tells React where to inject our content in `index.html` and renders the `App` component from `src/App.tsx`.
- [`src/App.tsx`](/frontend/src/App.tsx) is the **root of our React application** code, where we set up `react-router` with our frontend pages. Note that the "routes" in this file are different from our backend API routes—here, we map each page to its own URL for the purpose of client-side routing. In general, the only other code in `App.tsx` should be things that we want to make available to all parts of the application.
- [`src/pages`](/frontend/src/pages/) stores the **pages of our frontend.** We currently have two pages: Home and About. The Home page displays a form for creating new tasks, while the About page contains some simple text (mainly to demonstrate how to link to another page).
  <details>
  <summary><strong>✅ Good practice: Unique page URLs</strong></summary>

  _Now that the industry has more advanced frontend technologies like React instead of raw HTML/CSS, the concept of a website "page" is a little more fluid than before. For instance, one React JavaScript file can dynamically render multiple different pages under the same URL. We still recommend mapping pages and URLs one-to-one for the purpose of keeping certain functionalities, like bookmarking pages._
  </details>

- [`src/components`](/frontend/src/components/) contains code for our **React components.** Each **component** is a reusable element of the frontend, such as a button, popup, or search bar. We write our components in [JSX](https://react.dev/learn/writing-markup-with-jsx), which is an extended, React-specific version of JavaScript/TypeScript that allows us to write HTML-like code directly in our JS/TS files.
  <details>
  <summary><strong>🤔 For new developers: Components and modularity</strong></summary>

  _The idea of components isn't unique to React, but it's definitely one of its defining characteristics. By writing different parts of our frontend into components, we make them more **modular**—easier to think about, reuse, and extend. Also, the "pages" of our application are technically React components too, but it's more helpful to separate them as a different type of abstraction._
  </details>

  <details>
  <summary><strong>Contents of src/components</strong></summary>

  - `Button` and `TextField` are the smallest and most reusable components. Because we'd expect these kinds of elements to be used in a lot of different ways, they are written generically, with lots of options. See the Figma file for illustrations of each component's variations.
  - `HeaderBar` is also a small component, but because we know it will only be used in one way (at the top of every page), we don't need to add any options.
  - `TaskForm` is the task creation form that you see on the Home page. It uses both `Button` and `TextField`. Note that this component contains both rendering logic (what gets displayed to the user) and some business logic (performing some operations when the user clicks Save). This is common in medium-to-large components—as the size of the component increases, so does the amount of logic it encapsulates.
  - The **CSS files** (ending in `.css`) in this folder provide styles to our components, including colors, fonts, borders, positioning, etc. We actually use CSS Modules (hence the `.module.css`; automatically enabled with CRA) so that the styles in each file only get applied to components that specifically import those styles.
  - The **test files** (ending in `.test.tsx`) in this folder define automated unit tests for each component, which are helpful for preventing regressions (unintentionally breaking things when we make changes). We use [Vitest](https://vitest.dev/guide/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) to run these tests. There is only one test file in the starter code, `TaskForm.test.tsx`, because that's the only component with enough complexity to merit testing. In TSE, we generally encourage automated testing of medium-complexity components and helper functions, including on the backend if worthwhile.
  </details>

- [`src/api`](/frontend/src/api/) contains our **frontend API client**—a set of helper functions that send HTTP requests to our backend routes, which we discussed above, and parse the responses. No frontend page or component should send any HTTP requests directly; instead, they should call these functions. We recommend gathering all the API request code in one place like this to make it easier to understand and maintain.
- [`src/globals.css`](/frontend/src/globals.css) contains the application's **global styles.** This includes things like app colors and fonts, common text styles, and other styles that we want to apply to everything in the application. We can also override these styles with more specific CSS Modules stylesheets.

With that massive exposition dump over, take a deep breath. You made it, now let's start coding!

| Previous                                         | Up           | Next                                         |
| ------------------------------------------------ | ------------ | -------------------------------------------- |
| [0.2. Clone and run the project](./0-2-Clone.md) | [Part 0](./) | [Part 1. Minimum viable product](../part-1/) |
