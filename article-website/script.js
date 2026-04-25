// Theme Toggle
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);


// Font Size Controls
const increaseBtn = document.getElementById('increase-font');
const decreaseBtn = document.getElementById('decrease-font');
const root = document.documentElement;

let currentFontSize = 18; // Base size in px matches CSS

increaseBtn.addEventListener('click', () => {
    if(currentFontSize < 30) {
        currentFontSize += 2;
        root.style.setProperty('--base-size', `${currentFontSize}px`);
    }
});

decreaseBtn.addEventListener('click', () => {
    if(currentFontSize > 14) {
        currentFontSize -= 2;
        root.style.setProperty('--base-size', `${currentFontSize}px`);
    }
});
