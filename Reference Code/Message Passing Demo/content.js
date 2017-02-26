//chrome.runtime.sendMessage("Hi!");
var title = document.getElementsByTagName('title')[0].innerText;
var titleCount = 0;

if (title != null) {
	titleCount++;
	chrome.runtime.sendMessage(titleCount);
}

