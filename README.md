# Low-Price Center

An e-commerce platform for UCSD students to exchange and sell goods.

## Description

Low-Price Center is designed to help UCSD students exchange and sell goods in a streamlined, centralized way. Instead of posting to Reddit or other similar websites, they'll have a more secure and organized place to buy and sell goods with each other on campus. It will also be a resource for student organizations to sell merchandise without having to build their own portals.

This project is a part of CSES Open-Source, and will transition to a full open-source project once there is an MVP. The current goal is to get a basic version of the site up and running so that it'll become easier to contribute to.

## Getting Started

<!-- ### Dependencies

- Describe any prerequisites, libraries, OS version, etc., needed before installing program.
- ex. Windows 10 -->

### Installing

- Install VSCode and the latest version of Node.js.
- Clone the repository to your own computer.
- In both frontend and backend folders, run `npm install`.
- Add the environmental variables (contact [@chase-of-the-fjords](https://github.com/chase-of-the-fjords) for these).

### Executing program

- Start two terminals.
- In the first terminal, cd into the backend folder and run `npm run start`.
- In the second terminal, cd into the frontend folder and run `npm run dev`.

### Additional Installations

- Download the Prettier extension in VSCode.
  - Set Prettier as the [default formatter](https://stackoverflow.com/questions/63954584/how-to-make-prettier-the-default-formatter-in-vs-code).
  - Set Prettier to [format on save](https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code#step-2-formatting-code-on-save).
- Download the Tailwind CSS IntelliSense extension in VSCode.
  - Add .\*Styles.\* to class attributes in settings.

## Branching Guidelines

When working on the project, aim to always branch from `dev` instead of `main`. This is where the currently development version will be stored.

Branches should be named with the `prefix/description` format (i.e. `feature/create-product`). Below are a list of the prefixes we'll be using:

- `feature`: Use for new features.
- `bugfix`: Use for bugfixes.
- `experiment`: Use for experiments - these will rarely be directly added to `dev`.
- `merge`: Should be used to merge branches that have messy conflicts before doing a PR into `dev`.

When you finish your work in a branch, create a PR into `dev` and request for review from [@chase-of-the-fjords](https://github.com/chase-of-the-fjords). Add a description of the changes made following the format provided.

## Help

If you're having errors with committing, run `npm run lint-fix` (Linting is currently disabled, so this shouldn't be an issue).

## Authors

Chase Peterson  
[@chase-of-the-fjords](https://github.com/chase-of-the-fjords)

## Version History

Version 0.0

- Created skeleton code in preparation for the kickoff of the project.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

- [awesome-readme](https://github.com/matiassingers/awesome-readme)
