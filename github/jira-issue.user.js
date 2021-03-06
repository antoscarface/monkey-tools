// ==UserScript==
// @name         GH Jira
// @namespace    http://adespresso.com/
// @version      1.5
// @description  Linkifies branch name
// @author       Massimiliano Cannarozzo
// @updateURL    https://raw.githubusercontent.com/adespresso/monkey-tools/master/github/jira-issue.user.js
// @include      /^https://github.com/adespresso/.+/pull/\d+/
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

function linkifyBranchName() {
    var elem = $(".head-ref:contains('AAPP'), .head-ref:contains('BUGS'), .head-ref:contains('AW'), .head-ref:contains('WWP')").last();
    var text = elem.text();
    var issue = /^.+((AAPP|BUGS|AW|WWP)-\d+)$/.exec(text)[1];
    var url = 'https://adespresso.atlassian.net/browse/' + issue;
    elem.attr('title', null);
    elem.html(
        '<img src="https://cloud.githubusercontent.com/assets/442835/16224961/b1bf3b26-37a4-11e6-96cd-7ebd6dad43fe.png" width="16px" style="vertical-align: middle; position: relative; top: -1px;">' +
        '<a href="' + url + '" target="_blank" title="See issue on Jira" style="vertical-align: middle">' + elem.text() + '</a>'
    );
}
(function () {
    waitForKeyElements(".head-ref:contains('AAPP'), .head-ref:contains('BUGS'), .head-ref:contains('AW'), .head-ref:contains('WWP')", linkifyBranchName);
})();
