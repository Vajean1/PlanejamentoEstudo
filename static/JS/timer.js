// Variáveis do Timer
let timer;
let isRunning = false;
let totalTime = 25 * 60; // 25 minutos em segundos
let currentTime = totalTime;

// Elementos DOM
const minutesElement = document.getElementById("timer-minutes");
const secondsElement = document.getElementById("timer-seconds");
const startButton = document.getElementById("start-timer");
const pauseButton = document.getElementById("pause-timer");
const resetButton = document.getElementById("reset-timer");

// Áudio do Apito
//const beepSound = new Audio("static/audio/beep.mp3");

// Função para atualizar o display
function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;

    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
}

// Função para iniciar o Timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            if (currentTime > 0) {
                currentTime--;
                updateTimerDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                // beepSound.play(); // Reproduz o som do apito
                alert("O tempo acabou! Faça uma pausa.");
            }
        }, 1000);
    }
}

// Função para pausar o Timer
function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
}

// Função para resetar o Timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    currentTime = totalTime;
    updateTimerDisplay();
}

// Eventos dos botões
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

// Atualiza o Timer na inicialização
updateTimerDisplay();
