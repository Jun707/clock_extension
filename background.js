let seconds = 0;
let minutes = 0;
let hours = 0;
let popupPort = null;
let currentHostname = ""; // Store the current hostname
let intervalId= null;

function hostnameCheck() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        const url = new URL(tabs[0].url);
        const newHostname = url.hostname;

        if (newHostname !== currentHostname) {
            console.log("Hostname changed to:", newHostname);
            currentHostname = newHostname;

            if(intervalId) {
                console.log(intervalId);
                clearInterval(intervalId);
            }

            intervalId=setInterval(updateClock, 1000);
            
            // Call any function or perform actions related to hostname changes here
            // For example, you can call another function:
            // doSomethingOnHostnameChange(newHostname);
        }
    });
}

// Listen for tab updates to check for hostname changes
chrome.tabs.onActivated.addListener(function(activeInfo) {
    hostnameCheck();
});

// Call the hostnameCheck function initially
hostnameCheck();

// Clock function
function updateClock() {

    seconds++;

    if (seconds >= 60) {
        seconds = 0;
        minutes++;

        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    const clock = `${hoursStr}:${minutesStr}:${secondsStr}`;
    if (popupPort) {
        // Send the clock time to the popup
        popupPort.postMessage({ clock });
    }

    chrome.action.setBadgeText({ text: clock });
    chrome.action.setPopup({
        popup: `popup.html?time=${encodeURIComponent(clock)}`
    });

}
// Listen for the popup's connection
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === 'popupConnection') {
        popupPort = port;

        // Listen for the popup disconnecting
        port.onDisconnect.addListener(function () {
            popupPort = null;
        });
    }
});