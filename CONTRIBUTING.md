# Comix Cleric Contributing Guide

> [!CAUTION]
> Contributions are not yet being accepted. Please watch this space for updates.

## Licensing Contibutions

By submitting a contribution to this project, you grant us a perpetual, irrevocable right to license your contribution under any terms, including commercial terms. You will be asked to sign a CLA with your first contribution, and this signature will be used for any subsequent contributions without the need to re-sign each time.

In plain English: By contributing your code to this project, we have the right to sublicense your contributed code commercially (for instance, running our own hosting platform or partnering with another hosting platform), without your explicit or written consent, and you cannot change your mind once it's been accepted. All contributions will be sublicensed under our Apache 2.0 license.

This is very important, as you **do** own the rights to any code you contribute and may use such code outside of this repo as you see fit. By contributing code, you are not waving your rights, but merely giving us express permission to sublicense it with the rest of our own code. It keeps things easy and frictionless for everyone involved.

If you do not agree to these terms, *you should **not** contribute any code to this project.*

Also, this should go without saying, but you **must** own or have authorship rights to the code you're contributing. We do not accept AI/LLM written or assisted code. Offending code will be removed, and you will be barred from future contributions entirely depending on the offense. If you believe we have falsely flagged your contribution as AI-generated, you are free to appeal by giving us an insight into your code writing process.

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

## Testing Changes

Local changes can be tested by running a development server and local database.

TODO: Please expand upon this.

> Be warned: Connecting to a live database may cause irreversable dataloss if care is not taken to ensure the original database is backed-up and that the you are willing to lose any data in fields you may be modifying.

### Testing/Reviewing PR Changes

If you'd like to test upcoming features implemented by other contributors for the sake of speeding things up, you can pull PR branches and check them out in your local environment.

Contributors should be providing any testing materials used to ensure things don't appear broken during review.

This includes:
- Images/Media (provided they are SFW and generally inoffensive)
- Database files (this should not be a production copy)

If a contributor fails to provide these materials, or their PR is actually inoperable, notify a staff member or report it to the contributor yourself if you feel comfortable doing so.

> [!TIP]
> More details coming soon.

---

## Code structure

For all intents and purposes, this is a standard SvelteKit application and follows structures provided by the framework.

The main entry point for changes is the `src/` directory. This houses the entire main portion of the application.

Withing the `src/`, you will find:
- `hooks/` - A set of functions for rate-limiting and CSRF.
- `lib/` - A library for assets like images, utilities, components, and API adapter code.
- `routes/` - All existing pages and layouts for the app.
- `app.css` - Global stylesheet for the app.
- `app.html` - Main app entry point (generally shouldn't be edited).
- `hooks.server.js` - Handles all server-side requests, scheduled post publishing, auth persistence, etc.

## Good first issues

If you're looking for an issue to tackle to get familiar with the codebase and testing environment, keep an eye out for more simple bugs and features in the open issues.

---

## Testing

Comix Cleric must be rebuilt each time before running in production if you've made code changes. There is a `build` command for just such an ocassion. Once the build has completed successfully, you can run `pnpm preview` to run the built files to make sure everything was appropriately compiled. Keep a close eye out for errors, missing elements, and unexpected shifts in layout.

You can also test Docker builds locally by first building your app with the previous step, then running `docker compose up -d --build`. (Assuming you have Docker installed on your local system and have configured the `dockerfile` and `compose.yml` files.)

---

## Documentation changes

All documentation for Comix Cleric is in the [`comix-cleric-docs` repo](https://github.com/panelparty/comix-cleric-docs), and any improvements should be made as a Pull Request to that repository.

Our hub site is private for security reasons, so changes to documentation cannot be previewed at this time.

---

## Sending PRs

When you open a PR, the [PR template](./.github/PULL_REQUEST_TEMPLATE.md) includes a checklist. Please read it carefully and **don't** delete it.

**Run tests locally before submitting.** At a minimum, run `pnpm preview` after building and visually ensure your work is functional.

### Coding style

There are a few guidelines we follow:
- All API-related variables are written in `snake_case` for consistency between code and database.
- Keep all API calls on the server unless you are performing a client-side fetch to a server endpoint.
- A single new-line between nested siblings unless they share functional similarity.

---

### Generating changelogs

At this time, changelogs must be hand-crafted. At some time in the future, we may use a tool like `changeset` to generate them from

AI/LLM generated changelogs are not acceptable. No emojis, no em-dashes, no tell-tale signs of AI use, please. Even if you feel your written communication skills aren't great, outsourcing that to a machine doesn't help you or us because the AI is often entirely wrong and over-explains to the point of becoming just as difficult to understand. We encourage you to use your own words, even if you don't feel great about it. We will help with any grammatical errors, no judgement.

---

## Releases

The core development team will manually release new versions once relevent milestones have been reached.

---

### Keep Contibutions Within Project Scope

All code contributed to Comix Cleric must remain within project scope guidelines. Features too far outside the project scope will likely be rejected, but you can still submit your PRs.

> [!IMPORTANT]
> Remember: This app is not just about your wants, we have to make sure that it is serving its primary purpose first and foremost.

### Project Scope:

In the simplest terms, the scope of this project is to provide the highest quality experience for uploading and reading webcomics. There are a few additional features we implemented up front to lean a bit more into the portfolio side of things, but this project should mainly focus on the endeavors of the artist and theri webcomic projects.

##### Examples:

###### Within Scope:
- Improved reader formatting
- Better audio playlist support for pages
- New media block types
- Enhanced accessibility features
- Locale/Language support
- Enhanced bot/scraper protections

###### Outside Scope:
- E-Commerce storefront integrations
- Forums / User DMs

###### Will Be Rejected Without Hesitation:
- AI chatbots, summaries, image generation, **anything AI or LLM related**.

---

### Support Your Case

In some instances, for example a feature that was not requested, you should provide details about why the addition is within project scope and why it would make a good addition to the feature set.

> [!IMPORTANT]
> Remember: We need to keep this app light-weight and portable. Any additions should not cause excess processing time.

##### Examples:

###### Gallery:
The gallery page serves a place for the creator(s) of the webcomic to showcase offical and fan art of the series.

###### Blog:
The blog allows a text-based way to communicate important news related to the webcomic or its creator(s) without clogging the comic update archive.

###### Bluesky feed integration:
The integration allows the creator(s) another avenue to share important updates, fan art, etc. from an established social media platform.