let seconds = 0;
let minutes = 0;
let hours = 0;
let popupPort = null;
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

setInterval(updateClock, 1000);

updateClock();

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
