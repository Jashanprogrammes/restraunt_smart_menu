/**
 * SAVOR ARCADE HUB CONTROLLER
 * Manages arcade state, game launching, switching, high score sync, and cleanup.
 */

class ArcadeHub {
  constructor() {
    this.activeGameInstance = null;
    this.activeGameId = null;

    this.hubEl = document.getElementById('arcade-hub-view');
    this.playContainerEl = document.getElementById('arcade-play-view');
    this.gameTitleEl = document.getElementById('active-game-header-title');
    this.gameControlsNoteEl = document.getElementById('active-game-controls-note');

    this.init();
  }

  init() {
    this.renderArcadeCards();
    this.setupEvents();
    this.updateSoundToggleUI();
  }

  renderArcadeCards() {
    const listEl = document.getElementById('arcade-games-list');
    if (!listEl) return;

    const burgerBest = localStorage.getItem('savor_burger_best') || '0';
    const catchBest = localStorage.getItem('savor_catch_best') || '0';
    const memEasyBest = localStorage.getItem('savor_memory_best_easy');
    const memoryBestStr = memEasyBest ? `${memEasyBest}s` : '--';

    listEl.innerHTML = SAVOR_CONFIG.arcade.games.map((g) => {
      let recordBadge = '';
      if (g.id === 'burger-stack') {
        recordBadge = `<span class="game-record-tag">Record: ${burgerBest} floors</span>`;
      } else if (g.id === 'catch-food') {
        recordBadge = `<span class="game-record-tag">Record: ${catchBest} pts</span>`;
      } else if (g.id === 'memory-match') {
        recordBadge = `<span class="game-record-tag">Best: ${memoryBestStr}</span>`;
      } else {
        recordBadge = `<span class="game-record-tag">AI or 2-Player</span>`;
      }

      return `
        <div class="arcade-card" data-game-id="${g.id}">
          <div class="arcade-card-banner">
            <span class="game-emoji">${g.icon}</span>
            <div class="arcade-badge-group">
              <span class="badge badge-gold">${g.badge}</span>
              ${recordBadge}
            </div>
          </div>
          <div class="arcade-card-content">
            <h3 class="arcade-game-title">${g.title}</h3>
            <p class="arcade-game-desc">${g.desc}</p>
            <div class="arcade-game-footer">
              <span class="arcade-controls-tip">Controls: ${g.controls}</span>
              <button class="btn btn-gold btn-sm play-game-btn" data-game-id="${g.id}">
                <span>PLAY NOW</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers to cards
    listEl.querySelectorAll('.play-game-btn, .arcade-card').forEach((el) => {
      el.addEventListener('click', (e) => {
        const gameId = el.getAttribute('data-game-id') || el.closest('.arcade-card')?.getAttribute('data-game-id');
        if (gameId) {
          this.launchGame(gameId);
        }
      });
    });
  }

  setupEvents() {
    // Back to Arcade Hub button
    const backToHubBtn = document.getElementById('back-to-arcade-hub-btn');
    backToHubBtn?.addEventListener('click', () => {
      this.closeActiveGame();
    });

    // Sound toggle in arcade
    const soundToggleBtn = document.getElementById('arcade-sound-toggle');
    soundToggleBtn?.addEventListener('click', () => {
      if (window.SavorAudio) {
        const isMuted = window.SavorAudio.toggleMute();
        this.updateSoundToggleUI(isMuted);
      }
    });

    // Quick Return to Menu button
    const returnToMenuBtns = document.querySelectorAll('.return-to-menu-btn');
    returnToMenuBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closeActiveGame();
        const menuSection = document.getElementById('menu-section');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  updateSoundToggleUI(isMuted) {
    if (isMuted === undefined && window.SavorAudio) {
      isMuted = window.SavorAudio.isMuted;
    }
    const btns = document.querySelectorAll('.sound-toggle-btn');
    btns.forEach((btn) => {
      if (isMuted) {
        btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
          <span class="sound-status-label">Muted</span>
        `;
        btn.classList.add('muted');
        btn.setAttribute('aria-label', 'Sound Muted. Tap to enable audio.');
      } else {
        btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          <span class="sound-status-label text-gold">Sound On</span>
        `;
        btn.classList.remove('muted');
        btn.setAttribute('aria-label', 'Sound Enabled. Tap to mute.');
      }
    });
  }

  launchGame(gameId) {
    this.closeActiveGame();

    const gameDef = SAVOR_CONFIG.arcade.games.find((g) => g.id === gameId);
    if (!gameDef) return;

    this.activeGameId = gameId;

    if (this.gameTitleEl) {
      this.gameTitleEl.textContent = `${gameDef.icon} ${gameDef.title}`;
    }
    if (this.gameControlsNoteEl) {
      this.gameControlsNoteEl.textContent = gameDef.controls;
    }

    // Toggle views
    if (this.hubEl) this.hubEl.classList.add('hidden');
    if (this.playContainerEl) {
      this.playContainerEl.classList.remove('hidden');
      // Scroll into view comfortably
      this.playContainerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Instantiate game
    const gameAreaId = 'active-game-canvas-area';
    const area = document.getElementById(gameAreaId);
    if (!area) return;
    area.innerHTML = '';

    if (gameId === 'burger-stack') {
      this.activeGameInstance = new window.BurgerStackGame(gameAreaId);
    } else if (gameId === 'memory-match') {
      this.activeGameInstance = new window.MemoryMatchGame(gameAreaId);
    } else if (gameId === 'catch-food') {
      this.activeGameInstance = new window.CatchFoodGame(gameAreaId);
    } else if (gameId === 'tic-tac-toe') {
      this.activeGameInstance = new window.TicTacToeGame(gameAreaId);
    }
  }

  closeActiveGame() {
    if (this.activeGameInstance && typeof this.activeGameInstance.stop === 'function') {
      this.activeGameInstance.stop();
    }
    this.activeGameInstance = null;
    this.activeGameId = null;

    if (this.playContainerEl) this.playContainerEl.classList.add('hidden');
    if (this.hubEl) this.hubEl.classList.remove('hidden');

    // Refresh cards to update high scores
    this.renderArcadeCards();
  }
}

window.ArcadeHub = ArcadeHub;
