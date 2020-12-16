// ==UserScript==
// @name         Meet Chat Scaling
// @namespace    https://github.com/ubunatic/userscripts
// @version      0.1
// @description  Fix the tiny Meet chat!
// @author       Uwe Jugel, @ubunatic
// @match        https://meet.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let style = document.createElement("style")
    style.innerText = [
        'span[role="tabpanel"] div      { font-size: 15pt !important; line-height: 20pt !important; }',
        'textarea[name="chatTextInput"] { font-size: 15pt !important; line-height: 20pt !important; }',
    ].join("\n")
    document.head.append(style)
})();
