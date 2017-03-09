
/** MAIN */

var videoCount = 0;     // Total video count (all time)
var lastMsgIndex;       // Index of last displayed message (not working)
var videoRatio;		    // Message is displayed every this number of videos


// Logic that detects entering a new YouTube video watch page
(document.body || document.documentElement).addEventListener('transitionend',
    function (event) {
        if (event.propertyName === 'width' && event.target.id === 'progress') {
            navigatedToNewPage();
        }
    }, true);

// After the new page is loaded
navigatedToNewPage();


/** METHODS */

function setDifficulty (data) {

    // Returns easy, medium, or hard
    var diff = data.difficulty;

    if (diff === 'easy') {
        videoRatio = 10;
    } else if (diff === 'medium') {
        videoRatio = 5;
    } else {
        videoRatio = 3;
    }

}

/*function handleVideoCount(data) {
    var vidCount = data.totalVideoCount;

    // Increment total videos watched (local storage)
    vidCount += 1;

    // Store total videos watched in local storage
    chrome.storage.sync.set({totalVideoCount: vidCount});

    return vidCount;
}*/

// Randomly generates an integer
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function storageStatus() {
    //alert("videoCount inside: " + videoCount);
}



/** CHROME STORAGE ACCESS */

// Gets the difficulty and creates video counter.
chrome.storage.sync.get('difficulty', setDifficulty);

// Called on movement to new page
function navigatedToNewPage() {

    // Gets the difficulty
    chrome.storage.sync.get({totalVideoCount: 0}, function (data) {

        totalVideoCount = data.totalVideoCount;

        // Check if YouTube page
        if ('/watch' === location.pathname) {
            // Increment storage video count
            totalVideoCount++;
        }

        // Set the new video count
        chrome.storage.sync.set({totalVideoCount: totalVideoCount}, function() {
            console.log("Video count incremented!");

            //alert(totalVideoCount);

            videoCount = totalVideoCount;

            // If we're on a YouTube video page...
            if ('/watch' === location.pathname) {

                // Get video count using explicit callbacks [not working]
                //videoCount = chrome.storage.sync.get({totalVideoCount: 0}, handleVideoCount);

                //alert("videoCount outside: " + videoCount);

                // [DEBUG] Groups messages in console
                console.group();
                console.log(videoCount + " videos watched!");
                console.groupEnd();

                //if (videoCount % videoRatio == 0) {
                if (videoCount >= 0) {
                    //alert("THIS IS VIDEOCOUNT: " + videoCount);

                    /************************************** CREATING THE UI **************************************/

                    // Programmatically creates the UI that occurs every time videoRatio is reached.

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
                        "margin: auto;" +
                        "position: fixed; " +
                        "left: -15px; " +
                        "opacity: 1");

                    messageParentDiv.style.alignSelf = "center";

                    // Create a div to hold div containing messageText
                    var messageDivContainer = document.createElement("div");

                    // Create div for span containing messageText
                    var messageDiv = document.createElement("div");
                    messageDiv.setAttribute("style",
                        "text-align: center; " +
                        "padding: 35px; ");
                    messageDiv.style.alignSelf = "center";

                    // Create text span for messageText
                    var messageTextSpan = document.createElement("span");
                    messageTextSpan.style.alignSelf = "center";

                    // Create the messageText (initially empty)
                    var messageText = document.createElement("strong");


                    /**************************** GETTING A MESSAGE TO DISPLAY ****************************/

                    // Assign random message (more of just in case they find a way to bypass extension and don't close tab)
                    /** RANDOM MESSAGE GENERATOR */
                    chrome.storage.sync.get('profaneMsgStatus', function (data) {

                        var profaneMsgStatus = data.profaneMsgStatus;       // Get a local var containing msg status bool

                        var index = 0;          // Default message index
                        var notifMsgs;          // A pointer for our local msg array

                        /** POTENTIAL MESSAGES */

                        var profaneNotifications = [
                            "You've been watching too many videos! Your laziness ain't helping nobody. Get your shit together.",
                            "... really? Fuck your bullshit. Get to work, asshat.",
                            "You're lazy. How does it feel? Is this what you want to be forever? Can't say I expected much better.",
                            "Ain't nobody gonna hold your hand in this tough world. Start busting ass and taking names now.",
                            "Life ain't all sunshines and YouTube. Take the pledge to better yourself.",
                            "Thought is nothing. Execution is everything. Close this fucking tab.",
                            "Get moving. Whether that's in the mind or body, just get moving."
                        ];

                        var cleanNotifications = [
                            "You've been watching too many videos! Your laziness ain't helping nobody. Get it together.",
                            "This ain't the way to go. Get off your bum.",
                            "You're lazy. How does it feel? Is this what you want to be forever? Can't say I expected much better.",
                            "Ain't nobody gonna hold your hand in this tough world. Start working hard now before it's too late.",
                            "Life ain't all sunshines and YouTube. Take the pledge to better yourself.",
                            "Thought is nothing. Execution is everything. Close the tab.",
                            "Get moving. Whether that's in the mind or body, just get moving."
                        ];

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
                        messageText.style.fontSize = "80px";
                        messageText.style.fontStyle = "italic";
                        messageText.style.fontWeight = "900";
                        messageText.style.position = "fixed";
                        messageText.style.color = "black";
                        messageText.style.top = "180px";        // Distance from top
                        messageText.style.alignSelf = "parent";
                        messageText.style.textOverflow = "ellipsis";

                    });

                    console.log("LAST INDEX OUTSIDE CALL: " + lastMsgIndex);


                    /** ORGANIZING MESSAGE + BUTTON HIERARCHY */

                        // Create break element
                    var breakElement = document.createElement("br");
                    breakElement.style.alignSelf = "center";

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


                    /** Get a random button response */

                    var buttonResponses = [
                        "True that.",
                        "Got it.",
                        "Aw, snap...",
                        "Dang."
                    ];

                    // Generate random button response
                    var buttonText = buttonResponses[getRandomInt(0, buttonResponses.length)];

                    // Create button with that button response
                    var textNode = document.createTextNode(buttonText);
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
                    //button.style.transition = "opacity 8s";



                    // Add button to button div
                    buttonDiv.appendChild(button);

                    // Add all divs to page
                    document.body.appendChild(backgroundDiv);		// Background layer
                    document.body.appendChild(messageParentDiv);    // Message layer
                    document.body.appendChild(buttonDiv);           // Button layer

                    // Fade the button in
                    //fadeIn();

                    button.onmouseover = function () {
                        mouseOver()
                    };
                    button.onmouseout = function () {
                        mouseOut()
                    };

                    /** BUTTON INTERACTION METHODS */

                    /*function fadeIn() {
                        // Reference: http://xahlee.info/js/js_fadeout.html
                        alert("OPACITY: " + messageText.style.opacity);

                        while (messageText.style.opacity < 1) {
                            var o = messageText.style.opacity;
                            o += 0.1;
                            messageText.style.opacity = o.toFixed(2);

                            //messageText.style.opacity = messageText.style.opacity + 0.9;
                            setTimeout(fadeIn, 60);
                        }
                        alert("COMPLETE");

                    }*/

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
    });
}







