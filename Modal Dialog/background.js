// Receives message from content script to close tab when user clicks button
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
	if (response == "closeTab") {
		// Get the current active tab
    	chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
			// Close current active tab
			var current = tabs[0];
			chrome.tabs.remove(current.id);
		});
	} else if (response == "buttonStyle") {
		chrome.tabs.insertCSS(tab.id, {
			file: "buttonStyle.css"
		});
	}
});

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
	if (response == "STYLES") {
		console.log('Turning ' + tab.url + ' red!');
  		chrome.tabs.executeScript({
    		code: 'document.body.style.backgroundColor="red"'
  		});
	}
});




chrome.browserAction.onClicked.addListener(function(tab) {
	// Insert the clear black layer
	chrome.tabs.insertCSS(tab.id, {
		file: "buttonStyle.css"
	});
});
