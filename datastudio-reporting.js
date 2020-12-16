// ==UserScript==
// @name         Datastudio Dashboard UI Fix
// @namespace    https://github.com/ubunatic/userscripts
// @version      0.1
// @description  fix annoying zombie overlays on data tables
// @author       Uwe Jugel, @ubunatic
// @match        https://datastudio.google.com/reporting/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let hide = function() {
        let svg = $("div.tableBody svg.metric-axis-holder")
        svg.remove()
    }

    setInterval(hide, 1000)

})();
