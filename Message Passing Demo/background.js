chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
	// response holds content.js message
	// sender holds info about info about tab sending info to this script
	// sendResponse sends response back to content.js, if needed

	alert(response);
});