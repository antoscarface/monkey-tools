// ==UserScript==
// @name         Notify PR Checks ready
// @namespace    http://adespresso.com/
// @version      1.0
// @description  Shows notification of completed checks on a PR
// @author       Giorgio Cefaro
// @updateURL    https://raw.githubusercontent.com/adespresso/monkey-tools/master/github/notify-completed-checks.user.js
// @include      /^https://github.com/adespresso/adespresso/pull/\d+/
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/notify.js/2.0.3/notify.min.js
// ==/UserScript==

var Notify = window.Notify.default;

function alertReady() {
    var notification = new Notify($('h1.gh-header-title .js-issue-title').text().trim(), {
        body: $('h4.status-heading').first().text().trim(),
        icon: $('.timeline-comment-avatar').first().attr('src'),
    });
    if (!Notify.needsPermission) {
        notification.show();
    } else if (Notify.isSupported()) {
        Notify.requestPermission(() => notification.show());
    }
}

(function () {
    if ($('.completeness-indicator-success').length === 0) {
        waitForKeyElements('.mergeability-details .completeness-indicator-success', alertReady);
    }
})();
