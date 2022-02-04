/**
 This code is mainly based on the work of Alexander Linder,
 with his project "KIT Ilias OpenCast Downloader", https://github.com/SeineEloquenz/kit-ilias-opencast-downloader:
 
 KIT Ilias OpenCast Downloader - a browser extension to simplify downloading videos from the KIT Ilias system
 Copyright (C) 2020-present Alexander Linder
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
 Home: https://github.com/SeineEloquenz/kit-ilias-opencast-downloader
 
 minor changes were made to port it to iPadOS/iOS/macOS by Philipp Lepold
 Home: https://github.com/ilteen/kit-ilias-opencast-downloader
 */

const url = window.location.href;
const matchPattern = new RegExp('.*&cmd=streamVideo.*');
let videoURL = "";
let title = "";

//check for messages from the background.js script requesting to download the video
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request['name'] === "download") {
        downloadURL(videoUrl, title)
    }
});

if (matchPattern.test(url)) {
    if (document.readyState !== 'loading' ) {
        console.log('ready');
        setTimeout(run, 100);
    } else {
        console.log('loading');
        document.addEventListener('DOMContentLoaded', run);
    }
} else {
    console.log('no recording');
}

function run() {
    let paellaContent = document.body.childNodes[9].text;
    let paella = paellaContent.substring(25, paellaContent.length - 3).split(",\n\t")[0];
    let paellaJson = JSON.parse(paella);
    videoUrl = paellaJson.streams[0].sources.mp4[0].src;
    title = paellaJson.metadata.title;
    let mimetype = paellaJson.streams[0].sources.mp4[0].mimetype;
    let fileExtension = mimetype.split("/")[1];
    if (!title.endsWith(fileExtension)) {
        title = title + "." + fileExtension;
    }
    console.log("ready");
}

function downloadURL(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}
