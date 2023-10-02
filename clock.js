function updateClock() {
    const clockElement = document.getElementsByClassName("clock");
    const time = new Date();
    const hours = time.getHours().toString().padStart(2,'0');
    const minutes = time.getMinutes().toString().padStart(2,'0');
    const seconds = time.getSeconds().toString().padStart(2,'0');

    const now = `${hours}:${minutes}:${seconds}`;
    for (const clockElement of clockElements) {
        clockElement.textContent = now;
    }



}

setInterval(updateClock, 1000);

updateClock();