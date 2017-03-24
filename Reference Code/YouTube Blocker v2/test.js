// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	var x = document.getElementById("test");
	alert("CLICK DETECTED");
	if (event.target == x) {
		alert("CLICKED");
		chrome.runtime.sendMessage("closeTab");     // Send message to background script
	}
}*/