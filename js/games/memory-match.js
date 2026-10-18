/**
 * SAVOR ARCADE: GAME 2 - FOOD MEMORY MATCH
 * Responsive 3D card flips with typographic culinary emblems. Emojis removed.
 */

class MemoryMatchGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.difficulty = 'easy'; // easy (4 pairs), medium (6 pairs), hard (8 pairs)
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalPairs = 4;
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.isLocked = false;
    this.hasStarted = false;

    // Clean typographic emblems
    this.foodItems = [
      { id: 'pizza', code: 'PIZZA', name: 'Woodfired' },
      { id: 'burger', code: 'BURGER', name: 'Double Smash' },
      { id: 'taco', code: 'TACO', name: 'Crisp Shell' },
      { id: 'sushi', code: 'NIGIRI', name: 'Salmon Cut' },
      { id: 'noodles', code: 'NOODLE', name: 'Wok Pulled' },
      { id: 'bakery', code: 'BAKERY', name: 'Brioche' },
      { id: 'gelato', code: 'GELATO', name: 'Vanilla Bean' },
      { id: 'cocoa', code: 'COCOA', name: 'Valrhona Pot' }
    ];

    this.initUI();
    this.setupEvents();
  }

  initUI() {
    this.container.innerHTML = `
      <div class="game-wrapper memory-game-container">
        <!-- Game HUD -->
        <div class="game-hud">
          <div class="hud-stat">
            <span class="hud-label">MOVES</span>
            <span class="hud-val font-mono" id="memory-moves">0</span>
          </div>
          <div class="hud-stat text-center">
            <span class="hud-label">TIME</span>
            <span class="hud-val font-mono" id="memory-timer">00:00</span>
          </div>
          <div class="hud-stat text-right">
            <span class="hud-label">MATCHED</span>
            <span class="hud-val text-gold font-mono" id="memory-matches">0 / 4</span>
          </div>
        </div>

        <!-- Difficulty Bar -->
        <div class="memory-difficulty-bar">
          <button class="diff-btn active" data-diff="easy">Easy (8)</button>
          <button class="diff-btn" data-diff="medium">Medium (12)</button>
          <button class="diff-btn" data-diff="hard">Hard (16)</button>
        </div>

        <!-- Cards Grid Container -->
        <div class="memory-viewport">
          <div class="memory-grid grid-easy" id="memory-grid"></div>

          <!-- Victory Modal -->
          <div class="game-overlay hidden" id="memory-victory-screen">
            <div class="overlay-card">
              <span class="pill-badge pill-chef" style="margin-bottom: 0.75rem;">CHALLENGE COMPLETE</span>
              <h3 class="overlay-title">ALL PAIRS MATCHED</h3>
              <p class="overlay-desc">Excellent culinary memory! Every table pair identified.</p>
              <div class="score-summary-card">
                <div class="score-col">
                  <span>FINAL TIME</span>
                  <strong class="text-xl text-gold font-mono" id="memory-final-time">00:00</strong>
                </div>
                <div class="score-divider"></div>
                <div class="score-col">
                  <span>TOTAL MOVES</span>
                  <strong class="text-xl font-mono" id="memory-final-moves">0</strong>
                </div>
              </div>
              <div class="best-record-pill mt-3" id="memory-best-pill">
                Table Record: <span class="font-mono" id="memory-best-time">--:--</span>
              </div>
              <div class="mt-4">
                <button class="btn btn-gold btn-lg w-full" id="memory-replay-btn">PLAY AGAIN</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderCards();
  }

  setupEvents() {
    const diffBtns = this.container.querySelectorAll('.diff-btn');
    diffBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        diffBtns.forEach((b) => b.classList.remove('active'));
        e.target.classList.add('active');
        this.difficulty = e.target.getAttribute('data-diff');
        this.startNewGame();
      });
    });

    const replayBtn = document.getElementById('memory-replay-btn');
    const victoryScreen = document.getElementById('memory-victory-screen');

    const handleRestart = (e) => {
      e?.stopPropagation();
      this.startNewGame();
    };

    replayBtn?.addEventListener('click', handleRestart);
    victoryScreen?.addEventListener('click', handleRestart);
  }

  startNewGame() {
    this.stopTimer();
    this.timer = 0;
    this.moves = 0;
    this.matchedPairs = 0;
    this.flippedCards = [];
    this.isLocked = false;
    this.hasStarted = false;

    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-timer').textContent = '00:00';
    document.getElementById('memory-victory-screen')?.classList.add('hidden');

    this.renderCards();
  }

  renderCards() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;

    let pairCount = 4;
    let gridClass = 'grid-easy';

    if (this.difficulty === 'medium') {
      pairCount = 6;
      gridClass = 'grid-medium';
    } else if (this.difficulty === 'hard') {
      pairCount = 8;
      gridClass = 'grid-hard';
    }

    this.totalPairs = pairCount;
    document.getElementById('memory-matches').textContent = `0 / ${this.totalPairs}`;

    grid.className = `memory-grid ${gridClass}`;
    grid.innerHTML = '';

    const selectedFoods = this.foodItems.slice(0, pairCount);
    const cardDeck = [...selectedFoods, ...selectedFoods];

    for (let i = cardDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]];
    }

    this.cards = cardDeck.map((item, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      cardEl.dataset.id = item.id;
      cardEl.dataset.index = index;
      cardEl.setAttribute('role', 'button');
      cardEl.setAttribute('tabindex', '0');
      cardEl.setAttribute('aria-label', `Card ${index + 1}`);

      cardEl.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <span class="card-crest">S</span>
          </div>
          <div class="card-back">
            <span class="card-emblem-text font-mono">${item.code}</span>
            <span class="card-emblem-sub">${item.name}</span>
          </div>
        </div>
      `;

      cardEl.addEventListener('click', () => this.handleCardClick(cardEl, item));
      cardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardClick(cardEl, item);
        }
      });

      grid.appendChild(cardEl);
      return { el: cardEl, item, isMatched: false };
    });
  }

  handleCardClick(cardEl, item) {
    if (this.isLocked) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    if (!this.hasStarted) {
      this.hasStarted = true;
      this.startTimer();
    }

    cardEl.classList.add('flipped');
    if (window.SavorAudio) window.SavorAudio.playCardFlip();
    this.flippedCards.push({ el: cardEl, item });

    if (this.flippedCards.length === 2) {
      this.moves++;
      document.getElementById('memory-moves').textContent = this.moves;
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    const [card1, card2] = this.flippedCards;

    if (card1.item.id === card2.item.id) {
      setTimeout(() => {
        card1.el.classList.add('matched');
        card2.el.classList.add('matched');
        if (window.SavorAudio) window.SavorAudio.playMatch();

        this.matchedPairs++;
        document.getElementById('memory-matches').textContent = `${this.matchedPairs} / ${this.totalPairs}`;
        this.flippedCards = [];
        this.isLocked = false;

        if (this.matchedPairs === this.totalPairs) {
          this.victory();
        }
      }, 350);
    } else {
      setTimeout(() => {
        card1.el.classList.remove('flipped');
        card2.el.classList.remove('flipped');
        this.flippedCards = [];
        this.isLocked = false;
      }, 850);
    }
  }

  startTimer() {
    this.stopTimer();
    const startTime = Date.now() - (this.timer * 1000);
    this.timerInterval = setInterval(() => {
      this.timer = Math.floor((Date.now() - startTime) / 1000);
      const mins = String(Math.floor(this.timer / 60)).padStart(2, '0');
      const secs = String(this.timer % 60).padStart(2, '0');
      const timerEl = document.getElementById('memory-timer');
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 500);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  victory() {
    this.stopTimer();
    if (window.SavorAudio) window.SavorAudio.playWin();

    const mins = String(Math.floor(this.timer / 60)).padStart(2, '0');
    const secs = String(this.timer % 60).padStart(2, '0');
    const timeFormatted = `${mins}:${secs}`;

    const storageKey = `savor_memory_best_${this.difficulty}`;
    let bestTime = localStorage.getItem(storageKey);

    if (!bestTime || this.timer < parseInt(bestTime, 10)) {
      bestTime = this.timer;
      try {
        localStorage.setItem(storageKey, bestTime);
      } catch (e) {}
    }

    const bMins = String(Math.floor(parseInt(bestTime, 10) / 60)).padStart(2, '0');
    const bSecs = String(parseInt(bestTime, 10) % 60).padStart(2, '0');

    document.getElementById('memory-final-time').textContent = timeFormatted;
    document.getElementById('memory-final-moves').textContent = this.moves;
    document.getElementById('memory-best-time').textContent = `${bMins}:${bSecs}`;

    document.getElementById('memory-victory-screen')?.classList.remove('hidden');
  }

  stop() {
    this.stopTimer();
  }
}

window.MemoryMatchGame = MemoryMatchGame;
