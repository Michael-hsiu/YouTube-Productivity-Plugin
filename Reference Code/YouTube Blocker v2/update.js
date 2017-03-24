// Find first h1 element
var htmlElement = document.getElementsByTagName("h1")[0];

chrome.storage.sync.get({
        totalVideoCount: 0
        }, function (data) {
            // Get total video count
            totalVideoCount = data.totalVideoCount;
			htmlElement.innerHTML = "You watched " + totalVideoCount + " videos today.";
		});