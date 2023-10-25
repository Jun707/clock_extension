const clearButtonElement = document.querySelector('.clear');
const resetButtonElement = document.querySelector('.reset');
const clockElement = document.querySelector('.clock');
const bodyElement=document.querySelector('body');
const showButtonElement = document.querySelector('.show')
const hostnameElement = document.querySelector('.hostname');

document.addEventListener("DOMContentLoaded", function () {
    // Open a connection to the background script
    const port = chrome.runtime.connect({ name: 'popupConnection' });

    // Listen for messages from the background script
    port.onMessage.addListener(function (message) {
        if (message.hostname) {
            hostnameElement.textContent = message.hostname;
        }

        if (message.clock) {
            clockElement.textContent = message.clock;
        }

    });

    const urlParams = new URLSearchParams(window.location.search);
    const time = urlParams.get('time');
    clockElement.textContent = time;

    // Add an event listener to detect when the popup is closed
    window.addEventListener("beforeunload", function () {
        port.disconnect();
    });
});

// clear function
clearButtonElement.addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'clearHistory' });
    clockElement.textContent='00:00:00';
});

// reset function
resetButtonElement.addEventListener('click', function() {
    chrome.runtime.sendMessage({action: 'resetTimer'});
    clockElement.textContent='00:00:00';
})

showButtonElement.addEventListener('click', function retrieveHostnameClockPairs() {
    chrome.storage.local.get(null, function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            const historyList = document.createElement('ul');
            for(const key in result) {
                if(result.hasOwnProperty(key)) {
                    const item = document.createElement('li');
                    const itemContent = document.createTextNode(`${key}: ${result[key]}`)
                    item.appendChild(itemContent);
                    historyList.appendChild(item);
                    console.log(`${key}: ${result[key]}`);
                    
                }
            }
            console.log(historyList);
            bodyElement.appendChild(historyList);
        }
    });
})