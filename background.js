import tabModule from "./src/JS/tab.js";
import clockModule from "./src/JS/clock.js";
// Listen for tab creation and updates to capture the hostname
chrome.tabs.onUpdated.addListener(tabModule.handleTabUpdates);

// Listen for tab switches to handle hostname changes
chrome.tabs.onActivated.addListener(tabModule.handleTabSwitches);

// Listen for window switches to handle timer
chrome.windows.onFocusChanged.addListener(tabModule.handleWindowSwitches);

// Initial setup
tabModule.handleTabSwitches();

// In background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'clearHistory') {
        // Reset the clock in your background script
        clockModule.resetTimeClock();

        // Send the updated clock time back to the popup
        const newClock = clockModule.getTimeClock();
        sendResponse({ newClock });
    }
});
