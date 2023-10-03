document.addEventListener("DOMContentLoaded", function () {
    const clockElement = document.getElementById('clock');
    const urlParams = new URLSearchParams(window.location.search);
    const time = urlParams.get('time');
    clockElement.textContent = time;
});
