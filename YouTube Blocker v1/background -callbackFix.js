// Receives message from content script to close tab when user clicks on button
// @param response: holds content.js message
// @param sender: holds info about info about tab sending info to this script
// @param sendResponse: sends response back to content.js, if needed

// Holds info about closing all tabs
var closeAllGlobal;

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {

	// Should we close all tabs? Chooses and executes correct tab closure function.
	chrome.storage.sync.get('closeAll', chooseTabFunction);

});


/** METHODS */

function chooseTabFunction (data) {

	// Set tab closure status
	closeAllGlobal = data.closeAll;

	// Either close all YouTube tabs...
	alert(closeAllGlobal);
	if (closeAllGlobal == true) {

		// Close all tabs
		chrome.tabs.query({}, closeAllTabs);

	// ... or only close the current YouTube tab
	} else {

		// Close current tab
		chrome.tabs.query({ currentWindow: true, active: true }, closeCurrentTab);
	}
}


function closeAllTabs(tabs) {

	var substring = "youtube.com";

	// Close all YouTube tabs
	for (i = 0; i < tabs.length; i++) {
		if (tabs[i].url.includes(substring)) {
			chrome.tabs.remove(tabs[i].id);
		}
	}
}


function closeCurrentTab(tabs) {

	var current = tabs[0];

	// Close current active tab
	chrome.tabs.remove(current.id);
}



