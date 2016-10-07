// ==UserScript==
// @name         Jira GH Issue Sidebar
// @namespace    http://adespresso.com/
// @version      1.0
// @description  Add GitHub sidebar item to Jira issue page
// @author       Massimiliano Cannarozzo
// @updateURL    https://raw.githubusercontent.com/adespresso/monkey-tools/master/jira/github-sidebar-item.user.js
// @grant        GM_xmlhttpRequest
// @include      /^https://adespresso.atlassian.net/browse/(AAPP|BUGS)-\d+
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

var run = false;
var cachedResponse = null;
var prStatusClassMap = {
    MERGED: 'aui-lozenge-success',
    DECLINED: 'aui-lozenge-error',
    OPEN: 'aui-lozenge-complete',
};

function buildSidebarItem(id, children) {
    var sidebarItem = $(
        '<div id="' + id + '" class="module toggle-wrap">' +
        '<div id="greenhopper-agile-issue-web-panel_heading" class="mod-header">' +
        '<ul class="ops"></ul>' +
        '<h2 class="toggle-title">GitHub</h2>' +
        '</div>' +
        '<div class="mod-content"><ul class="item-details ghx-separated"></ul></div></div>'
    );

    sidebarItem.find('.item-details').append(children);
    return sidebarItem;
}

function injectOrUpdateGithubStatus(response) {
    response = response || cachedResponse;

    cachedResponse = response;
    if (response && !document.getElementById('jiraSidebarItem')) {
        var responseContent = JSON.parse(response.response).detail[0];
        var els = [];
        var prBranches = [];
        responseContent.pullRequests.forEach(pr => {
            prBranches.push(pr.source.branch);
            var el = $('<li><a href="' + pr.url + '">' +
                '<span class="aui-avatar-inner aui-icon aui-icon-small aui-iconfont-devtools-repository-forked"></span> ' +
                pr.id + '</a>&nbsp;<span class="aui-lozenge aui-lozenge-subtle ' + prStatusClassMap[pr.status] + '">' +
                pr.status + '</span></li>');
            els.push(el);
        });
        responseContent.branches.forEach(branch => {
            if (prBranches.indexOf(branch.name) >= 0) {
                return;
            }

            var el = $('<li><a href="' + branch.createPullRequestUrl + '/' + branch.name + '">' +
                '<span class="aui-avatar-inner aui-icon aui-icon-small aui-iconfont-devtools-repository"></span>' +
                '</a>&nbsp;' + branch.name + '</li>');
            els.push(el);
        });

        buildSidebarItem('jiraSidebarItem', els).appendTo($('#datesmodule'));
    }
    if (document.getElementById('viewissue-devstatus-panel')) {
        document.getElementById('viewissue-devstatus-panel').remove();
    }
}

function main() {
    // We don't want to make the XHR request more than once per page load.
    if (run) {
        injectOrUpdateGithubStatus();
        return;
    }
    run = true;

    var issue = $('#devstatus-container').attr('data-issue-id');
    var url = 'https://adespresso.atlassian.net/rest/dev-status/latest/issue/detail?issueId=' + issue + '&applicationType=github&dataType=pullrequest';
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: injectOrUpdateGithubStatus,
    });
}

(function () {
    waitForKeyElements('#devstatus-container', main);
})();

