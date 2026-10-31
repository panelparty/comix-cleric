# Comix Cleric

The new way to host your webcomic!

---

## What is Comix Cleric?

Comix Cleric is an all-in-one app + toolkit for you to get your own responsive webcomic site up and running with little effort!

We've provided everything you need, minus the server to host it on! (Though, we do provide [that](https://comixcleric.com/pricing), too...)

> [!NOTE]
> This project will not fit everyone's needs. If you have an idea and want to try to add it in yourself, consider contibuting to this repo!

### Disclaimer:

While Comix Cleric is free to use without paying us and the source is open for review, modification, commercial use and contributions, we need to clarify some things:

Examples of what we expect you to do with this codebase without our express permission:

- Self-host the app and gain any amount of user traffic and revenue: The sky's the limit!
- Fork and distribute custom builds via direct download, whether on GitHub or your own site.
- Modify the codebase and contribute your work back to accelerate development efforts.

We just ask that no one turns our work into a competing service without our involvement. If you want to offer hosting services or one-click solutions utilizing the Comix Cleric package, feel free to reach out and see what we can do to help you!

Whether you can see it or not, this project is not just about providing an app you can use for your webcomics, we are trying to pave the way for more ethical, open solutions to problems induced by the large players in the industry. This is not limited to Comix Cleric. We have unannounced plans for other tools and services that serve the same mission: Giving our peers a space where they can feel that their interests are respected. If this project is undercut by a person or company that seeks to minimize our efforts, we all lose. The only way these projects are getting made in a timely manner is if we can give them our full and undivided attention.

### Comix Cleric Branding

While this project is free and open-source, Comix Cleric's name, logo, and mascot (Panelope) rights are owned by Panel Party LLC. You may not use this branding in any context that would imply endorsement of your work. You may not include this branding in any derivative work without permission from Panel Party leadership, except where otherwise stated.

Some exceptions are:
- The app footer, where there is a backlink to our website/source.
- Mentioned as the basis of your new derivative work.
- Fan art that doesn't appear to make any official endorsement by us.

Any branded image materials provided are only to be used as placeholders in the main package and are not subject to the Comix Cleric package `Apache 2.0` license terms. Our branding is not part of the open-source package and remains exclusively our intellectual property, just as your comics and stories remain your own.

In simple terms: You don't have the right to use our branding without permission, and you especially may not imply that we endorse your hosted webcomics or forked codebases in any capacity, unless otherwise stated by us to you directly in writing.

---

## Download & Install

> [!NOTE]
> **Prerequisites**: Currently, Comix Cleric requires a server with admin/root access and Docker/Node.js installed. 1 CPU core, 1GB RAM is recommended. Storage limitations are up to how much you plan on uploading. At least 5GB of space should be plenty to start with. The Docker image size is generally between 180-220MB depending on the build.

There are two options to get started:
- Option 1: Official Docker Image
- Option 2: Node.js / Custom Builds

### Option 1: Official Docker Image

#### Installation

1. On your VPS server, `ssh` or use and FTP tool to create a new directory and `compose.yml` file.

2. Add the following to the `compose.yml` (minimal setup):
```yaml
services:
  init-perms:
    image: alpine
    command: chown -R 1000:1000 /app/data /app/uploads
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads

  sveltekit:
    image: panelparty/comix-cleric:latest
    container_name: comix_cleric
    restart: unless-stopped
    depends_on:
      init-perms:
        condition: service_completed_successfully
    ports:
      - 3366:3366
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    environment:
      NODE_ENV: production
      ORIGIN: https://example.com
      PORT: 3366
      BETTER_AUTH_SECRET: CHANGE_THIS_VALUE
```

3. Be sure to save the file, then run `docker compose up -d` to pull the image and start a new container with the default driver (frees your terminal after launch).

Your new Comix Cleric app should now be running and have generated the required folders and files for operation.

### Option 2: Node.js / Custom Builds

#### Installation

1. In the official GitHub repo (you are here!), download the latest version of the app from the Releases section on the right in GitHub. Decide whether you want to download:

- `source.zip` - Contains all files you might need to build a custom version.
- `release.zip` - Only contains what you need to run/deploy the site. (You can still download the full source to tinker with later, the main app is just a shell.)

2. Unzip the files and place them onto your local machine for development, or on your server.

> [!IMPORTANT]
> This can be any directory you have easy access to. We suggest placing these files into a fresh folder. For this example, we'll say `cc-app`. If you are using the `release.zip`, you should need to simply move all the files into this new folder. If you are using the full source, build your app (explained later), and move the `/build`, `.env`, `dockerfile`, `docker-compose.yml`, `package.json`, `pnpm-lock.yaml` to the empty folder on your server.

Minimum files needed to run the app:

```bash
cc-app/
├── build/
├── .env
├── docker-compose.yml # If using Docker
├── dockerfile # If using Docker
├── package.json
└── pnpm-lock.yaml
```

3. Once the files are in-place, navigate to where you uploaded your files `cd /path/to/cc-app`.
	- If deploying via Docker, run `docker compose up -d --build`.
	- If deploying with plain Node.js, run `node build`.

Your new Comix Cleric app should now be running and have generated the required folders and files for operation.

> [!TIP]
> SvelteKit has many [adapters](https://svelte.dev/docs/kit/adapters) you might want to use for your build.

### Next Steps

- Create your DNS records and reverse proxy config, set name servers, and SSL certificates to get your site online. (More details coming soon)
- Setup your app at `https://your-domain.com/api/setup`.

---

## Local Development

> [!IMPORTANT]
> This project was built using pnpm. It has not been tested with other package managers.

Assuming you've downloaded and unpacked the Comix Cleric source or cloned from this repo:

1. Open a terminal and/or IDE (code editor) in the project folder.

2. Install dependencies with `pnpm i`.

3. Start the development server:

```bash
# Start the development server
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev --open
```

---

## Building for Production

To create a production-ready version of the app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

> This app is already using `adapter-node` as its output for the build process.

---

## Contributing:

Guidelines for contributions can be found in CONTRIBUTING.md.

---

## License:

Comix Cleric © 2026 Panel Party LLC

This free and open-source package is licensed under Apache 2.0.

Name, logo, mascot, and other branded materials are not subject to this license and are only to be used externally for editorial/journalistic purposes.
