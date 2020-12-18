// ==UserScript==
// @name         Meet Chat Scaling
// @namespace    https://github.com/ubunatic/userscripts
// @version      0.3
// @description  Fix the tiny Meet chat!
// @author       Uwe Jugel, @ubunatic
// @match        https://meet.google.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const selectors = [
        `span[role="tabpanel"] div`,           // regular chat message
        `span[role="tabpanel"] a`,             // link in chat message
        `textarea[name="chatTextInput"]`,      // chat input
        `div[role="button"][tabindex="0"] div` // popup message
    ]

    const style = `{ font-size: 15pt !important; line-height: 20pt !important; }`

    GM_addStyle(selectors.join(", ") + style);
})();


