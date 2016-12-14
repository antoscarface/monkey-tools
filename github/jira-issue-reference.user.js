// ==UserScript==
// @name         GH PR Jira Reference filler
// @namespace    http://adespresso.com/
// @version      1.0
// @description  Fills the reference to the JIRA issue automatically
// @author       Massimiliano Cannarozzo
// @updateURL    https://raw.githubusercontent.com/adespresso/monkey-tools/master/github/jira-issue-reference.user.js
// @include      /^https://github.com/adespresso/.+/compare/.+
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

function fillReference() {
    var elem = $('.js-menu-target.branch > span').last();
    var text = elem.text();
    var matches = /^.*-([A-Z]+-\d+)$/.exec(text);
    if (matches.length > 0) {
        var issue = matches[1];
        $('#pull_request_body').val(`Ref. [${issue}](https://adespresso.atlassian.net/browse/${issue})`);
    }
}
(function () {
    waitForKeyElements('.js-menu-target', fillReference);
})();
