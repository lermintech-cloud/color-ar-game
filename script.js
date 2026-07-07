// Game variables
let gameActive = false;
let score = 0;
let attempts = 0;
let correctAnswers = 0;
let timeLeft = 60;
let level = 1;
let currentColorIndex = 0;
let handPosition = null;
let hoveredCircleId = null;
let holdStartTime = null;
const HOLD_DURATION = 500; // milliseconds
const COLORS = [
    { name: 'แดง', thai: 'แตะสีแดง', hex: '#FF6B6B', rgb: 'rgb(255, 107, 107)' },
    { name: 'เขียว', thai: 'แตะสีเขียว', hex: '#51CF66', rgb: 'rgb(81, 207, 102)' },
    { name: 'เหลือง', thai: 'แตะสีเหลือง', hex: '#FFD93D', rgb: 'rgb(255, 217, 61)' },
    { name: 'น้ำเงิน', thai: 'แตะสีน้ำเงิน', hex: '#6C5CE7', rgb: 'rgb(108, 92, 231)' },
    { name: 'ม่วง', thai: 'แตะสีม่วง', hex: '#A29BFE', rgb: 'rgb(162, 155, 254)' },
    { name: 'ชมพู', thai: 'แตะสีชมพู', hex: '#FD79A8', rgb: 'rgb(253, 121, 168)' },
    { name: 'ส้ม', thai: 'แตะสีส้ม', hex: '#FDCB6E', rgb: 'rgb(253, 203, 110)' }
];

const colorNames = {
    'แดง': 'red',
    'เขียว': 'green',
    'เหลือง': 'yellow',
    'น้ำเงิน': 'blue',
    'ม่วง': 'purple',
    'ชมพู': 'pink',
    'ส้ม': 'orange'
};

// MediaPipe setup
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');

async function initializeHandDetection() {
    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
    });

    hands.onResults(onHandsResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 1280,
        height: 720
    });

    camera.start();

    // Resize canvas
    function resizeCanvases() {
        canvasElement.width = videoElement.offsetWidth;
        canvasElement.height = videoElement.offsetHeight;
    }

    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();
}

function onHandsResults(results) {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];

        // Draw hand skeleton
        drawHandSkeleton(landmarks);

        // Get index fingertip position (landmark 8)
        const indexFingerTip = landmarks[8];
        const x = (1 - indexFingerTip.x) * canvasElement.width;
        const y = indexFingerTip.y * canvasElement.height;

        handPosition = { x, y };

        // Show and update cursor
        const cursor = document.getElementById('cursorIndicator');
        cursor.style.display = 'block';
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';

        // Check if hovering over any circle
        if (gameActive) {
            checkCircleHover(x, y);
        }
    } else {
        handPosition = null;
        document.getElementById('cursorIndicator').style.display = 'none';
    }
}

function drawHandSkeleton(landmarks) {
    // Draw connections
    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20] // Pinky
    ];

    canvasCtx.strokeStyle = 'rgba(102, 126, 234, 0.5)';
    canvasCtx.lineWidth = 2;

    connections.forEach(connection => {
        const start = landmarks[connection[0]];
        const end = landmarks[connection[1]];
        const startX = (1 - start.x) * canvasElement.width;
        const startY = start.y * canvasElement.height;
        const endX = (1 - end.x) * canvasElement.width;
        const endY = end.y * canvasElement.height;

        canvasCtx.beginPath();
        canvasCtx.moveTo(startX, startY);
        canvasCtx.lineTo(endX, endY);
        canvasCtx.stroke();
    });

    // Draw joints
    landmarks.forEach((landmark, idx) => {
        const x = (1 - landmark.x) * canvasElement.width;
        const y = landmark.y * canvasElement.height;
        canvasCtx.fillStyle = idx === 8 ? '#FF6B6B' : 'rgba(102, 126, 234, 0.8)';
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, idx === 8 ? 6 : 4, 0, 2 * Math.PI);
        canvasCtx.fill();
    });
}

function checkCircleHover(x, y) {
    const circles = document.querySelectorAll('.color-circle');
    let isHovering = false;

    circles.forEach(circle => {
        const rect = circle.getBoundingClientRect();
        const distance = Math.sqrt(
            Math.pow(x - (rect.left + rect.width / 2), 2) +
            Math.pow(y - (rect.top + rect.height / 2), 2)
        );

        if (distance < rect.width / 2) {
            isHovering = true;
            const circleId = circle.getAttribute('data-color-id');

            if (hoveredCircleId !== circleId) {
                hoveredCircleId = circleId;
                holdStartTime = Date.now();
            }

            // Update hold progress
            if (holdStartTime) {
                const elapsed = Date.now() - holdStartTime;
                const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
                circle.style.setProperty('--hold-progress', progress + '%');

                if (elapsed >= HOLD_DURATION) {
                    selectCircle(circleId);
                    holdStartTime = null;
                    hoveredCircleId = null;
                }
            }
        } else {
            circle.style.setProperty('--hold-progress', '0%');
        }
    });

    if (!isHovering) {
        hoveredCircleId = null;
        holdStartTime = null;
    }
}

function selectCircle(colorId) {
    const circle = document.querySelector(`[data-color-id="${colorId}"]`);
    const targetColorId = document.getElementById('instruction').getAttribute('data-target');

    attempts++;

    if (colorId === targetColorId) {
        correctAnswers++;
        circle.classList.add('selected');
        playSuccessSound();
        createConfetti();
        score += 10 * level;
        speakColor(COLORS[parseInt(colorId)].name);

        setTimeout(() => {
            nextRound();
        }, 800);
    } else {
        circle.classList.add('wrong');
        playWrongSound();

        setTimeout(() => {
            circle.classList.remove('wrong');
        }, 400);
    }

    updateStats();
}

function nextRound() {
    currentColorIndex = Math.floor(Math.random() * COLORS.length);
    generateCircles();
    updateInstruction();
}

function generateCircles() {
    const container = document.getElementById('circlesContainer');
    container.innerHTML = '';

    const circleIndices = [];
    while (circleIndices.length < 6) {
        const idx = Math.floor(Math.random() * COLORS.length);
        if (!circleIndices.includes(idx)) {
            circleIndices.push(idx);
        }
    }

    circleIndices.forEach((idx) => {
        const circle = document.createElement('div');
        circle.className = 'color-circle';
        circle.setAttribute('data-color-id', idx);
        circle.style.background = COLORS[idx].hex;

        // Add hold progress indicator
        const progress = document.createElement('div');
        progress.className = 'hold-progress';
        progress.style.width = '0%';
        circle.appendChild(progress);

        container.appendChild(circle);
    });
}

function updateInstruction() {
    const instruction = document.getElementById('instruction');
    instruction.textContent = COLORS[currentColorIndex].thai;
    instruction.setAttribute('data-target', currentColorIndex);
}

function startGame() {
    if (gameActive) return;

    gameActive = true;
    score = 0;
    attempts = 0;
    correctAnswers = 0;
    timeLeft = 60;
    level = 1;

    document.getElementById('playBtn').disabled = true;
    generateCircles();
    updateInstruction();
    updateStats();

    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft + 's';

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;

    const accuracy = attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 100;
    document.getElementById('accuracy').textContent = accuracy + '%';

    const progress = ((60 - timeLeft) / 60) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // Level progression
    level = Math.floor(correctAnswers / 5) + 1;
}

function endGame() {
    gameActive = false;
    const accuracy = attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = level;
    document.getElementById('finalAccuracy').textContent = accuracy;
    document.getElementById('resetScreen').style.display = 'flex';
    document.getElementById('playBtn').disabled = false;
}

function resetGame() {
    document.getElementById('resetScreen').style.display = 'none';
    startGame();
}

function createConfetti() {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.background = COLORS[Math.floor(Math.random() * COLORS.length)].hex;
        confetti.style.borderRadius = '50%';
        confetti.style.animation = `confetti-fall ${2 + Math.random()}s linear`;

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 2500);
    }
}

function playSuccessSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playWrongSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 300;
    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

function speakColor(colorName) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('สี' + colorName);
        utterance.lang = 'th-TH';
        utterance.rate = 0.8;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Initialize on load
window.addEventListener('load', initializeHandDetection);