# 0.1. Set up accounts

## Create a Figma account

Follow the steps below to create a Figma account if you don't already have one. You'll need to sign in to access certain tools for this repo's designs and for your future TSE projects.

1. Go to the [Figma website](https://www.figma.com) and click "Get started."
2. Create an account. You can use the "Continue with Google" option with your UCSD email account.
3. Optionally, [download the Figma desktop app](https://www.figma.com/downloads/) for macOS or Windows. Figma works pretty well in the browser, but it tends to be memory-intensive, so you might find the desktop app easier on your CPU.

## Add SSH keys to your GitHub account

If you haven't already set up your GitHub account to use SSH or a personal access token, you'll need to follow the steps linked below in order to have access to repositories on GitHub.

**SSH** (secure shell) is a way to securely communicate with other computers, including GitHub's servers, across the Internet. GitHub now recommends using SSH for accessing its services from the command line. You only need to set up SSH once on your computer.

1. [Check for any existing SSH keys on your computer.](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys)
2. [Generate a new SSH key if needed, and add it to your system's SSH agent if you want.](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
3. [Add the SSH key to your GitHub account.](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

<details>
<summary><strong>🤔 For new developers: Personal access token alternative</strong></summary>

_Alternatively, you can also [create a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens). You'll have to paste it every time you push to GitHub, which is why SSH is usually easier for local development. Tokens may be more suitable for cases like doing programming assignments on UCSD machines._

</details>

| Previous                                       | Up           | Next                                                  |
| ---------------------------------------------- | ------------ | ----------------------------------------------------- |
| [Part 0.0. Install software](./0-0-Install.md) | [Part 0](./) | [Part 0.2. Clone and run the project](./0-2-Clone.md) |
