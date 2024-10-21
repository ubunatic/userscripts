// ==UserScript==
// @name         Custom Favicon Setter
// @namespace    Ubunatic's Violentmonkey Scripts
// @version      1.0.1
// @description  Set a custom favicon for specific sites based on URL
// @author       @ubunatic
// @icon         https://upload.wikimedia.org/wikipedia/commons/0/08/Circle-icons-rocket.svg
// @noframes     // ensure to only run in window.top
// @license      MIT
// @run-at       document-idle
//
// @grant        GM.registerMenuCommand
// @grant        GM.notification
// @grant        GM.getValue
// @grant        GM.setValue
//
// @match        https://docs.google.com/spreadsheets/d/*
// @match        https://chatgpt.com/c/*
// @match        https://example.com/*
// @match        https://violentmonkey.github.io/*
//
// ==/UserScript==

(function() {
   'use strict';

   // ==Main==

   if (window.top != window.self) { return } // This is just a safe guard. Use @noframes header instead!

   console.log("Favicon Switcher: loading...")

   // Define your own hotkey behavior to open the UI here:
   // Here is an example how to catch: [Alt+F, I] (ignoring the state of other modifier keys)
   let hk = {}
   let hkClear = () => { hk = {} }
   let isHotkey = (ev) => {
      switch (true) {
      case ev.code === "KeyF" && ev.altKey: hk.F = true; setTimeout(hkClear, 500); return false
      case ev.code === "KeyI" && hk.F:                   hkClear();                return true
      default:                                           hkClear();                return false
      }
   }
   // TODO: make this configurable

   let hardcoded = [
      // WARNING! Do not store private data in this script, use partial matches for IDs to avoid leaking IDs across sites!
      // Do not forget to add new hostnames as @match rules in the header. Rules are applied in order. The first match wins.
      // ==MatchGroup:GM.getValue==
      // loaded asynchronously, but they will take precedence over the hardcoded values
      // ==MatchGroup:example.com==
      // { name: "example.com",        url: myURL, hostname: "example.com",    match: /^\/$/ },    // root only
      // { name: "example.com/rocket", icon: "🚀",  hostname: "example.com",    path: "/rocket" },  // any path starting with "/rocket"
      // { name: "example.com all",    icon: "🔠",  hostname: "example.com" },                      // the whole example.com site
      // {
      //   "name": "contacts",
      //   "icon": "👥",
      //   "hostname": "docs.google.com",
      //   "match": "/cgUynX2Cr4GbM/"
      // },
      // {
      //   "name": "accounting sheet",
      //   "icon": "🧾",
      //   "hostname": "docs.google.com",
      //   "match": "/1eEai2Wd7tJhZ/"
      // },
      // {
      //   "name": "userscript chat",
      //   "icon": "🤓",
      //   "hostname": "chatgpt.com",
      //   "match": "/6714ec4a-0d44/"
      // },
      // {
      //   "name": "chat gpt all",
      //   "icon": "💬",
      //   "hostname": "chatgpt.com"
      // },
      // {
      //   "name": "Violentmonkey",
      //   "icon": "🦾",
      //   "hostname": "violentmonkey.github.io"
      // },
   ]
   let favicons = hardcoded

   let done = false
   let foundTotal = 0
   let replacedTotal = 0
   let uiIsOpen = false
   let logPrefix = `Favicon Switcher ${window.location.href}:`
   let matchAll  = /.*/.toString()
   let pathRoot  = "/"
   let emptyConfig = {
      hostname: window.location.hostname,
      path: window.location.pathname,
      icon: "🤓",
      match: matchAll,
      name: `Custom Favicon for ${window.location.hostname}`,
   }

   // ==Init==

   // load the more favicon configurations from the settings
   GM.registerMenuCommand('Configure Favicons', openUI)

   reloadConfig(() => {
      window.addEventListener('load', () => {
         apply()
         setTimeout(apply, 1000) // re-apply to overwrite dynamic site behavior
      })

      apply() // apply now to have the icon early on

      if (window.location.hostname == "example.com") {
         logStats()
         openUI()
      }
      bindKeys()
   })

   // ==Funcs==

   function getConfig() {
      return favicons.find(cfg => matchLocation(cfg))
   }

   // loads all settings for all sites from the storage
   function reloadConfig(cb) {
      GM.getValue('favicons', []).then((settings) => {
         favicons = [
            ...Object.values(settings),
            ...hardcoded,
         ]
         done = false
         if (cb) { cb() }
      }).catch((error) => {
         console.error("Favicon Switcher: error loading settings", error)
      })
   }

   // reloads all settings for all sites from the storage,
   // then adds the new config to the settings,
   // and saves everything back to the storage
   function saveConfig(cfg, cb) {
      reloadConfig(() => {
         let settings = {}
         let deleteId = cfg.DELETE
         if (deleteId === undefined) {
            favicons.push(cfg)
         }
         for (let row of favicons) {
            let fav = {...row}
            if (fav.match)             { fav.match = fav.match.toString() }  // convert regex to string
            if (fav.icon)              { delete fav.url }                    // remove URL if an icon is set
            if (fav.match == matchAll) { delete fav.match }                  // remove match if it's the default
            if (fav.path == pathRoot)  { delete fav.path }                   // remove path if it's the default
            let id = configId(fav)
            if (deleteId != id) { settings[id] = fav }
         }

         GM.setValue('favicons', settings).then(() => {
            log("saved settings values:", settings.length)
            if (cb) { cb() }
         }).catch((error) => {
            console.error("Favicon Switcher: error saving settings", error)
         })
      })
   }

   function deleteConfig(id, cb) {
      saveConfig({ DELETE: id }, cb)
   }

   function apply() {
      let config = getConfig()
      if (config === undefined) return

      config = reparseConfig(config)
      if (config.url === undefined) {
         config.url = getEmojiFavicon(config.icon)
      }

      replaceFavicon(config.url)
      if (!done) {
         // log only the first time a favicon is set
         let url = config.url
         if (url.length > 100) { url = url.substring(0,100) + "…" }
         log(`setting favicon for ${config.hostname}${config.path}, ${config.match} to:`, url)
         done = true
      }
   }

   function log(...args) {
      let config = getConfig()
      if (config || window.location.hostname == "example.com") {
         console.log(logPrefix, ...args)
      }
   }

   function logStats() {
      // log only for sites where a replacement was effective
      log("replacedTotal:", replacedTotal)
      log("foundTotal:",    foundTotal)
   }

   function configId(cfg) {
      cfg = reparseConfig(cfg)
      let pfx = `${cfg.hostname}${cfg.path}`
      let val = `${pfx}${cfg.match}`
      return `${pfx}**/${simpleHash(val)}`
   }

   // simple hash function to create a hash from a string
   // returns a 32bit unsigned integer
   function simpleHash(str) {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
         hash = ((hash << 5) - hash) + str.charCodeAt(i)
         hash = hash & hash
      }
      return hash >>> 0
   }

   // Parses the config from the settings, accepts both a JSON string and an object, and will fill in defaults.
   // Requires hostname to be set, path defaults to "/", match defaults to /.*/, and icon defaults to "🤓".
   function reparseConfig(cfg) {
      cfg = typeof cfg === "string" ? JSON.parse(cfg) : {...cfg}
      if (cfg.hostname === undefined)                      { throw new Error("hostname is required") }
      if (cfg.path === undefined)                          { cfg.path  = pathRoot }
      if (cfg.match === undefined)                         { cfg.match = matchAll }
      if (cfg.url === undefined && cfg.icon === undefined) { cfg.icon = "🤓" }

      // mnake sure name is the last property
      let name = cfg.name; delete cfg.name
      cfg.name = name ? name : emptyConfig.name

      let match = cfg.match.toString()
      if (match.startsWith("/") && match.endsWith("/")) {
         match = match.slice(1, -1)
      }
      cfg.match = new RegExp(match)
      return cfg
   }

   function matchLocation(cfg) {
      cfg = reparseConfig(cfg)
      return (
            window.location.hostname == cfg.hostname  &&
            window.location.pathname.startsWith(cfg.path) &&
            window.location.pathname.match(cfg.match)
      )
   }

   function replaceFavicon(url) {
      // find all favicons definitions in the head for removal
      let headIcons = document.head.querySelectorAll(`link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]`)
      let rels = ['icon', 'shortcut icon', 'apple-touch-icon']

      let removed = 0
      let existing = 0
      for (let elem of headIcons) {
         if (elem.href == url) {
           existing += 1
         }
         elem.parentNode.removeChild(elem)
         removed += 1
      }

      replacedTotal += removed
      foundTotal    += existing

      rels.forEach(rel => addFaviconLink(url, rel))
   }

   function addFaviconLink(url, rel) {
      let link = document.createElement('link')
      link.rel = rel
      link.href = url
      document.head.appendChild(link)
   }

   function getEmojiFavicon(text) {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;

      const ctx = canvas.getContext('2d');
      ctx.font = '64px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height - 24);

      log("created emoji favicon:", text)

      return canvas.toDataURL('image/png');
   }

   // ==Menu==
   function openUI() {
      let cfg = getConfig()
      let isNew = false
      if (cfg === undefined) {
         cfg = emptyConfig
         isNew = true
      }
      let id = configId(cfg)
      cfg = reparseConfig(cfg)
      cfg.match = cfg.match.toString() // convert regex to string
      if (cfg.icon) { delete cfg.url } // remove URL if an icon is set

      const uiContainer = document.createElement('div');
      uiContainer.style.position = 'fixed';
      uiContainer.style.top = '10px';
      uiContainer.style.right = '10px';
      uiContainer.style.backgroundColor = 'white';
      uiContainer.style.border = '1px solid black';
      uiContainer.style.padding = '10px';
      uiContainer.style.zIndex = '10000';
      uiContainer.className = 'favicon-switcher-ui';
      uiContainer.innerHTML = `
         <h3>Edit Favicon</h3>
         <p>Editing ${ isNew? "New" : "" } Entry: <i style="font-family: Monospace">${configId(cfg)}</i></p>
         <textarea id="__favicon__Config" style="width: 100%; height: 120px;">${ JSON.stringify(cfg, null, 2) }</textarea>
         <small>
         <p>Please set the following properties:</p>
         <ul>
            <li><b>icon</b>: an emoji to use as the favicon OR<br>
                <b>url</b>: the favicon URL to use
            <li><b>hostname</b>: the URL hostname to match (default: window.location.hostname)
            <li><b>path</b>: the path to match (default: "/"; URL pathname must start with this path)
            <li><b>match</b>: a regular expression to match against the URL pathname (default: ".*")
         </ul>
         <p>Use <b style="font-family: Monospace">Alt/Option+I</b> two times to open/close this dialog.</p>
         <p>To remove the entry, click the "Clear" button.</p>
         </small>
         </p>
         <p></p>
         <button id="__favicon__SaveUI">${isNew ? "Add": "Update"} 💾</button>
         <button id="__favicon__ResetUI" ${isNew ? "disabled" : ""}>Clear 🧹</button>
         <button id="__favicon__CloseUI">Close ❌</button>
      `

      document.body.appendChild(uiContainer)

      let applyAndReload = () => {
         apply()
         uiContainer.remove()
         reloadConfig(openUI)
      }

      uiContainer.querySelector('#__favicon__SaveUI').addEventListener('click', () => {
         cfg = reparseConfig(uiContainer.querySelector('#__favicon__Config').value)
         saveConfig(cfg, applyAndReload)
      })

      uiContainer.querySelector('#__favicon__ResetUI').addEventListener('click', () => {
         uiContainer.querySelector('#__favicon__Config').disabled = true
         uiContainer.querySelector('#__favicon__SaveUI').disabled = true
         deleteConfig(id, applyAndReload)
      })

      uiContainer.querySelector('#__favicon__CloseUI').addEventListener('click', closeUI)

      // document.getElementById('closeUI').addEventListener('click', closeUI)

      notify('Favicon Switcher UI opened')
      uiIsOpen = true
   }

   function closeUI() {
      // Close the UI
      const uiContainer = document.querySelector('.favicon-switcher-ui');
      if (uiContainer) {
         uiContainer.remove();
         notify('Favicon Switcher UI closed');
      }
      uiIsOpen = false
   }

   function notify(message) {
      // Create a notification with GM_notification
      GM.notification({
         text: message,
         title: 'Favicon Switcher',
         timeout: 5000,
      })
      log("send notification:", message, {GM: GM});
   }

   function bindKeys() {
      document.addEventListener('keypress', (event) => {
         if (isHotkey(event)) {
            uiIsOpen ? closeUI() : openUI()
            event.preventDefault()  // prevent default action
            event.stopPropagation() // prevent event from propagating
         }
      })
   }

})();
