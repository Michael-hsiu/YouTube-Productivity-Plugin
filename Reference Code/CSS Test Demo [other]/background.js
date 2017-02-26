// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var titleCount = 0;

// Update titleCount using content.js

// REDDER CSS
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});



// MESSAGE SENDING
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
	// response holds content.js message
	// sender holds info about info about tab sending info to this script
	// sendResponse sends response back to content.js, if needed
	
	if (response[1] == 10) {
		titleCount++;
		//alert(titleCount);
	}

	if (titleCount % 5 == 0) {
		//alert("You have been watching " + titleCount + " videos!");
	}
});