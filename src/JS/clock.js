import { setPopClock } from "./popupUI.js";
import tabModule from "./tab.js";
import storageModule from "./storage.js";

let seconds = 0;
let minutes = 0;
let hours = 0;

// Clock function
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

    storageModule.updateAndStoreHostnameClockPair(tabModule.getHostname(),getTimeClock());
    setTimeClock(clock);
    setPopClock(clock);
}

// Function to set the current time clock
function setTimeClock(timeClock) {
    const [h, m, s] = timeClock.split(':').map(Number);
    hours = h;
    minutes = m;
    seconds = s;
}

// Function to get the current time clock
function getTimeClock() {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to reset the time clock
function resetTimeClock() {
    hours = 0;
    minutes = 0;
    seconds = 0;
}

const clockModule = {
    updateClock,
    setTimeClock,
    getTimeClock,
    resetTimeClock,
};

export default clockModule;