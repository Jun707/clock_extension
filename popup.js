document.addEventListener("DOMContentLoaded", function () {
    const clockElement = document.querySelector('.clock');
    const hostnameElement = document.querySelector('.hostname');
    // Open a connection to the background script
    const port = chrome.runtime.connect({ name: 'popupConnection' });

    // Listen for messages from the background script
    port.onMessage.addListener(function (message) {
        if (message.hostname) { // Check if a hostname message is received
            hostnameElement.textContent = message.hostname; // Display the hostname
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
        // Close the connection to the background script
        port.disconnect();
    });
});