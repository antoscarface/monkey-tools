// ==UserScript==
// @name         GH Jira Issue Sidebar
// @namespace    http://adespresso.com/
// @version      1.0
// @description  Add Jira sidebar item to GitHub pull request page
// @author       Massimiliano Cannarozzo
// @updateURL    https://raw.githubusercontent.com/adespresso/monkey-tools/master/github/jira-sidebar-item.user.js
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @include      /^https://github.com/adespresso/adespresso/pull/\d+/
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @resource     jira https://adespresso.atlassian.net/download/contextbatch/css/_super/batch.css?atlassian.aui.raphael.disabled=true&relative-url=true
// ==/UserScript==

var run = false;
var cachedResponse = null;
var jiraStyle = GM_getResourceText('jira');

function buildStyleElement() {
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = jiraStyle;

    return style;
}

function wrapSidebarItem(sidebarItem) {
    sidebarItem = $(sidebarItem);
    var content = sidebarItem.find('.content');

    var wrapper = {
        element: sidebarItem,
        prependTo: function (element) {
            return sidebarItem.prependTo(element);
        },
        append: function (stuff) {
            return content.append(stuff);
        },
        html: function (stuff) {
            return content.html(stuff);
        },
        find: function (selector) {
            return content.find(selector);
        },
    };

    return wrapper;
}

function getSidebarItem(id) {
    var sidebarItem = document.getElementById(id);

    if (sidebarItem) {
        return wrapSidebarItem(sidebarItem);
    } else {
        return null;
    }
}

function buildSidebarItem(id) {
    var sidebarItem = $(
        '<div id="' + id + '" class="discussion-sidebar-item">' +
        '   <h3 class="discussion-sidebar-heading">Jira</h3>' +
        '   <div class="content"></div>' +
        '</div>'
    );

    return wrapSidebarItem(sidebarItem);
}

function buildIssueLink(issue, summary) {
    var url = 'https://adespresso.atlassian.net/browse/' + issue;

    return $('<a href="' + url + '" target="_top" style="vertical-align: middle">' + issue + '</a>')
        .attr('title', summary);
}

function injectOrUpdateJiraStatus(response) {
    response = response || cachedResponse;
    cachedResponse = response;

    if (!response) {
        return;
    }

    var parent = document.getElementById('partial-discussion-sidebar');
    if (!parent) {
        return;
    }

    var responseContent = JSON.parse(response.response);
    var sidebarItem = getSidebarItem('jiraSidebarItem');
    if (!sidebarItem) {
        sidebarItem = buildSidebarItem('jiraSidebarItem');
        sidebarItem.prependTo(parent);
    }

    if (responseContent.errorMessages) {
        sidebarItem.html(responseContent.errorMessages.join('<br/>'));
    } else {
        var iframe = sidebarItem.find('iframe');
        if (!iframe.length) {
            iframe = $('<iframe width="200" height="20" scrolling="no" />')
                .css({
                    border: 'none',
                });
            sidebarItem.append(iframe);
        }
        var issue = responseContent.key;
        var summary = responseContent.fields.summary;
        var status = responseContent.fields.status;

        iframe = iframe.contents();
        iframe.find('head')
            .empty()
            .append(buildStyleElement());
        iframe.find('body')
            .empty()
            // We don't want Jira's gray default background.
            .css({ backgroundColor: 'transparent' })
            .append(buildIssueLink(issue, summary))
            .append(' <span class="aui-lozenge jira-issue-status-lozenge-' + status.statusCategory.colorName + '" style="vertical-align: middle">' + status.name + '</span>');
    }
}

function main() {
    var elem = $('.current-branch,h1').find(":contains('AAPP')").last();
    var text = elem.text();
    var issue = /(AAPP-\d+)/.exec(text)[1];

    // We don't want to make the XHR request more than once per page load/issue.
    if (run === issue) {
        injectOrUpdateJiraStatus();
        return;
    }
    run = issue;

    var url = 'https://adespresso.atlassian.net/rest/api/latest/issue/' + issue + '?fields=status,summary';
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: injectOrUpdateJiraStatus,
    });
}

(function () {
    waitForKeyElements(".current-branch:contains('AAPP'),h1:contains('AAPP')", main);
})();

