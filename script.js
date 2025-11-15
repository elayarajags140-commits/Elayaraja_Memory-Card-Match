// Game State
let gameState = {
  currentLevel: 1,
  isLevelMode: false,
  gridSize: 4,
  timeLimit: null,
  theme: "emojis",
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  time: 0,
  timer: null,
  soundEnabled: true,
};

// Card Themes
const themes = {
  emojis: [
    "😀",
    "😂",
    "🥰",
    "😎",
    "🤩",
    "🥳",
    "😇",
    "🤗",
    "🤔",
    "😴",
    "🥺",
    "😱",
    "🤯",
    "😈",
    "👻",
    "🤖",
    "🦄",
    "🐶",
    "🐱",
    "🐼",
    "🦊",
    "🐸",
    "🦁",
    "🐯",
    "🐻",
    "🐨",
    "🐷",
    "🐮",
    "🦀",
    "🦈",
    "🐙",
    "🦑",
  ],
  animals: [
    "🦁",
    "🐯",
    "🐼",
    "🐨",
    "🦊",
    "🐸",
    "🦋",
    "🐢",
    "🦀",
    "🐙",
    "🦑",
    "🐳",
    "🦈",
    "🐬",
    "🐘",
    "🦒",
    "🦘",
    "🦥",
    "🦦",
    "🦭",
    "🐧",
    "🦉",
    "🦚",
    "🦜",
    "🐝",
    "🐞",
    "🦗",
    "🕷",
    "🦂",
    "🐍",
    "🦎",
    "🐊",
  ],
  food: [
    "🍕",
    "🍔",
    "🍟",
    "🌭",
    "🍿",
    "🥓",
    "🥚",
    "🍳",
    "🥞",
    "🧇",
    "🥐",
    "🍞",
    "🥖",
    "🧀",
    "🥗",
    "🍝",
    "🍜",
    "🍲",
    "🍛",
    "🍣",
    "🍱",
    "🍤",
    "🍙",
    "🍚",
    "🍘",
    "🍥",
    "🥠",
    "🍡",
    "🍧",
    "🍨",
    "🍦",
    "🥧",
  ],
  space: [
    "🚀",
    "🛸",
    "🌍",
    "🌎",
    "🌏",
    "🪐",
    "⭐",
    "🌟",
    "✨",
    "💫",
    "🌙",
    "☄️",
    "🌠",
    "🔭",
    "👽",
    "🛰️",
    "🌌",
    "🔮",
    "🎆",
    "🎇",
    "🌈",
    "⚡",
    "🔥",
    "💥",
    "☀️",
    "🌤",
    "⛅",
    "🌥",
    "☁️",
    "🌦",
    "🌧",
    "⛈",
  ],
};

// Level Configuration
const levelConfig = [
  // Levels 1-5: Easy (4x4)
  { level: 1, gridSize: 4, theme: "emojis" },
  { level: 2, gridSize: 4, theme: "animals" },
  { level: 3, gridSize: 4, theme: "food" },
  { level: 4, gridSize: 4, theme: "space" },
  { level: 5, gridSize: 4, theme: "emojis" },
  // Levels 6-15: Medium (6x6)
  { level: 6, gridSize: 6, theme: "animals" },
  { level: 7, gridSize: 6, theme: "food" },
  { level: 8, gridSize: 6, theme: "space" },
  { level: 9, gridSize: 6, theme: "emojis" },
  { level: 10, gridSize: 6, theme: "animals" },
  { level: 11, gridSize: 6, theme: "food" },
  { level: 12, gridSize: 6, theme: "space" },
  { level: 13, gridSize: 6, theme: "emojis" },
  { level: 14, gridSize: 6, theme: "animals" },
  { level: 15, gridSize: 6, theme: "food" },
  // Levels 16-30: Hard (8x8)
  { level: 16, gridSize: 8, theme: "space" },
  { level: 17, gridSize: 8, theme: "emojis" },
  { level: 18, gridSize: 8, theme: "animals" },
  { level: 19, gridSize: 8, theme: "food" },
  { level: 20, gridSize: 8, theme: "space" },
  { level: 21, gridSize: 8, theme: "emojis" },
  { level: 22, gridSize: 8, theme: "animals" },
  { level: 23, gridSize: 8, theme: "food" },
  { level: 24, gridSize: 8, theme: "space" },
  { level: 25, gridSize: 8, theme: "emojis" },
  { level: 26, gridSize: 8, theme: "animals" },
  { level: 27, gridSize: 8, theme: "food" },
  { level: 28, gridSize: 8, theme: "space" },
  { level: 29, gridSize: 8, theme: "emojis" },
  { level: 30, gridSize: 8, theme: "animals" },
];

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "gradient1";
  document.body.className = savedTheme;
  showScreen("instructions-screen");
});

// Screen Management
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

function showMainMenu() {
  showScreen("main-menu");
}

function showModes() {
  showScreen("modes-screen");
}

function showSettings() {
  showScreen("settings-screen");
}

function showLevels() {
  renderLevels();
  showScreen("levels-screen");
}

function exitGame() {
  if (gameState.isLevelMode) {
    showLevels();
  } else {
    showModes();
  }
}

// Levels System
function renderLevels() {
  const grid = document.getElementById("levels-grid");
  const progress = getLevelProgress();
  const highestUnlocked = progress.highestUnlocked || 1;
  const totalStars = progress.totalStars || 0;
  const completedLevels = Object.keys(progress.levels || {}).length;

  // Update progress info
  document.getElementById(
    "level-progress"
  ).textContent = `${completedLevels}/30 Complete`;
  document.getElementById("total-stars").textContent = `⭐ ${totalStars}`;

  grid.innerHTML = "";

  for (let i = 1; i <= 30; i++) {
    const levelData = progress.levels[i];
    const isLocked = i > highestUnlocked;
    const isCompleted = levelData && levelData.completed;

    const card = document.createElement("div");
    card.className = `level-card ${isLocked ? "locked" : ""} ${
      isCompleted ? "completed" : ""
    }`;

    if (isLocked) {
      card.innerHTML = `<div class="locked-icon">🔒</div>`;
    } else {
      const stars = levelData ? levelData.stars : 0;
      const starsHtml = Array(3)
        .fill(0)
        .map((_, idx) => (idx < stars ? "⭐" : "☆"))
        .join("");

      card.innerHTML = `
                <div class="level-badge">${i}</div>
                <div class="level-number">${i}</div>
                ${
                  isCompleted
                    ? `<div class="level-stars">${starsHtml}</div>`
                    : ""
                }
            `;
      card.onclick = () => startLevel(i);
    }

    grid.appendChild(card);
  }
}

function getLevelProgress() {
  const saved = localStorage.getItem("levelProgress");
  return saved
    ? JSON.parse(saved)
    : { highestUnlocked: 1, totalStars: 0, levels: {} };
}

function saveLevelProgress(level, stars, time, moves) {
  const progress = getLevelProgress();

  const currentLevelData = progress.levels[level];
  const isNewBest =
    !currentLevelData ||
    stars > currentLevelData.stars ||
    (stars === currentLevelData.stars && time < currentLevelData.time);

  if (isNewBest) {
    // Remove old stars if updating
    if (currentLevelData) {
      progress.totalStars -= currentLevelData.stars;
    }

    progress.levels[level] = { completed: true, stars, time, moves };
    progress.totalStars += stars;
  }

  // Unlock next level
  if (level >= progress.highestUnlocked && level < 30) {
    progress.highestUnlocked = level + 1;
  }

  localStorage.setItem("levelProgress", JSON.stringify(progress));
  return isNewBest;
}

// Start Level
function startLevel(level) {
  gameState.currentLevel = level;
  gameState.isLevelMode = true;

  const config = levelConfig[level - 1];
  startGame(config.gridSize, null, config.theme);
}

// Start Quick Game
function startQuickGame(gridSize = 4, timeLimit = null, theme = "emojis") {
  gameState.isLevelMode = false;
  startGame(gridSize, timeLimit, theme);
}

// Game Functions
function startGame(gridSize = 4, timeLimit = null, theme = "emojis") {
  gameState.gridSize = gridSize;
  gameState.timeLimit = timeLimit;
  gameState.theme = theme;
  gameState.moves = 0;
  gameState.time = 0;
  gameState.matchedPairs = 0;
  gameState.flippedCards = [];

  // Update level display
  const levelDisplay = document.getElementById("current-level-display");
  if (gameState.isLevelMode) {
    levelDisplay.textContent = `Level ${gameState.currentLevel}`;
  } else {
    levelDisplay.textContent = `${gridSize}×${gridSize} - ${
      theme.charAt(0).toUpperCase() + theme.slice(1)
    }`;
  }

  // Generate cards
  const totalPairs = (gridSize * gridSize) / 2;
  const selectedTheme = themes[theme];
  const selectedEmojis = selectedTheme.slice(0, totalPairs);
  const cardPairs = [...selectedEmojis, ...selectedEmojis];

  // Shuffle cards
  gameState.cards = cardPairs
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji: emoji,
      flipped: false,
      matched: false,
    }));

  // Render game board
  renderGameBoard();

  // Start timer
  if (gameState.timer) clearInterval(gameState.timer);
  gameState.timer = setInterval(updateTimer, 1000);

  // Show game screen
  showScreen("game-screen");
}

function renderGameBoard() {
  const board = document.getElementById("game-board");
  board.className = `game-board size-${gameState.gridSize}`;
  board.innerHTML = "";

  gameState.cards.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "memory-card";
    cardEl.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back">
                    <div class="card-back-text">?</div>
                </div>
                <div class="card-face card-front">
                    <div class="card-emoji">${card.emoji}</div>
                </div>
            </div>
        `;

    cardEl.addEventListener("click", () => flipCard(index));
    board.appendChild(cardEl);
  });

  updateStats();
}

function flipCard(index) {
  const card = gameState.cards[index];

  if (card.flipped || card.matched || gameState.flippedCards.length >= 2) {
    return;
  }

  card.flipped = true;
  gameState.flippedCards.push(index);

  const cardEl = document.querySelectorAll(".memory-card")[index];
  cardEl.classList.add("flipped");

  if (gameState.flippedCards.length === 2) {
    gameState.moves++;
    updateStats();
    checkMatch();
  }
}

function checkMatch() {
  const [index1, index2] = gameState.flippedCards;
  const card1 = gameState.cards[index1];
  const card2 = gameState.cards[index2];

  if (card1.emoji === card2.emoji) {
    card1.matched = true;
    card2.matched = true;
    gameState.matchedPairs++;

    const cardEl1 = document.querySelectorAll(".memory-card")[index1];
    const cardEl2 = document.querySelectorAll(".memory-card")[index2];
    cardEl1.classList.add("matched");
    cardEl2.classList.add("matched");

    gameState.flippedCards = [];

    if (
      gameState.matchedPairs ===
      (gameState.gridSize * gameState.gridSize) / 2
    ) {
      setTimeout(showWinModal, 500);
    }
  } else {
    setTimeout(() => {
      card1.flipped = false;
      card2.flipped = false;

      const cardEl1 = document.querySelectorAll(".memory-card")[index1];
      const cardEl2 = document.querySelectorAll(".memory-card")[index2];
      cardEl1.classList.remove("flipped");
      cardEl2.classList.remove("flipped");

      gameState.flippedCards = [];
    }, 1000);
  }
}

function updateTimer() {
  gameState.time++;
  updateStats();

  if (gameState.timeLimit && gameState.time >= gameState.timeLimit) {
    clearInterval(gameState.timer);
    alert("Time's up! Try again!");
    resetGame();
  }
}

function updateStats() {
  document.getElementById("timer").textContent = `${gameState.time}s`;
  document.getElementById("moves").textContent = gameState.moves;
}

function resetGame() {
  if (gameState.timer) clearInterval(gameState.timer);
  if (gameState.isLevelMode) {
    startLevel(gameState.currentLevel);
  } else {
    startGame(gameState.gridSize, gameState.timeLimit, gameState.theme);
  }
}

function showWinModal() {
  if (gameState.timer) clearInterval(gameState.timer);

  const totalPairs = (gameState.gridSize * gameState.gridSize) / 2;
  const perfectMoves = totalPairs;
  let stars = 3;
  if (gameState.moves > perfectMoves + 10) stars = 1;
  else if (gameState.moves > perfectMoves + 5) stars = 2;

  const starsHtml = Array(3)
    .fill(0)
    .map((_, i) => (i < stars ? "⭐" : "☆"))
    .join("");

  document.getElementById("stars-display").innerHTML = starsHtml;
  document.getElementById("final-time").textContent = `${gameState.time}s`;
  document.getElementById("final-moves").textContent = gameState.moves;

  // Check if new best
  let isNewBest = false;
  if (gameState.isLevelMode) {
    isNewBest = saveLevelProgress(
      gameState.currentLevel,
      stars,
      gameState.time,
      gameState.moves
    );
    document.getElementById(
      "modal-title"
    ).textContent = `Level ${gameState.currentLevel} Complete!`;

    // Update next level button
    const nextBtn = document.getElementById("next-level-btn");
    if (gameState.currentLevel < 30) {
      nextBtn.style.display = "block";
      nextBtn.textContent = "Next Level";
    } else {
      nextBtn.textContent = "All Levels Complete! 🎉";
      nextBtn.onclick = showLevels;
    }
  } else {
    document.getElementById("modal-title").textContent = "Game Completed!";
    document.getElementById("next-level-btn").style.display = "none";
  }

  // Show new best indicator
  const newBestEl = document.getElementById("new-best");
  if (isNewBest) {
    newBestEl.classList.add("show");
  } else {
    newBestEl.classList.remove("show");
  }

  document.getElementById("win-modal").classList.add("active");
}

function nextLevel() {
  if (gameState.currentLevel < 30) {
    document.getElementById("win-modal").classList.remove("active");
    startLevel(gameState.currentLevel + 1);
  } else {
    showLevels();
  }
}

// Settings
function changeTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);

  document.querySelectorAll(".theme-option").forEach((option) => {
    option.classList.remove("active");
  });
  document.querySelector(`.theme-option.${theme}`).classList.add("active");
}

function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  const icon = document.getElementById("sound-icon");
  const toggle = document.getElementById("sound-toggle");

  if (icon) {
    icon.textContent = gameState.soundEnabled ? "🔊" : "🔇";
  }
  if (toggle) {
    toggle.checked = gameState.soundEnabled;
  }
}

function resetProgress() {
  if (
    confirm(
      "Are you sure you want to reset ALL progress? This will delete all your stars and level completions!"
    )
  ) {
    localStorage.removeItem("levelProgress");
    alert("Progress reset! Starting fresh!");
    showLevels();
  }
}

// Close modal
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("active");
  }
});
