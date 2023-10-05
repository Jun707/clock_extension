let seconds = 0;
let minutes = 0;
let hours = 0;
let popupPort = null;
let currentHostname = "";
let intervalId = null;
let tabList = new Map();
let url;
const hostnameTimeMap = {}; // Store hostname-time clock pairs

// Function to handle tab updates and capture the hostname when a new tab is created or updated
function handleTabUpdates(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.url) {
        const url = new URL(tab.url);
        const newHostname = url.hostname;

        if (newHostname !== currentHostname) {
            // Handle switching to a new hostname
            if (currentHostname) {
                // Store the time clock for the previous hostname
                hostnameTimeMap[currentHostname] = getTimeClock();
                console.log(`Time clock for ${currentHostname}: ${hostnameTimeMap[currentHostname]}`);
            }

            currentHostname = newHostname;

            if (currentHostname in hostnameTimeMap) {
                // Switch to the stored time clock for the current hostname
                setTimeClock(hostnameTimeMap[currentHostname]);
            } else {
                // Reset the time clock for the new hostname
                resetTimeClock();
            }
        }
    }
}

// Function to handle tab switches and hostname changes
function handleTabSwitches() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        const url = new URL(tabs[0].url);
        const newHostname = url.hostname;

        if (newHostname !== currentHostname) {
            // Handle switching to a new hostname
            if (currentHostname) {
                // Store the time clock for the previous hostname
                hostnameTimeMap[currentHostname] = getTimeClock();
                console.log(`Time clock for ${currentHostname}: ${hostnameTimeMap[currentHostname]}`);
            }

            currentHostname = newHostname;

            if (currentHostname in hostnameTimeMap) {
                // Switch to the stored time clock for the current hostname
                setTimeClock(hostnameTimeMap[currentHostname]);
            } else {
                // Reset the time clock for the new hostname
                resetTimeClock();
            }

            if (intervalId) {
                clearInterval(intervalId);
            }

            intervalId = setInterval(updateClock, 1000);
            // Call any function or perform actions related to hostname changes here
            // For example, you can call another function:
            // doSomethingOnHostnameChange(newHostname);
        }
    });
}

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
    setTimeClock(clock);

    if (popupPort) {
        // Send the clock time to the popup
        popupPort.postMessage({ clock });
    }

    chrome.action.setBadgeText({ text: clock });
    chrome.action.setPopup({
        popup: `popup.html?time=${encodeURIComponent(clock)}`
    });
}

// Function to get the current time clock
function getTimeClock() {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to set the current time clock
function setTimeClock(timeClock) {
    const [h, m, s] = timeClock.split(':').map(Number);
    hours = h;
    minutes = m;
    seconds = s;
}

// Function to reset the time clock
function resetTimeClock() {
    hours = 0;
    minutes = 0;
    seconds = 0;
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

// Listen for tab creation and updates to capture the hostname
chrome.tabs.onUpdated.addListener(handleTabUpdates);

// Listen for tab switches to handle hostname changes
chrome.tabs.onActivated.addListener(handleTabSwitches);

// Initial setup
updateClock();
setInterval(updateClock, 1000);
