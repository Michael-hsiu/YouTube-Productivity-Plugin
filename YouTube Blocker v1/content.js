/** I want this extension to monitor how many videos one has watched in a row,
 *  and how long someone has watched videos that day / week/ month / all time.
 *
 *  Pressing the extension button will show a bar graph with video watching
 *  goals, hours watched, and video watch history based on keywords (to come later).
 */

var videoCount = 0;
var lastMsgIndex;
var videoRatio;		// How many videos watched before notification

// Potential messages
profaneNotifications = [];
profaneNotifications.push("You've been watching too many videos! Your laziness ain't helping nobody. Get your shit together.");
profaneNotifications.push("Fuck your bullshit. Lazy shitter. Get off your ass.");
profaneNotifications.push("You're lazy. Do you want to be?");
profaneNotifications.push("Ain't nobody gonna hold your hand in this tough world. Start busting ass and taking names now.");
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



// Gets the difficulty and creates video counter.
chrome.storage.sync.get('difficulty', function (data) {

	// Returns easy, medium, or hard
	diff = data.difficulty;
	if (diff === 'easy') {
		//alert('EASY!!');
		videoRatio = 10;
	} else if (diff === 'medium') {
		//alert('MEDIUM!!');
		videoRatio = 5;
	} else {
		//alert('HARD!!');
		videoRatio = 3;
	}

});

// Get our user-set difficulty and set the Options UI to those values.
chrome.storage.sync.get({

	'difficulty': 'medium',	// This string is value=""
	'closeAll': false,
	'profaneMsgStatus': false

}, function (items) {
	document.getElementById('difficulty').value = items.difficulty;
	document.getElementById('closeTabCheckbox').checked = items.closeAll;
	document.getElementById('profanityCheckbox').checked = items.profaneMsgStatus;

});


// Asynchronous calls can be tricky! (chrome.storage.sync especially)
function afterNavigate() {
	/** Sometimes registers as 1 or 2 videos watched.
	 * Registers as 2 videos if re-navigating from YT home page.
	 * Registers as 0 videos if manually navigating from suggested at the end of video.
	 * Registers as 0 or 1 video if autoplaying.
	 */

	// Gets the difficulty and sets videoRatio as appropriate.
	chrome.storage.sync.get('difficulty', function (data) {
		// Returns easy, medium, or hard
		diff = data.difficulty;

		if (diff === 'easy') {
			videoRatio = 10;
		} else if (diff === 'medium') {
			videoRatio = 5;
		} else {
			videoRatio = 3;
		}


		// If we're on a YouTube video page . . .
		if ('/watch' === location.pathname) {

			// Increment total videos watched (local storage)
			videoCount++;

			// Groups messages in console
			console.group();
			console.log(videoCount + " videos watched!");
			console.groupEnd();

			// Alert every 'videoRatio' videos watched
			//if (videoCount % videoRatio == 0) {
			if (videoCount >= 0) {
				//alert("VIDEO RATIO: " + videoRatio);
				//alert("You have watched " + videoCount + " videos!");

				/************************************** CREATING THE UI **************************************/

				// Programatically creates the UI that occurs every time videoRatio is reached.

				/** BACKGROUND */
				// Create background white layer (partially opaque)
				var backgroundDiv = document.createElement("div");
				backgroundDiv.setAttribute("style",
					"position: fixed; " +
					"width: 800px; " +
					"height: 1500px; " +
					"left: 0px; " +
					"top: 0px; " +
					"background-color: #ffffff; " +
					"opacity: 0.98; " +
					"z-index: 2100000000; " +
					"width: 100%;");

				/** MESSAGE + BUTTON */
				// Create the parent div
				var messageParentDiv = document.createElement("div");

				// Make div follow scrolling and set relative z-index on page
				messageParentDiv.setAttribute("style",
					"position: fixed; " +
					"opacity: 1; " +
					"z-index: 2100000001; " +
					"overflow: auto; " +
					"top: 200px; " +
					"position: fixed; " +
					"alignSelf: center");

				// Create a div to hold div containing messageText
				var messageDivContainer = document.createElement("div");

				// Create div for span containing messageText
				var messageDiv = document.createElement("div");
				messageDiv.setAttribute("style",
					"text-align: center; " +
					"padding: 35px; " +
					"alignSelf: center");

				// Create text span for messageText
				var messageTextSpan = document.createElement("span");

				// Create the messageText (initially empty)
				var messageText = document.createElement("strong");



				/*********************************** GETTING A MESSAGE TO DISPLAY ***********************************/

				// Assign random message (more of just in case they find a way to bypass extension and don't close tab)
				/** RANDOM MESSAGE GENERATOR */
				chrome.storage.sync.get('profaneMsgStatus', function(data) {

					var profaneMsgStatus = data.profaneMsgStatus;       // Get a local var containing msg status bool

					var index = 0;      // Default message index
					var notifMsgs;      // A pointer for our local msg array

					// Get a random message
					if (profaneMsgStatus == true) {
						index = getRandomInt(0, profaneNotifications.length);
						notifMsgs = profaneNotifications;

					} else {
						index = getRandomInt(0, cleanNotifications.length);
						notifMsgs = cleanNotifications;

					}

					// Generate new index if we get the same index as last time
					while (index == lastMsgIndex) {
						index = getRandomInt(0, profaneNotifications.length);
					}

					// Set the message text
					messageText.innerHTML = notifMsgs[index];

					// Prevent same message appearing consecutively
					lastMsgIndex = index;

					// Set messageText properties
					messageText.style.alignSelf = "center";
					messageText.style.fontSize = "80px";
					messageText.style.fontStyle = "italic";
					messageText.style.fontWeight = "900";
					messageText.style.position = "fixed";
					messageText.style.color = "black";
					messageText.style.top = "180px";        // Distance from top

				});

				console.log("LAST INDEX OUTSIDE CALL: " + lastMsgIndex);


				/** ORGANIZING MESSAGE + BUTTON HIERARCHY */

				// Create break element
				var breakElement = document.createElement("br");

                // Add messageText to text spawn
				messageTextSpan.appendChild(messageText);

                // Add text spawn to a div
				messageDiv.appendChild(messageTextSpan);

                // Insert break elements between message and button
				messageDiv.appendChild(breakElement);
				messageDiv.appendChild(breakElement);

                // Insert div into greater container
				messageDivContainer.appendChild(messageDiv);

                // Insert container into parent div
				messageParentDiv.appendChild(messageDivContainer);

				// Create button div
				var buttonDiv = document.createElement("div");
				buttonDiv.setAttribute("style",
                    "margins: auto; " +
                    "text-align: center; " +
                    "z-index: 2100000000");

				// Create button
				var button = document.createElement("button");
				var textNode = document.createTextNode("True that.");
				button.appendChild(textNode);

                // Adjust button properties
				button.setAttribute("style",
                    "position: fixed; " +
                    "bottom: 15%; " +
                    "z-index: 20000; " +
                    "text-align: center;" +
					"width: 300px; " +
                    "height: 150px; " +
                    "color: white; " +
                    "background-color: black; " +
                    "margin: auto; " +
                    "border: 3px solid white;" +
					"left: 38%; " +
                    "font-size: 45px; " +
                    "box-shadow: 5px 5px grey; " +
                    "z-index: 2100000001;");  // Background color was #ff0000

				button.style.fontWeight = "lighter";
				button.style.fontStyle = "italic";


                // Add button to button div
				buttonDiv.appendChild(button);

                // Add all divs to page
				document.body.appendChild(backgroundDiv);		// Background layer
				document.body.appendChild(messageParentDiv);    // Message layer
				document.body.appendChild(buttonDiv);           // Button layer



                /** BUTTON INTERACTION METHODS */

				button.onmouseover = function() {mouseOver()};
				button.onmouseout = function() {mouseOut()};

				// Change button colors on mouseOver
				function mouseOver() {
					button.style.backgroundColor = "white";  // Was #E80C7A
					button.style.color = "black";
					button.style.fontWeight = "bolder";
					button.style.fontStyle = "italic";
				}

				// Change button colors back on mouseOut
				function mouseOut() {
					button.style.backgroundColor = "black";     // Was #ff0000
					button.style.color = "white";
					button.style.fontWeight = "lighter";
					button.style.fontStyle = "italic";
				}

				// Send tab closure message to background script on button click
				window.onclick = function (event) {
					if (event.target == button) {
						chrome.runtime.sendMessage("closeTab");		// Send message to background script
					}
				}
			}
		}
	});
}


// RNG for string message array
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}



/**************************************   MAIN   **************************************/

// YouTube detection logic
(document.body || document.documentElement).addEventListener('transitionend',
	function (/*TransitionEvent*/ event) {
		if (event.propertyName === 'width' && event.target.id === 'progress') {
			afterNavigate();
		}
	}, true);

// After page load
afterNavigate();


