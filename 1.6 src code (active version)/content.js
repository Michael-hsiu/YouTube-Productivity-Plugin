/** References:
	For building JS UI with DOM: http://stackoverflow.com/questions/14423923/chrome-extension-modal-dialog-or-other-solution-to-notify-users
*/

/** VARIABLES */
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
var buttonResponses = [
    "True that.",
    "Got it.",
    "Aw, snap...",
    "Dang."
];
var videoCount = 0;     // Total video count (all time)
var oldUrl = null;
var currUrl = null;
var videoRatio = 1;		    // Message is displayed every this number of videos
var profaneMsgStatus = false;

/** METHODS */
// Logic that detects entering a new YouTube video watch page
function isEmpty(dict) {
    return (Object.keys(dict).length == 0);
}
function getVideoCount() {
    var promise = new Promise(function(resolve, reject)
    {
        // Check for existing video count in storage
        chrome.storage.sync.get("vidCountKey", function (data) {
            console.log("VIDCOUNT STORAGE: " + JSON.stringify(data));
            if (!isEmpty(data)) {
                console.log("USING STORAGE VIDCOUNT: " + data.vidCountKey);
                resolve(data.vidCountKey);
            } else {
                console.log("USING DEFAULT VIDCOUNT: 0");
                resolve(0);
            }
        });
    });
    return promise;
}
// Get URL before page was refreshed, if it exists.
function getUrlBeforeReload() {
    var promise = new Promise(function(resolve, reject) {
        // Check for existing video count in storage
        chrome.storage.sync.get("currUrlKey", function(data) {
            console.log("URL STORAGE_URL: " + JSON.stringify(data));
            if (!isEmpty(data)) {
                console.log("USING STORAGE URL: " + data.currUrlKey);
                resolve(data.currUrlKey);
            } else {
                console.log("USING DEFAULT URL: null");
                resolve(null);
            }
        });
    });
    return promise;
}
// Depends on difficulty
function getVideoRatio() {
    var promise = new Promise(function(resolve, reject)
    {
        // Check for existing video count in storage
        chrome.storage.sync.get("difficulty", function (data) {
            console.log("STORAGE: " + JSON.stringify(data));
            if (!isEmpty(data)) {
                console.log("STORAGE DIFFICULTY: " + data.difficulty);

                var diff = data.difficulty;
                var res;
                if (diff === 'easy') {
                    res = 10;
                } else if (diff === 'medium') {
                    res = 5;
                } else {
                    res = 3;
                }
                resolve(res);
                // resolve(data.difficulty);
            } else {
                console.log("USING DEFAULT VIDEORATIO: 5");
                resolve(5);     // Default difficulty for medium
                // resolve("medium");      // Default difficulty
            }
        });
    });
    return promise;
}
// Depends on difficulty
function getProfaneStatus() {
    var promise = new Promise(function(resolve, reject)
    {
        // Check for existing video count in storage
        chrome.storage.sync.get("profaneMsgStatus", function (data) {
            console.log("STORAGE PROFANE STATUS: " + JSON.stringify(data));
            if (!isEmpty(data)) {
                console.log("USING STORAGE PROFANE STATUS: " + data.profaneMsgStatus);
                resolve(data.profaneMsgStatus);
            } else {
                console.log("USING DEFAULT PROFANE STATUS: false");
                resolve(false);
            }
        });
    });
    return promise;
}
function onSetup() {
    // Dummy logic
    console.log("ON_SETUP");
    return 1;
}
function onError() {
    // Dummy logic
    console.log("ERROR!");
}
// Prevents accidentally counting YT home page
function isVideoPage() {
    return (window.location.pathname.startsWith("/watch"));
}
// Polls at interval to see if settings have changed.
function checkSettingsChanged() {
    setInterval(function() {
        Promise.resolve(1).then(function(data) {
            return getProfaneStatus();
        }).then(function(profStatus) {
            console.log("CHECK PROFANE STATUS: " + profStatus);
            if (profaneMsgStatus != profStatus) {
                console.log("NEW PROFANE STATUS: " + profStatus);
                profaneMsgStatus = profStatus;
            }
            return getVideoRatio();
        }).then(function(vidRatio) {
            console.log("CHECK VID RATIO: " + vidRatio);
            if (videoRatio != vidRatio) {
                console.log("NEW VID RATIO: " + vidRatio);
                videoRatio = vidRatio;
            }
            return getVideoCount();

        }).then(function(vidCount) {
            console.log("CHECK VID COUNT: " + vidCount);
            // Another tab may have updated video count, only accept value if it's greater than local value.
            if (vidCount > videoCount) {
                console.log("NEW VID COUNT: " + vidCount);
                videoCount = vidCount;
            }
        });
    }, 1000*5)
}
// Detects change in URL
function setupPollUrl() {
    setInterval(function() {
        var hRef = window.location.href;    // This is entire URL

        console.group("POLL_TEST");
        console.log("HREF: " + hRef);
        console.log("VIDEO_COUNT: " + videoCount);
        console.groupEnd();

        currUrl = hRef;
        // Check for no previous URL, or a change in URL
        if (!isVideoPage()) {
            console.log(currUrl + " not a valid /watch page URL!");
        }
        else if ((oldUrl === null || currUrl != oldUrl)) {
            console.log("URL_CHANGED: from " + oldUrl + " to " + currUrl);
            oldUrl = currUrl;
            videoCount++;   // We saw a new video

            // Store total videos watched in local storage
            chrome.storage.sync.set(
                {
                    vidCountKey: videoCount,
                    currUrlKey: currUrl
                },
                function() {
                    console.log("Setting storage vidcount: " + videoCount);
                    console.log("Setting storage URL: " + currUrl);
                }
            );
            onNewUrlDetected();     // UI generation logic

        } else {
            console.log("URL STAYED SAME: " + oldUrl + " to " + currUrl);
        }
    }, 2000)
}
// Randomly generates an integer
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
// Given a message, generate whole-screen UI for that message.
function createUI(msg) {
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

    // Set the message text
    messageText.innerHTML = msg;

    // Set messageText properties
    messageText.style.fontSize = "80px";
    messageText.style.fontStyle = "italic";
    messageText.style.fontWeight = "900";
    messageText.style.position = "fixed";
    messageText.style.color = "black";
    messageText.style.top = "180px";        // Distance from top
    messageText.style.alignSelf = "parent";
    messageText.style.textOverflow = "ellipsis";

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

    // Button interaction events
    button.onmouseover = function () {
        mouseOver()
    };
    button.onmouseout = function () {
        mouseOut()
    };

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
// Called on movement to new page
function onNewUrlDetected() {
    // Async: profaneMsgStatus, videoRatio
    // Check if new video count should be one where we block page
    // Block page with UI if needed
    if (videoCount % videoRatio == 0) {
        /**************************** GETTING A MESSAGE TO DISPLAY ****************************/
        // Assign random message (more of just in case they find a way to bypass extension and don't close tab)
        if (profaneMsgStatus == true) {
            index = getRandomInt(0, profaneNotifications.length);
            notifMsgs = profaneNotifications;

        } else {
            index = getRandomInt(0, cleanNotifications.length);
            notifMsgs = cleanNotifications;

        }
        createUI(notifMsgs[index]); // Make UI to block screen
    } else {
        console.log("URL detected: videocount: " + videoCount + " , ratio: " + videoRatio);
    }
}


/** MAIN */
// Setup flow. Separately retrieve fields for individual processing.
Promise.resolve(1).then(function(data) {
        return getVideoCount();

    }).then(function(vidCount) {
        videoCount = vidCount;
        console.log("VIDCOUNT: " + videoCount);
        return getUrlBeforeReload();

    }).then(function(preUrl) {
        oldUrl = preUrl;
        console.log("URL SUCCESS: " + oldUrl);
        return getVideoRatio();

    }).then(function(vidRatio) {
        videoRatio = vidRatio;
        return getProfaneStatus();

    }).then(function(profStatus) {
        profaneMsgStatus = profStatus;

        // Begin polling for URL changes/storage changes
        setupPollUrl();
        setTimeout(checkSettingsChanged, 5*1000);

    });
    // .catch(onError);
