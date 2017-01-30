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

			// Create background black layer
			wrapperDiv = document.createElement("div");
			wrapperDiv.setAttribute("style","position: absolute; left: 0px; top: 0px; background-color: rgb(0, 0, 0); opacity: 0.95; z-index: 2000; height: 10000px; width: 10000px;");

			// CSS test
			//wrapperDiv.className = "wrapperDiv";	// Possibly try w/ background script?

			// Create iFrame (not needed)
			//iframeElement = document.createElement("iframe");
			//iframeElement.setAttribute("style","width: 100%; height: 100%;");

			//wrapperDiv.appendChild(iframeElement);

			modalDialogParentDiv = document.createElement("div");
			modalDialogParentDiv.setAttribute("style","position: absolute; width: 800px; border: 1px solid rgb(51, 102, 153); padding: 10px; background-color: rgb(255, 255, 255); z-index: 2001; overflow: auto; text-align: left; top: 80px; left: 100px");
			modalDialogParentDiv.style.position = "fixed";


			modalDialogSiblingDiv = document.createElement("div");
			//modalDialogSiblingDiv.style.position = "fixed";


			modalDialogTextDiv = document.createElement("div"); 
			modalDialogTextDiv.setAttribute("style" , "text-align:center");
			//modalDialogTextDiv.style.position = "fixed";


			modalDialogTextSpan = document.createElement("span"); 
			modalDialogText = document.createElement("strong"); 
			modalDialogText.innerHTML = "You've been watching too many videos! Your laziness ain't helping nobody. Get your shit together.";

			modalDialogText.style.fontSize = "80px";
			modalDialogText.style.fontStyle = "italic";
			modalDialogText.style.fontWeight = "900";
			modalDialogText.style.position = "fixed";
			modalDialogText.style.color = "#ff0000";


			imageElement = document.createElement("img"); 
			imageElement.src = chrome.extension.getURL("stop.jpg");
			//imageElement.style.position = "fixed";

			breakElement = document.createElement("br"); 
		    btn = document.createElement("BUTTON");
    		t = document.createTextNode("Click me");
    		btn.appendChild(t);


			modalDialogTextSpan.appendChild(modalDialogText);
			modalDialogTextDiv.appendChild(modalDialogTextSpan);
			//modalDialogTextDiv.appendChild(breakElement);
			//modalDialogTextDiv.appendChild(breakElement);

			//modalDialogTextDiv.appendChild(imageElement);

			modalDialogSiblingDiv.appendChild(modalDialogTextDiv);
    		//modalDialogParentDiv.appendChild(btn)
			modalDialogParentDiv.appendChild(modalDialogSiblingDiv);

			document.body.appendChild(wrapperDiv);		// Background layer
			document.body.appendChild(modalDialogParentDiv);

			document.body.appendChild(btn);

			/*// Get current tabID
			var activeTabId;
			//doInCurrentTab( function(tab){ activeTabId = tab.id } );

			chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  				activeTabId = tabs[0];
			});

			chrome.tabs.insertCSS(activeTabId, {
				file: "dom.css"
			}); */

			// When the user clicks anywhere outside of the modal, close it
			window.onclick = function(event) {
	    		if (event.target == modalDialogText) {
	    			//modalDialogText.style.color = "magenta";
	    			wrapperDiv.style.display = "none";
	        		modalDialogParentDiv.style.display = "none";
	        		chrome.runtime.sendMessage("closeTab");		// Send message to background script
	        		
				}
			}
		}
    }
}


// YouTube detection logic
(document.body || document.documentElement).addEventListener('transitionend',
  function(/*TransitionEvent*/ event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        afterNavigate();
    }
}, true);

// After page load
afterNavigate();