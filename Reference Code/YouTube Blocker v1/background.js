/** MAIN */

// Holds info about closing all tabs
var closeAllGlobal;

// Set listener for button click
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {

	// Should we close all tabs? Chooses and executes correct tab closure function.
	chrome.storage.sync.get('closeAll', chooseTabFunction);

});


/** METHODS */

function chooseTabFunction (data) {

	// Set tab closure status
	closeAllGlobal = data.closeAll;

	// Either close all YouTube tabs...
	//alert(closeAllGlobal);
	if (closeAllGlobal == true) {

		// Close all tabs
		chrome.tabs.query({}, closeAllTabs);

	// ... or only close the current YouTube tab
	} else {

		// Close current tab
		chrome.tabs.query({ currentWindow: true, active: true }, closeCurrentTab);
	}
}


function closeAllTabs (tabs) {

	var substring = "youtube.com";

	// Close all YouTube tabs
	for (i = 0; i < tabs.length; i++) {
		if (tabs[i].url.includes(substring)) {
			chrome.tabs.remove(tabs[i].id);
		}
	}
}


function closeCurrentTab (tabs) {

	var current = tabs[0];

	// Close current active tab
	chrome.tabs.remove(current.id);
}



