// ==UserScript==
// @name         Meet Chat Scaling
// @namespace    https://github.com/ubunatic/userscripts
// @version      0.2
// @description  Fix the tiny Meet chat!
// @author       Uwe Jugel, @ubunatic
// @match        https://meet.google.com/*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`span[role="tabpanel"] div, textarea[name="chatTextInput"] { font-size: 15pt !important; line-height: 20pt !important; }`);
