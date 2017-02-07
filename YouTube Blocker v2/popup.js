/*chrome.browserAction.onClicked.addListener(function(tab) {
	alert("CLICKED!");
	chrome.tabs.executeScript({
		file: 'update.js'
	});
});
*/
//alert("popup.js reached!");

chrome.browserAction.onClicked.addListener(function(tab) {
	var videoCount = document.getElementById('video_count');
	videoCount.innerHTML = "Hi!";
});