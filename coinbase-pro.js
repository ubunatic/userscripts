// ==UserScript==
// @name         Coinbase Pro Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Better layout for coinbase pro web UI
// @author       Uwe Jugel, @ubunatic
// @match        https://pro.coinbase.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('Coinbase Pro Enhancer is loading...')
    function $(sel){ return document.querySelector(sel) }
    function start(){ load(0) }
    function load(tries){
        var chart = $("div[name='chart-tabbed']")
        var side = $("div[name='sidebar']")
        var book = $("div[name='order-book-tabbed']")
        var trades = $("div[name='trading']")
        var delay = 100
        var total = tries * delay
        var path = window.location.pathname

        var grid = (side)? side.parentElement:null
        var cols = "299px 200px 1fr"
        var rows = "1.2fr 0.8fr"
        if(path.split('/')[1] != 'trade'){
            console.debug('Coinbase Pro Enhancer skipped, window location does not match trade view path', path)
            return
        }
        if(grid == null){
            console.debug('Coinbase Pro Enhancer delaying start, waiting', delay, 'ms for div[name="sidebar"]...')
            return setTimeout(load, delay, tries+1)
        }
        if(total > 10000) {
            console.debug('Coinbase Pro Enhancer failed to load')
            return
        }
        if(grid.style.gridTemplateColumns == cols &&
           grid.style.gridTemplateRows == rows) {
            console.debug('Coinbase Pro Enhancer loaded, grid already fixed')
            return
        }

        grid.style.gridTemplateColumns = cols
        grid.style.gridTemplateRows = rows
        console.log('Coinbase Pro Enhancer loaded, grid template changed')
    }

    start()
    // window.addEventListener("popstate", start, false);    // does not work
    // window.addEventListener("hashchange", start, false);  // does not work
    // Currently the savest way to repair the UI without polling is to react
    // on an infrequent user event like "click".
    window.addEventListener("click", start, false);
})();
