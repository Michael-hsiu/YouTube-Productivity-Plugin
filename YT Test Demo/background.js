

// Receives message from content script to close tab when user clicks on button
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
	// response holds content.js message
	// sender holds info about info about tab sending info to this script
	// sendResponse sends response back to content.js, if needed

	if (response == "closeTab") {
		
		/** Close ALL currently open YouTube tabs */
		// Get the current active tab
    	chrome.tabs.query({}, function(tabs) {
    		var substring = "youtube.com";

    		// Close all YouTube tabs
    		for (i = 0; i < tabs.length; i++) {
    			if (tabs[i].url.includes(substring)) {
					chrome.tabs.remove(tabs[i].id);
    			}
    		}

			//var current = tabs[0];
			// Close current active tab
			//chrome.tabs.remove(current.id);
		});

		/*chrome.tabs.query({},function(tabs) {     
    		console.log("\n/////////////////////\n");
    		tabs.forEach(function(tab){
      			console.log(tab.url);
    		});
 		});*/

		/*// Closes all YouTube tabs
		chrome.tabs.query({}, function (tabs) {
    		for (var i = 0; i < tabs.length; i++) {
       			if (tabs[i].url.indexOf(substring) !== -1) {
					chrome.tabs.remove(tabs[i].id);
    			}
    		}
		});*/

		/*// Closes all tabs [WORKS]
		chrome.tabs.query({}, function (tabs) {
    		for (var i = 0; i < tabs.length; i++) {
       		 chrome.tabs.remove(tabs[i].id);
    		}
		}); */
	}
});




/*// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	// No tabs or host permissions needed!
	console.log('Turning ' + tab.url + ' red!');
	chrome.tabs.executeScript({
		code: 'document.body.style.backgroundColor="red"'
	}); 



});*/

/*
	var activeTabId;

	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		activeTabId = tabs[0];
	});
	chrome.tabs.remove(activeTabId);

  	chrome.tabs.getSelected(null, function(tab) {
    	chrome.tabs.remove(tab.id);
  	});
*/