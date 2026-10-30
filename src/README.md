# /app/src

### Contents:

- `/hooks` - Constins functions related to CSRF protections and rate-limiting (used in hooks.server.js).
- `/lib` - Contains assets, components, and utility functions + other useful tools.
- `/routes` - Contains all pages (HTML/CSS/JS) that exist in the app, and the logic that controls them.
- `app.css` - Contains all globally-available CSS for the entire app.
- `app.html` - The root of the entire application. ***You shouldn't need to edit this.***
- `hooks.server.js` - The brains of the project. Controls the server-side logic for keeping you and others authenticated and secure, as well as modifies the HTML/CSS on page load to add custom themes and settings from the database for each request.
