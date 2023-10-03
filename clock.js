let hours=0;
let minutes=0;
let seconds=0;

function updateClock() {
    
    seconds++;
    if(seconds>=60) {
        seconds=0;
        minutes++;
        if (minutes>=60) {
            minutes=0;
            hours++;
        }
    }

    const hoursFormat=hours.toString().padStart(2,'0');
    const minutesFormat=minutes.toString().padStart(2,'0');
    const secondsFormat=seconds.toString().padStart(2,'0');

    const clockElement=document.querySelector('.clock');
    clockElement.textContent=`${hoursFormat}:${minutesFormat}:${secondsFormat}`;

}


setInterval(updateClock, 1000);

updateClock();