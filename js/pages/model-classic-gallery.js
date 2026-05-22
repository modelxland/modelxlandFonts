// Image Gallery Data
const productImages = [
    'images/drawer-1.jpg',
    'images/drawer-2.jpg',
    'images/drawer-3.jpg',
    'images/drawer-4.jpg',
    'images/drawer-5.jpg'
];
let currentImageIndex = 0;

// Image Gallery Switcher
function switchImage(src, index) {
    currentImageIndex = index;
    const mainImg = document.getElementById('mainProductImg');

    // Smooth fade-out effect (matches 0.4s CSS transition)
    mainImg.style.opacity = '0';

    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
    }, 100); // Change source slightly before full fade out for smoother effect

    // Update active state for both thumbnails and dots
    updateGalleryUI(index);

    // Reset interval on user interaction
    resetAutoSwipe();
}

function updateGalleryUI(index) {
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, i) => {
        if (i === index) d.classList.add('active');
        else d.classList.remove('active');
    });
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % productImages.length;
    switchImage(productImages[currentImageIndex], currentImageIndex);
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    switchImage(productImages[currentImageIndex], currentImageIndex);
}

// Add touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const gallery = document.getElementById('mainImageWrap');
gallery.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

gallery.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextImage(); // Swipe left (in RTL, next)
    if (touchEndX > touchStartX + 50) prevImage(); // Swipe right (in RTL, prev)
}

// Auto Swap Images every 10 seconds
let autoSwipeInterval;

function startAutoSwipe() {
    autoSwipeInterval = setInterval(() => {
        // Call nextImage but bypass reset inside switchImage to avoid loops if needed
        // Actually nextImage calls switchImage, which calls resetAutoSwipe.
        // This means the interval gets reset cleanly every time it fires.
        nextImage();
    }, 10000);
}

function resetAutoSwipe() {
    clearInterval(autoSwipeInterval);
    startAutoSwipe();
}

// Start initially
startAutoSwipe();

// 72-Hour Persistent Countdown Timer
function startCountdown() {
    const timerElement = document.querySelector('.badge-time');
    if (!timerElement) return;

    const duration = 72 * 60 * 60 * 1000; // 72 hours in ms
    let targetTime = localStorage.getItem('countdownTargetTime');

    if (!targetTime) {
        targetTime = Date.now() + duration;
        localStorage.setItem('countdownTargetTime', targetTime);
    } else {
        targetTime = parseInt(targetTime, 10);
    }

    function updateTimer() {
        const now = Date.now();
        let remaining = targetTime - now;

        if (remaining <= 0) {
            // Reset to another 72 hours once it hits 0
            targetTime = Date.now() + duration;
            localStorage.setItem('countdownTargetTime', targetTime);
            remaining = duration;
        }

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        timerElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

startCountdown();
