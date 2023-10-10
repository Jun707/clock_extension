// Function to update and store hostname-clock pairs in chrome.storage.local
function updateAndStoreHostnameClockPair(hostname, clock) {
    const data = {};
    data[hostname] = clock;

    chrome.storage.local.set(data, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log(`Data stored for ${hostname}`);
        }
    });
}

// Function to retrieve hostname-clock pairs from chrome.storage.local
function retrieveHostnameClockPairs(callback) {
    chrome.storage.local.get(null, function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log("Retrieved data from storage:", result);
            callback(result);
        }
    });
}

const storageModule = {
    updateAndStoreHostnameClockPair,
    retrieveHostnameClockPairs,
};

export default storageModule;