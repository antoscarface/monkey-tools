// ==UserScript==
// @name         PlanningPoker Jira
// @namespace    http://adespresso.com/
// @version      1.0
// @description  Linkifies issue name
// @author       Massimiliano Cannarozzo
// @updateURL    https://raw.githubusercontent.com/adespresso/monkey-tools/master/planningpoker/jira-issue.user.js
// @include      /^https://play.planningpoker.com/play/game/.+/
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

function linkifyIssueName() {
    var elem = $('.item-title').first();
    var text = elem.text();
    var issue = /^.*((AAPP|BUGS)-\d+)$/.exec(text)[1];
    var url = 'https://adespresso.atlassian.net/browse/' + issue;
    elem.attr('title', null);
    elem.html(
        '<img src="https://cloud.githubusercontent.com/assets/442835/16224961/b1bf3b26-37a4-11e6-96cd-7ebd6dad43fe.png" width="16px" style="vertical-align: middle; position: relative; top: -1px;">' +
        '<a href="' + url + '" target="_blank" title="See issue on Jira" style="vertical-align: middle">' + elem.text() + '</a>'
    );
}
(function () {
    waitForKeyElements('.item-title', linkifyIssueName);
})();
