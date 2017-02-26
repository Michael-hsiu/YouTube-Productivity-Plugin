/** I want this extension to monitor how many videos one has watched in a row,
 *  and how long someone has watched videos that day / week/ month / all time.
 *
 *  Pressing the extension button will show a bar graph with video watching
 *  goals, hours watched, and video watch history based on keywords (to come later).
 */

(function (document, runtime) {
var videoCount;
var lastMsgIndex;
var videoRatio;		// How many videos watched before notification


// Potential messages
profaneNotifications = [];
profaneNotifications.push("You've been watching too many videos! Your laziness ain't helping nobody. Get your shit together.");
profaneNotifications.push("Fuck your bullshit. Lazy shitter. Get off your ass.");
profaneNotifications.push("You're lazy. Do you want to be?");
profaneNotifications.push("Ain't nobody gonna hold your hand in this tough world. Start busting ass and taking names before you die.");
profaneNotifications.push("Life ain't all sunshines and YouTube. Take the pledge to better yourself.");
profaneNotifications.push("Thought is nothing. Execution is everything. Close this fucking tab.");
profaneNotifications.push("Get moving. Whether that's in the mind or body, just get moving.");

cleanNotifications = [];
cleanNotifications.push("You've been watching too many videos! Your laziness ain't helping nobody. Get it together.");
cleanNotifications.push("This ain't the way to go. Get off your bum.");
cleanNotifications.push("You're lazy. Do you want to be?");
cleanNotifications.push("Ain't nobody gonna hold your hand in this tough world. Start working hard now before it's too late.");
cleanNotifications.push("Life ain't all sunshines and YouTube. Take the pledge to better yourself.");
cleanNotifications.push("Thought is nothing. Execution is everything. Close the tab.");
cleanNotifications.push("Get moving. Whether that's in the mind or body, just get moving.");


// Asynchronous calls can be tricky! (chrome.storage.sync especially)
function afterNavigate() {

	// Gets the difficulty
	chrome.storage.sync.get({
		difficulty: "medium", 
		totalVideoCount: 0
		}, function (data) {
			// Returns easy, medium, or hard
			diff = data.difficulty;
			totalVideoCount = data.totalVideoCount;
			alert("NO VIDEOCOUNT CHANGE!: " + totalVideoCount);

			if ('/watch' === location.pathname) {

					// Increment storage video count
					totalVideoCount++;

					// Set the new video count
					chrome.storage.sync.set({
						totalVideoCount: totalVideoCount
					}, function() {
						console.log("Video count incremented!");
						alert("YT VIDEO COUNTED!: " + totalVideoCount);

						if (diff === 'easy') {
							videoRatio = 10;
						} else if (diff === 'medium') {
							videoRatio = 5;
						} else {
							videoRatio = 3;
						}

					videoCount = totalVideoCount + 1;   // Hardcoded, not another async call

					// Groups messages in console
					console.group();
					console.log(videoCount + " videos watched!");
					console.groupEnd();

					// Alert every 'videoRatio' videos watched
					//if (videoCount % videoRatio == 0) {
					if (videoCount >= 0) {

						var frame = document.createElement('iframe'),
							frameStyleElement = document.createElement('link'),
							frameStyleHref = runtime.getURL('contentstyle.css'),
							documentVisibilityChangeEventName = 'visibilitychange',
							documentHiddenProperty = 'hidden',
							activeElement,
							extensionBaseURL = 'chrome-extension://' + runtime.id,
							frameTransitionDuration = 500;

					    // Inject the frame styles programmatically in order to avoid flickering:
					    frameStyleElement.href = frameStyleHref;
					    frameStyleElement.rel = 'stylesheet';
					    document.querySelector('head').appendChild(frameStyleElement);

					    // Set up the listener first to ensure all messages are received:
					    //runtime.onMessage.addListener(messageHandler);

					    // Configure the frame:
					    frame.id = 'extension-invasive-kanji-coversheet';
					    frame.src = runtime.getURL('framecontent.html');	// HTML accesses its stylesheet at runtime!

					    // Explicitly set border width to avoid flashing of the iframe:
					    frame.style.borderWidth = 0;


					    /*// Add text
					    frameBody = document.createElement("BODY");
					    var textDiv = document.createElement("DIV");
					    textDiv.textContent = "HIIIIIIIIII DIV TEXT CONTENT";
					    
					    // Add button
					    var button = document.createElement("BUTTON");
				    	button.textContent = "CLICK MEE THO!";

				    	// Add elements to background
				    	frameBody.appendChild(textDiv);
				    	frameBody.appendChild(button);

				    	// Add parent elements to the document
						frame.appendChild(textDiv);
						//frame.appendChild(frameBody);		// Add body to the iFrame */

				    	document.body.appendChild(frame);	// The "flash" effect is added

					    console.log("END SCRIPT");


						/*function clickHandler(){ // declare a function that updates the state
						  alert("AIYAH");
						}*/

						//var element = document.getElementById('info'); // grab a reference to your element
						//console.log(element.innerHTML);
						//element.addEventListener('click', clickHandler); // associate the function above with the click event


						/*/ UI functions
						button.onmouseover = function() {mouseOver()};
						button.onmouseout = function() {mouseOut()};

						function mouseOver() {
							button.style.backgroundColor = "#E80C7A";
							button.style.fontWeight = "bolder";
							button.style.fontStyle = "italic";
						}

						function mouseOut() {
							button.style.backgroundColor = "#ff0000";
							button.style.fontWeight = "lighter";
							button.style.fontStyle = "italic";
						}
						
						

						// When the user clicks anywhere outside of the modal, close it
						window.onclick = function (event) {
							var x = document.getElementById("test");
							alert("CLICK DETECTED");
							if (event.target == x) {
								alert("CLICKED");
								chrome.runtime.sendMessage("closeTab");     // Send message to background script
							}
						}*/

						// RNG for string message array
						function getRandomInt(min, max) {
							min = Math.ceil(min);
							max = Math.floor(max);
							return Math.floor(Math.random() * (max - min)) + min;
						}
					}
				})
			}
		}
	);
}


// YouTube detection logic
(document.body || document.documentElement).addEventListener('transitionend',
	function (/*TransitionEvent*/ event) {
		if (event.propertyName === 'width' && event.target.id === 'progress') {
			afterNavigate();
		}
	}, true);


// After page load
afterNavigate();

}(document, chrome.runtime));



