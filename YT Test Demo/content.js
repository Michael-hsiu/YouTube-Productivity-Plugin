/** I want this extension to monitor how many videos one has watched in a row,
 *  and how long someone has watched videos that day / week/ month / all time.
 *
 *  Pressing the extension button will show a bar graph with video watching
 *  goals, hours watched, and video watch history based on keywords (to come later).
 */

//alert('New page!');
//document.write(100);
var videoCount = 0;
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



// Gets the difficulty
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
    // Gets the difficulty
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

        if ('/watch' === location.pathname) {
            //alert('Watch page!');

            // Increment total videos watched
            videoCount++;

            // Groups messages in console
            console.group();
            console.log(videoCount + " videos watched!");
            console.groupEnd();

            // Alert every 5 videos watched
            //if (videoCount % videoRatio == 0) {
            if (videoCount >= 0) {
                //alert("VIDEO RATIO: " + videoRatio);
                //alert("You have watched " + videoCount + " videos!");

                /** HTML DOM Content */

                // Create background black layer (partially opaque)
                wrapperDiv = document.createElement("div");
                wrapperDiv.setAttribute("style", "position: fixed; width: 800px; height: 1500px; left: 0px; " +
                    "top: 0px; background-color: rgb(0, 0, 0); opacity: 0.95; z-index: 9999; width: 100%;");


                // Container div for text content (currently set so you can't see it)
                modalDialogParentDiv = document.createElement("div");	// Create the parent div
                modalDialogParentDiv.setAttribute("style", "position: fixed; opacity: 1; z-index: 10000; " +
                    "overflow: auto; top: 200px; ");
                modalDialogParentDiv.style.position = "fixed";		// Div follows scrolling
                modalDialogParentDiv.style.alignSelf = "center";


                modalDialogSiblingDiv = document.createElement("div");
                //modalDialogSiblingDiv.style.position = "fixed";


                modalDialogTextDiv = document.createElement("div");
                modalDialogTextDiv.setAttribute("style", "text-align: center; padding: 35px");
                modalDialogTextDiv.style.alignSelf = "center";
                //modalDialogTextDiv.style.position = "fixed";


                modalDialogTextSpan = document.createElement("span");
                modalDialogText = document.createElement("strong");

                index = getRandomInt(0, profaneNotifications.length);			// Set preliminary message index

                console.log("LAST INDEX: " + lastMsgIndex);
                console.log("INDEX: " + index);

                while (index == lastMsgIndex) {
                    index = getRandomInt(0, profaneNotifications.length);		// Reroll if you get the same message index as last time
                }

                console.log("NEW INDEX: " + index);

                lastMsgIndex = index;									// Prevent same message appearing consecutively

                // Assign random message (more of just in case they find a way to bypass extension and don't close tab)
                chrome.storage.sync.get('profaneMsgStatus', function(data) {
                    profaneMsgStatus = data.profaneMsgStatus;

                    if (profaneMsgStatus == true) {
                        modalDialogText.innerHTML = profaneNotifications[index];
                    } else {
                        modalDialogText.innerHTML = cleanNotifications[index];
                    }
                });


                modalDialogText.style.alignSelf = "center";
                modalDialogText.style.fontSize = "80px";
                modalDialogText.style.fontStyle = "italic";
                modalDialogText.style.fontWeight = "900";
                modalDialogText.style.position = "fixed";
                modalDialogText.style.color = "#ff0000";
                modalDialogText.style.top = "180px";        // Distance from top


                //imageElement = document.createElement("img");
                //imageElement.src = chrome.extension.getURL("stop.jpg");
                //imageElement.style.position = "fixed";

                breakElement = document.createElement("br");
                //btn = document.createElement("BUTTON");
                //t = document.createTextNode("Click me");
                //btn.appendChild(t);
                //btn.setAttribute("top: 500px");


                modalDialogTextSpan.appendChild(modalDialogText);
                //modalDialogTextSpan.appendChild(btn);

                // Try creating a button
                /*button = document.createElement("button");
                button.className = "modalButton";
                button.style.color = "red";
                button.style.fontSize = "x-large";
                button.style.fontFamily = "Impact,Charcoal,sans-serif";
                button.style.backgroundColor = "#4CAF50";*/

                modalDialogTextDiv.appendChild(modalDialogTextSpan);

                //modalDialogTextDiv.appendChild(imageElement);

                modalDialogTextDiv.appendChild(breakElement);
                modalDialogTextDiv.appendChild(breakElement);
               //modalDialogTextDiv.appendChild(button);			// Add the button

                //modalDialogTextDiv.appendChild(imageElement);

                modalDialogSiblingDiv.appendChild(modalDialogTextDiv);
                //modalDialogParentDiv.appendChild(btn)
                modalDialogParentDiv.appendChild(modalDialogSiblingDiv);


                // Button div (same lvl as modalParentDiv)
                buttonDiv = document.createElement("div");
                buttonDiv.setAttribute("style", "margins: auto; text-align: center; z-index: 10000");

                // Try creating a button
                button = document.createElement("button");
                t = document.createTextNode("True that.");
                button.appendChild(t);

                button.setAttribute("style", "position: fixed; bottom: 15%; z-index: 20000; text-align: center;" +
                    "width: 300px; height: 150px; color: white; background-color: #ff0000; margin: auto; border: 3px solid white;" +
                    "left: 38%; font-size: 45px; box-shadow: 5px 5px grey;");

                button.style.fontWeight = "lighter";
                button.style.fontStyle = "italic";
                
                buttonDiv.appendChild(button);


                document.body.appendChild(wrapperDiv);		// Background layer
                document.body.appendChild(modalDialogParentDiv);
                document.body.appendChild(buttonDiv);

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

// YouTube detection logic
(document.body || document.documentElement).addEventListener('transitionend',
    function (/*TransitionEvent*/ event) {
        if (event.propertyName === 'width' && event.target.id === 'progress') {
            afterNavigate();
        }
    }, true);

// After page load
afterNavigate();


// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == button) {
        console.log("CLICKED");
        //modalDialogText.style.color = "magenta";
        //wrapperDiv.style.display = "none";
        //modalDialogParentDiv.style.display = "none";
        chrome.runtime.sendMessage("closeTab");		// Send message to background script
    }
}