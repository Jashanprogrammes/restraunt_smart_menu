/**
 * SAVOR ARCADE: GAME 4 - PIZZA VS BURGER (TIC-TAC-TOE)
 * Responsive table duel with smart bot AI or local Pass & Play.
 * Optimized mobile round completion, smooth overlay sizing & status cards.
 */

class TicTacToeGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.board = Array(9).fill(null);
    this.turn = 'pizza'; // 'pizza' (P) or 'burger' (B)
    this.mode = 'ai'; // 'ai' or 'pvp'
    this.isGameOver = false;
    this.roundCount = 1;
    this.scores = {
      pizza: 0,
      burger: 0,
      draw: 0
    };

    this.winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    this.initUI();
    this.setupEvents();
  }

  initUI() {
    this.container.innerHTML = `
      <div class="game-wrapper tictac-game-container">
        <!-- Game HUD -->
        <div class="game-hud">
          <div class="hud-stat">
            <span class="hud-label">PIZZA (P)</span>
            <span class="hud-val text-gold font-mono" id="ttt-score-pizza">0</span>
          </div>
          <div class="hud-stat text-center">
            <span class="hud-label">DRAWS</span>
            <span class="hud-val font-mono" id="ttt-score-draw">0</span>
          </div>
          <div class="hud-stat text-right">
            <span class="hud-label">BURGER (B)</span>
            <span class="hud-val text-gold font-mono" id="ttt-score-burger">0</span>
          </div>
        </div>

        <!-- Mode Selector -->
        <div class="ttt-mode-bar">
          <button class="diff-btn active" data-mode="ai">Vs Computer AI</button>
          <button class="diff-btn" data-mode="pvp">Pass &amp; Play (2P)</button>
        </div>

        <!-- Turn / Result Announcement -->
        <div class="ttt-status-card" id="ttt-status-banner">
          <span class="ttt-status-text" id="ttt-status-text">Pizza's Turn to Move</span>
        </div>

        <!-- Tic Tac Toe Grid Viewport -->
        <div class="ttt-viewport" id="ttt-viewport">
          <div class="ttt-board" id="ttt-board">
            ${Array(9).fill(0).map((_, i) => `
              <button class="ttt-cell" data-index="${i}" aria-label="Square ${i + 1}"></button>
            `).join('')}
          </div>

          <!-- Dedicated Scoped Round Result Overlay -->
          <div class="ttt-round-overlay hidden" id="ttt-round-overlay" role="dialog" aria-modal="true" aria-label="Round Result">
            <div class="ttt-overlay-card">
              <div class="ttt-overlay-emblem" id="ttt-round-emblem">🏆</div>
              <span class="ttt-overlay-badge" id="ttt-round-badge">ROUND COMPLETE</span>
              <h3 class="ttt-overlay-title" id="ttt-round-title">PIZZA WINS</h3>
              <p class="ttt-overlay-desc" id="ttt-round-desc">Woodfired crust claims victory this round.</p>
              <button class="btn btn-gold ttt-next-btn" id="ttt-next-round-btn">
                <span>Play Next Round</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex-center mt-3">
          <button class="btn btn-sm btn-outline" id="ttt-reset-scores-btn">Reset Scores</button>
        </div>
      </div>
    `;
  }

  setupEvents() {
    const modeBtns = this.container.querySelectorAll('.ttt-mode-bar .diff-btn');
    modeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        modeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.mode = btn.getAttribute('data-mode');
        this.resetRound();
      });
    });

    const boardEl = document.getElementById('ttt-board');
    boardEl?.addEventListener('click', (e) => {
      const cell = e.target.closest('.ttt-cell');
      if (!cell) return;
      const index = parseInt(cell.getAttribute('data-index'), 10);
      this.handleCellClick(index);
    });

    const nextRoundBtn = document.getElementById('ttt-next-round-btn');
    nextRoundBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetRound();
    });

    const overlay = document.getElementById('ttt-round-overlay');
    overlay?.addEventListener('click', (e) => {
      // Tap anywhere on overlay advances to next round
      this.resetRound();
    });

    const resetScoresBtn = document.getElementById('ttt-reset-scores-btn');
    resetScoresBtn?.addEventListener('click', () => {
      this.scores = { pizza: 0, burger: 0, draw: 0 };
      this.roundCount = 1;
      this.updateScoreboard();
      this.resetRound();
    });
  }

  handleCellClick(index) {
    if (this.isGameOver) return;
    if (this.board[index] !== null) return;

    this.makeMove(index, this.turn);

    if (this.isGameOver) return;

    if (this.mode === 'ai' && this.turn === 'burger') {
      const boardEl = document.getElementById('ttt-board');
      if (boardEl) boardEl.style.pointerEvents = 'none';

      setTimeout(() => {
        if (!this.isGameOver) {
          const bestMove = this.getComputerMove();
          if (bestMove !== -1) {
            this.makeMove(bestMove, 'burger');
          }
        }
        if (boardEl) boardEl.style.pointerEvents = 'auto';
      }, 350);
    }
  }

  makeMove(index, player) {
    this.board[index] = player;
    const cell = this.container.querySelector(`.ttt-cell[data-index="${index}"]`);
    if (cell) {
      cell.classList.add('marked', player);
      cell.innerHTML = player === 'pizza'
        ? `<span class="piece-pizza font-serif">P</span>`
        : `<span class="piece-burger font-serif">B</span>`;
    }

    if (window.SavorAudio) window.SavorAudio.playTap();

    const winResult = this.checkWinner(this.board);
    if (winResult) {
      this.handleWin(winResult);
      return;
    }

    if (this.board.every((c) => c !== null)) {
      this.handleDraw();
      return;
    }

    this.turn = this.turn === 'pizza' ? 'burger' : 'pizza';
    this.updateStatusBanner();
  }

  getComputerMove() {
    // 1. Win if possible
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        const testBoard = [...this.board];
        testBoard[i] = 'burger';
        if (this.checkWinner(testBoard)) return i;
      }
    }

    // 2. Block opponent win
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        const testBoard = [...this.board];
        testBoard[i] = 'pizza';
        if (this.checkWinner(testBoard)) return i;
      }
    }

    // 3. Take center
    if (this.board[4] === null) return 4;

    // 4. Take corners
    const corners = [0, 2, 6, 8].filter((idx) => this.board[idx] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // 5. Take sides
    const sides = [1, 3, 5, 7].filter((idx) => this.board[idx] === null);
    if (sides.length > 0) {
      return sides[Math.floor(Math.random() * sides.length)];
    }

    return -1;
  }

  checkWinner(board) {
    for (const pattern of this.winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], pattern };
      }
    }
    return null;
  }

  handleWin(winResult) {
    this.isGameOver = true;
    const { winner, pattern } = winResult;

    pattern.forEach((idx) => {
      const cell = this.container.querySelector(`.ttt-cell[data-index="${idx}"]`);
      cell?.classList.add('winning-cell');
    });

    this.scores[winner]++;
    this.updateScoreboard();

    if (window.SavorAudio) window.SavorAudio.playWin();

    const isPizza = winner === 'pizza';
    const title = isPizza ? 'PIZZA WINS' : 'BURGER WINS';
    const desc = isPizza
      ? 'Woodfired slice claims victory this round!'
      : 'Iron skillet patty takes the round!';
    const emblem = isPizza ? '🍕' : '🍔';

    // Update banner immediately for feedback
    const banner = document.getElementById('ttt-status-banner');
    const bannerText = document.getElementById('ttt-status-text');
    if (banner && bannerText) {
      banner.classList.remove('winner-pizza', 'winner-burger', 'status-draw');
      banner.classList.add(isPizza ? 'winner-pizza' : 'winner-burger');
      bannerText.textContent = isPizza ? '🏆 Pizza Takes The Round!' : '🏆 Burger Takes The Round!';
    }

    setTimeout(() => {
      if (!this.isGameOver) return;
      const emblemEl = document.getElementById('ttt-round-emblem');
      if (emblemEl) emblemEl.textContent = emblem;
      const titleEl = document.getElementById('ttt-round-title');
      if (titleEl) titleEl.textContent = title;
      const descEl = document.getElementById('ttt-round-desc');
      if (descEl) descEl.textContent = desc;
      const badgeEl = document.getElementById('ttt-round-badge');
      if (badgeEl) badgeEl.textContent = isPizza ? 'PIZZA VICTORY' : 'BURGER VICTORY';

      document.getElementById('ttt-round-overlay')?.classList.remove('hidden');
    }, 450);
  }

  handleDraw() {
    this.isGameOver = true;
    this.scores.draw++;
    this.updateScoreboard();

    if (window.SavorAudio) window.SavorAudio.playDrop();

    // Update banner immediately
    const banner = document.getElementById('ttt-status-banner');
    const bannerText = document.getElementById('ttt-status-text');
    if (banner && bannerText) {
      banner.classList.remove('winner-pizza', 'winner-burger', 'status-draw');
      banner.classList.add('status-draw');
      bannerText.textContent = '🤝 Culinary Tie — Well Matched!';
    }

    setTimeout(() => {
      if (!this.isGameOver) return;
      const emblemEl = document.getElementById('ttt-round-emblem');
      if (emblemEl) emblemEl.textContent = '🤝';
      const titleEl = document.getElementById('ttt-round-title');
      if (titleEl) titleEl.textContent = 'CULINARY TIE';
      const descEl = document.getElementById('ttt-round-desc');
      if (descEl) descEl.textContent = 'Both dishes were too well matched to choose between.';
      const badgeEl = document.getElementById('ttt-round-badge');
      if (badgeEl) badgeEl.textContent = 'ROUND DRAW';

      document.getElementById('ttt-round-overlay')?.classList.remove('hidden');
    }, 400);
  }

  updateScoreboard() {
    const pizzaEl = document.getElementById('ttt-score-pizza');
    const burgerEl = document.getElementById('ttt-score-burger');
    const drawEl = document.getElementById('ttt-score-draw');

    if (pizzaEl) pizzaEl.textContent = this.scores.pizza;
    if (burgerEl) burgerEl.textContent = this.scores.burger;
    if (drawEl) drawEl.textContent = this.scores.draw;
  }

  updateStatusBanner() {
    const banner = document.getElementById('ttt-status-banner');
    const bannerText = document.getElementById('ttt-status-text');
    if (banner) {
      banner.classList.remove('winner-pizza', 'winner-burger', 'status-draw');
    }

    if (!bannerText) return;

    if (this.turn === 'pizza') {
      bannerText.textContent = "Pizza's Turn to Move (P)";
    } else {
      bannerText.textContent = this.mode === 'ai'
        ? "Burger's Turn (Computer AI)"
        : "Burger's Turn to Move (B)";
    }
  }

  resetRound() {
    this.roundCount++;
    this.board = Array(9).fill(null);
    this.isGameOver = false;
    this.turn = 'pizza';

    const cells = this.container.querySelectorAll('.ttt-cell');
    cells.forEach((cell) => {
      cell.className = 'ttt-cell';
      cell.innerHTML = '';
    });

    const banner = document.getElementById('ttt-status-banner');
    banner?.classList.remove('winner-pizza', 'winner-burger', 'status-draw');

    document.getElementById('ttt-round-overlay')?.classList.add('hidden');
    this.updateStatusBanner();
  }

  stop() {
    this.isGameOver = true;
  }
}

window.TicTacToeGame = TicTacToeGame;
