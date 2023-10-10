let popupPort = null;
let seconds = 0;
let minutes = 0;
let hours = 0;
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
        // popupPort.postMessage({currentHostname})
    }

    chrome.action.setBadgeText({ text: clock });
    chrome.action.setPopup({
        popup: `popup.html?time=${encodeURIComponent(clock)}`
    });
}

// Function to set the current time clock
function setTimeClock(timeClock) {
    const [h, m, s] = timeClock.split(':').map(Number);
    hours = h;
    minutes = m;
    seconds = s;
}

// Function to get the current time clock
function getTimeClock() {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
const clockModule = {
    updateClock,
    setTimeClock,
    getTimeClock,
    resetTimeClock,
};

export default clockModule;