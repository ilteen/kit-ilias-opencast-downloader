/**
 KIT Ilias OpenCast Downloader iPadOS/iOS/macOS - a browser extension to simplify downloading videos from the KIT Ilias system
 Copyright (C) 2022-present Philipp Lepold
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see {http://www.gnu.org/licenses/}.
 Home: https://github.com/ilteen/kit-ilias-opencast-downloader
 */

//create the context menu (right click) "Download OpenCast Video" entry
if (!iOS()) {
    browser.contextMenus.create({
      id: "id_download",
      title: "Download OpenCast Video",
      contexts: ["all"]
    });
}


//if browser extension icon is clicked, download video
browser.browserAction.onClicked.addListener(() => {
    downloadVideo()
});

//if browser extension context menu "Download OpenCast Video" entry is clicked, download video
if (!iOS()) {
    browser.contextMenus.onClicked.addListener((info, tab) => {
      switch (info.menuItemId) {
        case "id_download":
              downloadVideo()
          break;
      }
    });
}

function downloadVideo() {
    browser.tabs.query({
    currentWindow: true,
    active: true
    }).then((tabs) => {
        for (let tab of tabs) {
            browser.tabs.sendMessage(tab.id, {name: "download"})
        }
    });
}

function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
