let countdownTime = 5;

const countdownElement = document.querySelector('h1');

let interval;

function startCountdown() {
    

    if (countdownTime <= 0) {
        clearInterval(interval);

        window.location.href = 'https://yahiaahmed44.github.io/projects/cd/v.html';

    } else {
        countdownTime--;
    }
    countdownElement.textContent = countdownTime;
}

interval = setInterval(startCountdown, 1000);
