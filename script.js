const cat = document.getElementById('cat');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const pauseButton = document.getElementById('pause-button');
const gameArea = document.querySelector('.game-area');
const timeDisplay = document.getElementById('time');

if (cat && scoreDisplay && startButton && stopButton && pauseButton) {
    let score = 0;
    let isPlaying = false;
    let isPaused = false;
    let gameInterval;
    let gameTimeout;
    const gameDuration = 30000; // 30 seconds
    let currentPowerUp = null;
    let powerUpTimeout;
    let remainingTime;
    let startTime;
    let timeout;
    let timecounter;

    startButton.addEventListener('click', startGame);
    stopButton.addEventListener('click', stopGame);
    pauseButton.addEventListener('click', togglePauseGame);
    cat.addEventListener('click', debounce(catchCat, 200));
    document.addEventListener('keydown', handleKeyPress);

    function startGame() {
        score = 0;
        scoreDisplay.textContent = score;
        isPlaying = true;
        isPaused = false;
        cat.style.display = 'block';
        startButton.disabled = true;
        stopButton.disabled = false;
        pauseButton.disabled = false;

        moveCat();
        remainingTime = gameDuration;
        timecounter = gameDuration/1000;
        timeout = setInterval(() => {
            timecounter--;
            timeDisplay.textContent = timecounter;
            moveCat();
            if (timecounter <= 0) {
                clearInterval(timeout);
                endGame();
            }
        }, 1000);
        // gameInterval = setInterval(moveCat, 1000);
        startTime = Date.now();
        remainingTime = gameDuration;
        gameTimeout = setTimeout(endGame, remainingTime);
        spawnPowerUp();
    }

    function stopGame() {
        if (isPlaying) {
            clearTimeout(gameTimeout);
            clearTimeout(powerUpTimeout);
            clearTimeout(timeout);
            timeDisplay.textContent = 0;
            endGame();
        }
    }

    function togglePauseGame() {
        if (isPlaying) {
            if (isPaused) {
                // Resume game
                isPaused = false;
                pauseButton.textContent = 'Pause Game';
                startTime = Date.now();
                timeout = setInterval(() => {
                timecounter--;
                timeDisplay.textContent = timecounter;
                if (timecounter <= 0) {
                    clearInterval(timeout);
                    endGame();
                }
            }, 1000);
                gameTimeout = setTimeout(endGame, remainingTime);
                gameInterval = setInterval(moveCat, 1000);
                spawnPowerUp();
            } else {
                // Pause game
                isPaused = true;
                pauseButton.textContent = 'Resume Game';
                clearInterval(gameInterval);
                clearTimeout(gameTimeout);
                clearTimeout(powerUpTimeout);
                clearTimeout(timeout);
                remainingTime -= Date.now() - startTime;
                timecounter = Math.floor(remainingTime/1000)+1;
            }
        }
    }

    function catchCat() {
        if (isPlaying && !isPaused) {
            score += (currentPowerUp === 'doublePoints') ? 2 : 1;
            scoreDisplay.textContent = score;
            moveCat();
        }
    }

    function endGame() {
        isPlaying = false;
        isPaused = false;
        clearInterval(gameInterval);
        clearTimeout(gameTimeout);
        clearTimeout(powerUpTimeout);
        clearInterval(timeout);
        cat.style.display = 'none';
        startButton.disabled = false;
        stopButton.disabled = true;
        pauseButton.disabled = true;
        alert(`Game over! Your score is ${score}`);
    }

    function moveCat() {
        if (!isPaused) {
            requestAnimationFrame(() => {
                if (currentPowerUp === 'freeze') {
                    cat.style.transform = `translate(${lastPosition.x}px, ${lastPosition.y}px`;
                } else {
                    const speed = (currentPowerUp === 'slowDown') ? 0.5 : 1;
                    const x = Math.random() * (gameArea.offsetWidth - cat.offsetWidth) * speed;
                    const y = Math.random() * (gameArea.offsetHeight - cat.offsetHeight) * speed;
                    cat.style.transform = `translate(${x}px, ${y}px)`;
                    lastPosition = { x, y };

                }
            });
        }
    }

    function handleKeyPress(event) {
        if (event.code === 'Space') {
            if (!isPlaying) {
                startGame();
            } else {
                catchCat();
            }
        } else if (event.code === 'Escape') {
            stopGame();
        } else if (event.code === 'KeyP') {
            togglePauseGame();
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    function spawnPowerUp() {
        const powerUps = ['slowDown', 'doublePoints', 'freeze'];
        const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
        currentPowerUp = randomPowerUp;
        
        // Visual indication of power-up 
        cat.style.border = '8px solid orange';
        
        // Power-up duration
        setTimeout(() => {
            currentPowerUp = null;
            cat.style.border = 'none';
        }, 5000);

        // Schedule next power-up
        powerUpTimeout = setTimeout(spawnPowerUp, Math.random() * 10000 + 5000);
    }

    let lastPosition = { x: 0, y: 0 };
} else {
    if (!cat) console.error('Cat element not found');
    if (!scoreDisplay) console.error('Score display element not found');
    if (!startButton) console.error('Start button not found');
    if (!stopButton) console.error('Stop button not found');
    if (!pauseButton) console.error('Pause button not found');
}
