# Comix Cleric Contributing Guide

> [!CAUTION]
> Contributions are not yet being accepted. Please watch this space for updates.

## Licensing Contibutions

It is to be understood that by contributing to this project, you <u>must</u> own the authorship rights to license any part of your contributed code under Apache 2.0. If you do not want to or cannot license your code under Apache 2.0, **do not submit contributions.**

Any code submitted to this codebase must not infringe on an existing patent or be a proprietary solution from another source. We also do not accept AI/LLM-generated submissions for the same purpose of lack clear licensing (we also just don't want it here).

---

## Preparing

This repo contains all required development packages. It requires the use of [Node.js](https://nodejs.org/en/) and [pnpm](https://pnpm.io/).

Comix Cleric is currently built using:
- Node.js (v22.14.0)
- PNPM (v10.6.3)

Node.js can be installed from [nodejs.org](https://nodejs.org/en/download). Download the installer for your operating system, and run it. NPM is included with Node.js and should be installed automatically.

You can [install pnpm](https://pnpm.io/installation) with:

```sh
npm i -g pnpm
```

`pnpm` commands run in the project's root directory. You can checkout the code and install the dependencies with:

```sh
git clone git@github.com:panelparty/comix-cleric.git
cd comix-cleric
pnpm i # or `pnpm install`
```

---

## Code structure

For all intents and purposes, this is a standard SvelteKit application and follows structures provided by the framework.

The main entry point for changes is the `src/` directory. This houses the entire main portion of the application.

Within the `src/`, you will find:
- `hooks/` - A set of functions for rate-limiting and CSRF.
- `lib/` - A library for assets like images, utility files, UI components, and API adapter code.
- `routes/` - All existing layouts and pages for the app.
- `app.css` - Global stylesheet for the app.
- `app.html` - Main app entry point (generally shouldn't be edited).
- `hooks.server.js` - Handles all server-side requests, scheduled post publishing, auth session persistence, etc.

## Good first issues

If you're looking for an issue to tackle to get familiar with the codebase and testing environment, check for issues marked "good first issue" or keep an eye out for more simple bugs and features in the open issues.

---

## Documentation changes

All documentation for Comix Cleric is in the [`comix-cleric-docs` repo](https://github.com/panelparty/comix-cleric-docs), and any improvements should be made as a Pull Request to that repository.

Our hub site is private for security reasons, so changes to documentation cannot be previewed at this time.

---

## Testing Changes

Local changes can be tested by running a development server and local database.

To start the development server, simply run `pnpm dev`. Once the server has started, you should be presented with a link to your local server, which you can ctrl + left-click on to open in your default browser.

By default, the configuration will use local data sources to support development in the for of `data/` and `uploads/` directories. If you need to connect to a different data source, such as a MongoDB database, please configure your `.env` file in the project root.

> Be warned: Connecting to a live database may cause irreversable data loss if care is not taken to ensure the original database is backed-up and that the you are willing to lose any data in fields you may be modifying.

### Testing/Reviewing PR Changes

If you'd like to test upcoming features implemented by other contributors for the sake of speeding things up, you can pull PR branches and check them out in your local environment.

Please do not make direct changes unless requested by the author.

Testing PRs is as simple as pulling the PR branch, reading over the intended feature or fix description, and checking for issues in functionality or visuals.

Checking can usually be done via:
- Visual inspection of the provided code for formatting errors or unwanted / out-of-scope functionality
    - Branches should typically seek to only add or change a single feature at a time.
    - However, this may require changes to other parts of the codebase, please use your best judgement.
- Temporary console logs or debug tools to verify data outputs
- Visual inspection for the features in the browser
- Resizing the browser to check for issues in responsive UI elements
- Checking a mobile device through a dev tunnel or temporary dev server

If a contributor fails to provide all code required for operation/testing of the PR, or their PR is just inoperable, notify a staff member or report it to the contributor yourself if you feel comfortable doing so.

### Production Testing

Comix Cleric must be rebuilt each time before running in production if you've made code changes. There is a `build` command for just such an occasion. Once the build has completed successfully, you can run `pnpm preview` to run the built files to make sure everything was appropriately compiled. Keep a close eye out for errors, missing elements, and unexpected shifts in layout.

#### Docker Testing

You can also test Docker builds locally by first building your app with the previous step, then running `docker compose up -d --build`. (Assuming you have Docker Desktop installed on your local system and have configured the cloned `dockerfile` and `compose.yml` files.)

---

## Sending PRs

When you open a PR, the [PR template](./.github/PULL_REQUEST_TEMPLATE.md) includes a checklist. Please read it carefully and **don't** delete it.

**Run tests locally before submitting.** At a minimum, run `pnpm preview` after building and visually ensure your work is functional.

### Coding style

There are a few guidelines we follow:
- All API-related variables are written in `snake_case` for consistency between code and database.
    - Internal variables should still follow `camelCase`.
    - Svelte components should still follow `PascalCase`.
- Keep all API calls on the server unless you are performing a client-side fetch to a secure server endpoint.
- A single new-line between nested siblings unless they share functional similarity.
- Comment as much as you can, but don't clutter functions with them.
    - A good rule-of-thumb is to define the majority of the comment above a function or group of variables.

```svelte
<!-- Svelte comment style example -->
<script>
  // Checks for errors
  // Accepts many values
  function errorCheck() {}
</script>

<!-- Renders errors -->
<div class="error-display"></div>

<!-- Triggers error check -->
<button onclick={()=>{checkError()}}>Run Error Check</button>

<style>
  /* Error display styles */
  .error-display {}
</style>
```

```js
// JavaScript comment style example
// -- This file contains functions and helpers for error checking -- //

// Checks for errors
// Accepts many values
function errorCheck() {}
```

---

## Generating changelogs

At this time, changelogs must be hand-crafted. At some time in the future, we may use a tool like `changeset` to generate them from

AI/LLM generated changelogs are not acceptable. No emojis, no em-dashes, no tell-tale signs of AI use, please. Even if you feel your written communication skills aren't great, outsourcing that to a machine doesn't help you or us because the AI is often entirely wrong and over-explains to the point of becoming just as difficult to understand. We encourage you to use your own words, even if you don't feel great about it. We will help with any grammatical errors, no judgement.

---

## Releases

The core development team will manually release new versions once relevant milestones have been reached.

> [!TIP]
> More details coming soon!
---

## Keep Contributions Within Project Scope

All code contributed to Comix Cleric must remain within project scope guidelines. Features too far outside the project scope will likely be rejected, but you can still submit your PRs.

> [!IMPORTANT]
> Remember: This app is not just about your wants, we have to make sure that it is serving its primary purpose first and foremost.

### Project Scope:

In the simplest terms, the scope of this project is to provide the highest quality experience for uploading and reading webcomics within a simple, self-contained app. There are a few additional features we implemented up front to lean a bit more into the portfolio side of things, but this project should mainly focus on supporting webcomic or literary projects made by human artists.

##### Examples:

###### Within Scope:

- Improved reader formatting
- Better audio playlist support for pages
- New media block types
- Enhanced accessibility features
- Locale/Language support
- Enhanced bot/scraper protections

###### Outside Scope:

- First-party e-commerce storefronts (complex, too much liability)
- User DMs (this is not a social app)
- Generally, anything that doesn't showcase or support a creative endeavor.

###### Will Be Rejected Without Hesitation:

- AI chatbots, summaries, image generation, **anything AI or LLM related**.

### Support Your Case

In some instances, for example a feature that was not requested, you should provide details about why the addition is within project scope and why it would make a good addition to the feature set.

> [!IMPORTANT]
> Remember: We need to keep this app light-weight and portable. Any additions should not cause excess processing time or significant additional server load.

##### Examples:

###### Gallery:
The gallery page serves a place for the creator(s) of the webcomic to showcase offical and fan art of the series and by extension will help foster community and showcase support for the works.

###### Blog:
The blog allows a simple, tried-and-true text-based method to communicate important news related to the webcomic or its creator(s) without clogging the update archive.

###### Cast:
Allows the creator to showcase and explain more about their characters and give more context to readers.
