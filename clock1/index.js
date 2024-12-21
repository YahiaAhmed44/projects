const clock = document.querySelector('.clock');
const numDigits = 8; 

for (let i = 1; i <= numDigits; i++) {
    const digit = document.createElement('div');
    digit.classList.add('digit');
    if ((i)%3 !=0) {
        const segments = ['top', 'top-left', 'top-right', 'middle', 'bottom-left', 'bottom-right', 'bottom'];
        segments.forEach(segment => {
            const segmentDiv = document.createElement('div');
            segmentDiv.classList.add('segment', segment);
            digit.appendChild(segmentDiv);
        });
  
    }else{
        const colons = document.createElement('div');
        colons.classList.add('colons');
        digit.appendChild(colons);
        
    }
    clock.appendChild(digit);
}


const digits = {
    0: ['top', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom'],
    1: ['top-right', 'bottom-right'],
    2: ['top', 'top-right', 'middle', 'bottom-left', 'bottom'],
    3: ['top', 'top-right', 'middle', 'bottom-right', 'bottom'],
    4: ['top-left', 'middle', 'top-right', 'bottom-right'],
    5: ['top', 'top-left', 'middle', 'bottom-right', 'bottom'],
    6: ['top', 'top-left', 'middle', 'bottom-left', 'bottom-right', 'bottom'],
    7: ['top', 'top-right', 'bottom-right'],
    8: ['top', 'top-left', 'top-right', 'middle', 'bottom-left', 'bottom-right', 'bottom'],
    9: ['top', 'top-left', 'top-right', 'middle', 'bottom-right', 'bottom'],
  };
  
function displayClock(numberString) {
    const digitElements = document.querySelectorAll('.digit'); 

    numberString.split('').forEach((char, index) => {
        if (digitElements[index]) {
            if (char === ':') {
                const colons = digitElements[index].querySelector('.colons');
                if (colons) colons.classList.add('visible'); 
            } else {
                const segments = digitElements[index].querySelectorAll('.segment');
                segments.forEach(segment => segment.classList.remove('on')); 

                digits[char].forEach(segmentClass => {
                    const segment = digitElements[index].querySelector(`.segment.${segmentClass}`);
                    if (segment) {
                        segment.classList.add('on'); 
                    }
                });
            }
        }
    });
}

function updateClock() {

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;  
    
    displayClock(formattedTime);
}
updateClock();
setInterval(updateClock, 1000);

