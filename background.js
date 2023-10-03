let seconds = 0;
let minutes = 0;
let hours = 0;

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

    // Send the clock time to the popup
    chrome.action.setPopup({ popup: `popup.html?time=${encodeURIComponent(clock)}` });
}

setInterval(updateClock, 1000);
