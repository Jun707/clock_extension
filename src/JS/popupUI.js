import storageModule from "./storage.js";
import clockModule from "./clock.js";

let popupPort = null;
export function setPopClock(clock) {
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

export function setCurrentSite(hostname) {
    if (popupPort) {
        popupPort.postMessage({hostname});
    }
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


// Listen for event message
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'clearHistory') {
        // Reset the clock in your background script
        clockModule.resetTimeClock();
        storageModule.clearHistory();
    }
});