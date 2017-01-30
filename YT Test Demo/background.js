// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	// No tabs or host permissions needed!
	console.log('Turning ' + tab.url + ' red!');
	chrome.tabs.executeScript({
		code: 'document.body.style.backgroundColor="red"'
	});



});

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
	// response holds content.js message
	// sender holds info about info about tab sending info to this script
	// sendResponse sends response back to content.js, if needed

	if (response == "closeTab") {
		// Get the current active tab
    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			var current = tabs[0]
			// Close current active tab
			chrome.tabs.remove(current.id);
		});
	}
});





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