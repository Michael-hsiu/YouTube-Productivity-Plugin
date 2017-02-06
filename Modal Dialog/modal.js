
// Outer div; set attributes for the black underlying layer; follows scroll
wrapperDiv = document.createElement("div");
wrapperDiv.setAttribute("style","position: fixed; left: 0px; top: 0px; background-color: rgb(0,0,0); opacity: 0.5; z-index: 2000; height: 100%; width: 100%;");

// Not sure where this is...
iframeElement = document.createElement("iframe");
iframeElement.setAttribute("style","width: 100%; height: 100%; z-index: 3000");

// iFrame is added to the black div at some point
wrapperDiv.appendChild(iframeElement);


// This is the white rectangle that contains the text message
modalDialogParentDiv = document.createElement("div");
modalDialogParentDiv.setAttribute("style","position: fixed; width: 600px; border: 30px solid rgb(255, 255, 255); padding: 10px; background-color: rgb(255, 255, 255); z-index: 2001; overflow: auto; text-align: center; top: 0px; ");
modalDialogParentDiv.style.marginLeft = "auto";
modalDialogParentDiv.style.marginRight = "auto";

// Container for modalDialogTextDiv
modalDialogSiblingDiv = document.createElement("div");

// Nested div in siblingDiv
modalDialogTextDiv = document.createElement("div"); 
modalDialogTextDiv.setAttribute("style" , "text-align:center");

// <span> tag is used to group inline-elements in a document (e.g. to bold individual words, etc.); in this case, holds caption for img
modalDialogTextSpan = document.createElement("span"); 
modalDialogText = document.createElement("strong"); 
modalDialogText.innerHTML = "You've been watching too many videos!";

// Create a break element
breakElement = document.createElement("br");

// Create the image
imageElement = document.createElement("img"); 
imageElement.src = chrome.extension.getURL("spinner_progress.gif");

// Try creating a button
button = document.createElement("button");
//t = document.createTextNode("Click Me!");

// TEST: Getting text stored in chrome.storage [WORKS]
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
  	t = document.createTextNode(items.favoriteColor);
  	button.append(t);
  });
}

// Change button text to saved text
restore_options();


//button.appendChild(t);
button.className = "modalButton";		// For attempted CSS injectiion [NOT WORKING @runtime, works onBrowserAction] 
button.style.color = "red";
button.style.fontSize = "x-large";
button.style.fontFamily = "Impact,Charcoal,sans-serif";
button.style.backgroundColor = "#4CAF50";

// Add elements to span
modalDialogTextSpan.appendChild(modalDialogText);	// Add bold text to the span
modalDialogTextDiv.appendChild(breakElement);		// Add a line break after text
modalDialogTextDiv.appendChild(breakElement);		// Add a line break after text
modalDialogTextSpan.appendChild(modalDialogText);	// Add bold text to the span



// Add elements to nested div
modalDialogTextDiv.appendChild(modalDialogTextSpan);	// Add the span to the nested div
modalDialogTextDiv.appendChild(breakElement);			// Add a line break after text
modalDialogTextDiv.appendChild(breakElement);			// Add another line break

modalDialogTextDiv.appendChild(imageElement);			// Add the image
modalDialogTextDiv.appendChild(button);			// Add the button


// Add elements to sibling div
modalDialogSiblingDiv.appendChild(modalDialogTextDiv);

// Add elements to parent div
modalDialogParentDiv.appendChild(modalDialogSiblingDiv);

// Add black underlayer to page
document.body.appendChild(wrapperDiv);

// Add parent modal wrapper to page
document.body.appendChild(modalDialogParentDiv);


console.log("END OF SCRIPT");



/** HELPER FXNS (user interaction) -------------------------------------------------------------------------------------------- */



var loadfunction = window.onload;
window.onload = function() {
	// Apply CSS to button at runtime
	if (loadfunction) {
		chrome.runtime.sendMessage("STYLES");
		console.log("It's loaded!");
	}
}



// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == imageElement) {		// Hide dialog if clicked on image
    	wrapperDiv.style.display = "none";
        modalDialogParentDiv.style.display = "none";
    } else if (event.target == button) {
		chrome.runtime.sendMessage("closeTab");		// Send message to close dialog if clicked on button
    }
}

/*// When user clicks on the button, close the tab
window.onclick = function(event) {
    if (event.target == button) {
		chrome.runtime.sendMessage("closeTab");		// Send message to background script
	}
}


*/