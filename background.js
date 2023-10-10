import tabModule from "./tab.js";

// Listen for tab creation and updates to capture the hostname
chrome.tabs.onUpdated.addListener(tabModule.handleTabUpdates);

// Listen for tab switches to handle hostname changes
chrome.tabs.onActivated.addListener(tabModule.handleTabSwitches);

// Listen for window switches to handle timer
chrome.windows.onFocusChanged.addListener(tabModule.handleWindowSwitches);

// Initial setup
tabModule.handleTabSwitches();
