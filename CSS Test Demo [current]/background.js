chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("INJECTED!");

	// Insert the clear black layer
	chrome.tabs.insertCSS(tab.id, {
		file: "black_layer.css"
	});
});


/*chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});*/

/*chrome.browserAction.onClicked.addListener(function(tab) {
	// Send a message to the active tab
	console.log("INJECTED!");
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var activeTab = tabs[0];
		chrome.tabs.insertCSS(activeTab.id, {
			file: "styles.css"
		});
		
	})
})*/