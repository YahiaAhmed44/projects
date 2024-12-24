let countdownTime = 5;

const countdownElement = document.querySelector('h1');

let interval;

function startCountdown() {
    

    if (countdownTime <= 0) {
        clearInterval(interval);

        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    } else {
        countdownTime--;
    }
    countdownElement.textContent = countdownTime;
}

interval = setInterval(startCountdown, 1000);
