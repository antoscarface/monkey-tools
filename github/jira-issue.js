// ==UserScript==
// @name         GH Jira
// @namespace    http://adespresso.com/
// @version      1.0
// @description  Linkifies branch name
// @author       Massimiliano Cannarozzo
// @include      /^https://github.com/adespresso/adespresso/pull/\d+/
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==
(function() {
    'use strict';
    var elem = $(".current-branch:contains('AAPP')").first();
    var text = elem.text();
    var issue = /^.+(AAPP-\d+)$/.exec(text)[1];
    var url = 'https://adespresso.atlassian.net/browse/'+issue;
    elem.attr('title', null);
    elem.html('<a href="'+url+'" target="_blank" title="See issue on Jira">'+elem.text()+'</a>');
})();

