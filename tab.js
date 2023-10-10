let currentHostname = "";
let intervalId = null;

import clockModule from "./clock.js";
import storageModule from "./storage.js";
// Function to handle when window switch
function handleWindowSwitches(windowId) {
    if (windowId) {
        handleTabSwitches();
    }
}
   
// Function to handle tab updates and capture the hostname when a new tab is created or updated
function handleTabUpdates(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.url) {
        const url = new URL(tab.url);
        const newHostname = url.hostname;

        if (newHostname !== currentHostname) {
            // Handle switching to a new hostname
            if (currentHostname) {
                // Store the time clock for the previous hostname
                const previousClock = clockModule.getTimeClock();
                storageModule.updateAndStoreHostnameClockPair(currentHostname, previousClock);
                console.log(`Time clock for ${currentHostname}: ${previousClock}`);
            }

            currentHostname = newHostname;
            
            storageModule.retrieveHostnameClockPairs(function (pairs) {
                if (currentHostname in pairs) {
                    // Switch to the stored time clock for the current hostname
                    clockModule.setTimeClock(pairs[currentHostname]);
                } else {
                    // Reset the time clock for the new hostname
                    clockModule.resetTimeClock();
                }
            });

            if (intervalId) {
                clearInterval(intervalId);
            }

            intervalId = setInterval(clockModule.updateClock, 1000);
            // Call any function or perform actions related to hostname changes here
            // For example, you can call another function:
            // doSomethingOnHostnameChange(newHostname);
        }
    }
}

// Function to handle tab switches and hostname changes
function handleTabSwitches() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if(tabs[0] && tabs[0].url) {
            const url = new URL(tabs[0].url);
            const newHostname = url.hostname;

            if (newHostname !== currentHostname) {
                // Handle switching to a new hostname
                if (currentHostname) {
                    // Store the time clock for the previous hostname
                    const previousClock = clockModule.getTimeClock();
                    storageModule.updateAndStoreHostnameClockPair(currentHostname, previousClock);
                    console.log(`Time clock for ${currentHostname}: ${previousClock}`);
                }
    
                currentHostname = newHostname;
    
                storageModule.retrieveHostnameClockPairs(function (pairs) {
                    if (currentHostname in pairs) {
                        // Switch to the stored time clock for the current hostname
                        clockModule.setTimeClock(pairs[currentHostname]);
                    } else {
                        // Reset the time clock for the new hostname
                        clockModule.resetTimeClock();
                    }
                });
    
                if (intervalId) {
                    clearInterval(intervalId);
                }
    
                intervalId = setInterval(clockModule.updateClock, 1000);
        }

        }
    });
}

const tabModule = {
    handleTabSwitches,
    handleTabUpdates,
    handleWindowSwitches
};

export default tabModule;