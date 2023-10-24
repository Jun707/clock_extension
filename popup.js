const resetButtonElement = document.querySelector('.clear');
const clockElement = document.querySelector('.clock');
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

// reset function
resetButtonElement.addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'clearHistory' });
    clockElement.textContent='00:00:00';
});
