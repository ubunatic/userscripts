# UserScripts
UserScripts are small JavaScript programs that **You!** can run inside every website you visit.
Here is my collection of scripts that improve my website browsing.

## Installation
1. Install a UserScript tool, such as [violentmonkey.github.io](https://violentmonkey.github.io/)
2. Drag and drop the `<name>.user.js` file to the browser

## The Scripts

### Favicon Switcher
Script: [favicon_switcher.user.js](favicon_switcher.user.js) \
Version: 1.0.1 \
Description: Favicon Switcher switches the `favicon.ico` for selected sites (configured in [GM storage]()) \
Features:
- **Emoji Support** to use unicode characters such as 🤓, 🚀, 💪, as favicons (via HTML `canvas` and data URLs)

- **A [menu](assets/favicon_switcher.menu.png)** to configure the icon for the current site (Hotkey: `Alt+F,I` or `Option+F,I`). \
  The menu can also be opened from the UserScript tools menu using the *Configure Favicon* menu entry. \
  Or can manually edit the JSON in the UserScript's browser settings (see format below).

- **Preconfigured for** `docs.google.com` so you can change the icons of all your Google docs. \
  To also use it for other sites, add more `// @match https://some.site.somewhere/path/*` statements to the [file](favicon_switcher.user.js) header

- **Settings** are stored using the following format:
  <small>
  ```
  {
        "favicons": {
            "example.com/**/1528803583": {
            "name": "example.com",
            "url": "https://upload.wikimedia.org/wikipedia/commons/0/08/Circle-icons-rocket.svg",
            "hostname": "example.com",
            "match": "/^\\/$/"
            },
            "example.com/rocket**/3917518474": {
            "name": "example.com/rocket",
            "icon": "🚀",
            "hostname": "example.com",
            "path": "/rocket"
            },
        }
  }
  ```
  </small>

  All settings are stored using the key: `favicons`. The stored JSON Object has a unique key for every entry. \
  You can use any key when editing manually. The properties for each entry are the following:
  <!-- copy+paste this section from the script's HTML help -->
  <ul>
  <li><b>icon</b>: an emoji to use as the favicon OR<br>
      <b>url</b>: the favicon URL to use
  <li><b>hostname</b>: the URL hostname to match (default: window.location.hostname)
  <li><b>path</b>: the path to match (default: "/"; URL pathname must start with this path)
  <li><b>match</b>: a regular expression to match against the URL pathname (default: ".*")
  </ul>

If you later use the [menu](assets/favicon_switcher.menu.png) to edit the entries. They may appear with with new (generated) keys.

[GM storage]:  https://violentmonkey.github.io/api/gm/#gm-setvalue

## LICENSE
Licensed under the Apache License, Version 2.0.

NO WARRANTIES OR CONDITIONS OF ANY KIND. USE AT YOUR OWN RISK.

See [LICENSE](LICENSE) file.
