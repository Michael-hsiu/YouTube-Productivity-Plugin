// Receives message from content script to close tab when user clicks on button
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {

	var closeAllGlobal;

	// Should we close all tabs?
	chrome.storage.sync.get('closeAll', function(data) {
			tabData = data.closeAll;
			closeAllGlobal = tabData;

		//alert("Close all tabs?: " + closeAllGlobal);
		// Either close all YouTube tabs...
		if (closeAllGlobal == true) {
			//alert("INSIDE IF");

			chrome.tabs.query({}, function(tabs) {		

				var substring = "youtube.com";

	    		// Close all YouTube tabs
	    		for (i = 0; i < tabs.length; i++) {
	    			if (tabs[i].url.includes(substring)) {
						chrome.tabs.remove(tabs[i].id);
	    			}
	    		}
			});

		// ... or only close the current YouTube tab
		} else {
			// Get the current active tab
			//alert("INSIDE ELSE");
			chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {		
				var current = tabs[0];
				// Close current active tab
				chrome.tabs.remove(current.id);
			});
		}
	});
});

var popupWindows = chrome.extension.getViews({type:'popup'});
if (popupWindows.length) { // A popup has been found
    // details is the object from the onMessage event (see 2)
    var videoCount = popupWindows[0].getElementById('video_count');
	videoCount.innerHTML = "Hi!";
}