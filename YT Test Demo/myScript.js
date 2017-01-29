/** I want this extension to monitor how many videos one has watched in a row,
 *  and how long someone has watched videos that day / week/ month / all time.
 *  
 *  Pressing the extension button will show a bar graph with video watching 
 *  goals, hours watched, and video watch history based on keywords (to come later).
 */

//alert('New page!');
//document.write(100);
var videoCount = 0;



function afterNavigate() {
	/** Sometimes registers as 1 or 2 videos watched. 
	  * Registers as 2 videos if re-navigating from YT home page.
	  * Registers as 0 videos if manually navigating from suggested at the end of video.
	  * Registers as 0 or 1 video if autoplaying.
	  */
    if ('/watch' === location.pathname) {
        //alert('Watch page!');

		// Increment total videos watched
		videoCount++;

		// Groups messages in console
        console.group();
		console.log(videoCount + " videos watched!");
		console.groupEnd();

		// Alert every 5 videos watched
		//if (videoCount % 5 == 0) {
		if (videoCount >= 0) {
			//alert("You have watched " + videoCount + " videos!");

			// Create overlay dialog
			wrapperDiv = document.createElement("div");
			//wrapperDiv.setAttribute("style","position: relative; background-color: rgb(0,0,0); opacity: 0.5; z-index: 2000; height: 100%; width: 100%;");
			wrapperDiv.setAttribute("style","position: absolute; left: 0px; top: 0px; background-color: rgb(0, 0, 0); opacity: 0.5; z-index: 2000; height: 10000px; width: 10000px;");

			iframeElement = document.createElement("iframe");
			iframeElement.setAttribute("style","width: 100%; height: 100%;");

			wrapperDiv.appendChild(iframeElement);

			modalDialogParentDiv = document.createElement("div");
			modalDialogParentDiv.setAttribute("style","position: absolute; width: 800px; border: 1px solid rgb(51, 102, 153); padding: 10px; background-color: rgb(255, 255, 255); z-index: 2001; overflow: auto; text-align: center; top: 149px; left: 200px");

			modalDialogSiblingDiv = document.createElement("div");

			modalDialogTextDiv = document.createElement("div"); 
			modalDialogTextDiv.setAttribute("style" , "text-align:center");

			modalDialogTextSpan = document.createElement("span"); 
			modalDialogText = document.createElement("strong"); 
			modalDialogText.innerHTML = "You've been watching too many videos!";

			imageElement = document.createElement("img"); 
			imageElement.src = chrome.extension.getURL("stop.jpg");

			breakElement = document.createElement("br"); 
		    btn = document.createElement("BUTTON");
    		t = document.createTextNode("CLICK ME");
    		btn.appendChild(t);


			modalDialogTextSpan.appendChild(modalDialogText);
			modalDialogTextDiv.appendChild(modalDialogTextSpan);
			modalDialogTextDiv.appendChild(breakElement);
			modalDialogTextDiv.appendChild(breakElement);

			modalDialogTextDiv.appendChild(imageElement);

			modalDialogSiblingDiv.appendChild(modalDialogTextDiv);
    		//modalDialogParentDiv.appendChild(btn)
			modalDialogParentDiv.appendChild(modalDialogSiblingDiv);

			document.body.appendChild(wrapperDiv);
			document.body.appendChild(modalDialogParentDiv);

			// When the user clicks anywhere outside of the modal, close it
			window.onclick = function(event) {
    		if (event.target == imageElement) {
    			wrapperDiv.style.display = "none";
        		modalDialogParentDiv.style.display = "none";
    }
}
		}
    }
}



(document.body || document.documentElement).addEventListener('transitionend',
  function(/*TransitionEvent*/ event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        afterNavigate();
    }
}, true);
// After page load
afterNavigate();