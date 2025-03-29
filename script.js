// Sample quotes
const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling another human what one wants the computer to do.",
    "The best error message is the one that never shows up.",
    "First, solve the problem. Then, write the code.",
    "My name is sayed Ahmad saeed",
    "My youtube channel name is HomeCookingFun",
    "My cousin is a data scientist. He designs AI models and systems.",
  "  My father is an eye doctor."

];

// DOM elements
const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerElement = document.getElementById('time');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const startButton = document.getElementById('start-test');
const resetButton = document.getElementById('reset-test');
const emojiContainer = document.querySelector('.emoji-container');

// Game variables
let timer;
let timeLeft = 60;
let isTestRunning = false;
let correctCharacters = 0;
let totalCharacters = 0;

// Emoji reactions
const emojiReactions = [
    {
        condition: (accuracy, speed) => accuracy === 1 && speed > 70,
        emoji: '🏆✨',
        message: 'Typing God!'
    },
    {
        condition: (accuracy, speed) => accuracy === 1 && speed > 50,
        emoji: '🚀🤩',
        message: 'Perfect!'
    },
    {
        condition: (accuracy, speed) => accuracy > 0.9 && speed > 40,
        emoji: '😎👏',
        message: 'Awesome!'
    },
    {
        condition: (accuracy, speed) => accuracy > 0.8 && speed > 30,
        emoji: '👍😊',
        message: 'Great job!'
    },
    {
        condition: (accuracy, speed) => accuracy > 0.6,
        emoji: '🤔💪',
        message: 'Keep going!'
    },
    {
        condition: (accuracy, speed) => accuracy > 0.4,
        emoji: '🐢😅',
        message: 'You can do better!'
    },
    {
        condition: () => true,
        emoji: '💥😱',
        message: 'Oops! Try again!'
    }
];

// Start the test
function startTest() {
    if (isTestRunning) return;
    
    // Reset stats
    timeLeft = 60;
    correctCharacters = 0;
    totalCharacters = 0;
    updateStats();
    
    // Get random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = '';
    
    // Display quote with spans for each character
    quote.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        quoteDisplay.appendChild(charSpan);
    });
    
    // Clear input and focus
    quoteInput.value = '';
    quoteInput.disabled = false;
    quoteInput.focus();
    
    // Start timer
    isTestRunning = true;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
    
    // Disable start button during test
    startButton.disabled = true;
    resetButton.disabled = false;
}

// End the test
function endTest() {
    clearInterval(timer);
    isTestRunning = false;
    quoteInput.disabled = true;
    startButton.disabled = false;
    
    const wpm = Math.round((correctCharacters / 5) / (60 / 60));
    wpmElement.textContent = wpm;
    
    // Celebration emojis based on final score
    const accuracy = totalCharacters > 0 ? (correctCharacters / totalCharacters) : 0;
    const reaction = emojiReactions.find(r => r.condition(accuracy, wpm)) || emojiReactions[emojiReactions.length - 1];
    
    emojiContainer.innerHTML = `
        <div class="emoji">${reaction.emoji}</div>
        <div class="message">${reaction.message} Final Score: ${wpm} WPM!</div>
    `;
    emojiContainer.style.opacity = 1;
}

// Reset the test
function resetTest() {
    clearInterval(timer);
    isTestRunning = false;
    timeLeft = 60;
    correctCharacters = 0;
    totalCharacters = 0;
    quoteInput.value = '';
    quoteInput.disabled = true;
    quoteDisplay.innerHTML = 'Click "Start Game" to begin!';
    updateStats();
    startButton.disabled = false;
    resetButton.disabled = true;
    emojiContainer.style.opacity = 0;
}

// Update stats
function updateStats() {
    timerElement.textContent = timeLeft;
    
    const accuracy = totalCharacters > 0 
        ? Math.round((correctCharacters / totalCharacters) * 100) 
        : 0;
    accuracyElement.textContent = accuracy;
    
    const wpm = calculateSpeed();
    wpmElement.textContent = wpm;
}

// Calculate typing speed
function calculateSpeed() {
    const timeElapsed = 60 - timeLeft;
    return timeElapsed > 0 
        ? Math.round((correctCharacters / 5) / (timeElapsed / 60)) 
        : 0;
}

// Show emoji reaction
function showReaction() {
    const accuracy = totalCharacters > 0 ? (correctCharacters / totalCharacters) : 0;
    const speed = calculateSpeed();
    
    const reaction = emojiReactions.find(r => r.condition(accuracy, speed)) || emojiReactions[emojiReactions.length - 1];
    
    emojiContainer.innerHTML = `
        <div class="emoji">${reaction.emoji}</div>
        <div class="message">${reaction.message}</div>
    `;
    emojiContainer.style.opacity = 1;
    setTimeout(() => {
        emojiContainer.style.opacity = 0;
    }, 2000);
}

// Handle input
quoteInput.addEventListener('input', () => {
    if (!isTestRunning) return;
    
    const quoteSpans = quoteDisplay.querySelectorAll('span');
    const inputArray = quoteInput.value.split('');
    
    correctCharacters = 0;
    totalCharacters = inputArray.length;
    
    quoteSpans.forEach((span, index) => {
        const inputChar = inputArray[index];
        
        if (inputChar == null) {
            span.className = '';
        } else if (inputChar === span.innerText) {
            span.className = 'correct';
            correctCharacters++;
        } else {
            span.className = 'incorrect';
        }
    });
    
    updateStats();
    showReaction();
    
    // End test if all characters are correct
    if (inputArray.length === quoteSpans.length && correctCharacters === quoteSpans.length) {
        endTest();
    }
});

// Event listeners
startButton.addEventListener('click', startTest);
resetButton.addEventListener('click', resetTest);

// Initialize
resetTest();