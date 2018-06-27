// ==UserScript==
// @name         Coinbase Pro Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Better layout for coinbase pro web UI
// @author       Uwe Jugel, @ubunatic
// @match        https://pro.coinbase.com/trade/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function $(sel){ return document.querySelector(sel) }
    function load(tries){
        var chart = $("div[name='chart-tabbed']")
        var side = $("div[name='sidebar']")
        var book = $("div[name='order-book-tabbed']")
        var trades = $("div[name='trading']")
        var delay = 100
        var total = tries * delay
        if(total > 10000){
            console.error('Coinbase Pro Enhancer failed to load after 10s')
            return
        }
        if(chart == null){
            console.debug('Coinbase Pro Enhancer delaying start, waiting', delay, 'ms for div[name="sidebar"]...')
            return setTimeout(load, delay, tries+1)
        }
        console.log('Coinbase Pro Enhancer is loading...')
        var grid = side.parentElement
        grid.style.gridTemplateColumns = "299px 200px 1fr"
        grid.style.gridTemplateRows = "1.2fr 0.8fr"
        console.log('Coinbase Pro Enhancer loaded, grid template changed')
    }

    load(0)
})();
