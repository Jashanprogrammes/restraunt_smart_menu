/**
 * SAVOR ARCADE: GAME 1 - BURGER STACK
 * True physics/overlap slice-stacking mechanics on HTML5 Canvas.
 * Fully responsive across all mobile & desktop viewports. Emojis removed.
 */

class BurgerStackGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('savor_burger_best') || '0', 10);
    this.cameraY = 0;
    this.targetCameraY = 0;

    // Game items sequence
    this.ingredientTypes = [
      { type: 'patty', label: 'Grilled Angus Patty', height: 26, color: '#4a2511', detailColor: '#2b1307' },
      { type: 'cheese', label: 'Melted Cheddar', height: 16, color: '#f59e0b', detailColor: '#d97706' },
      { type: 'lettuce', label: 'Crisp Lettuce', height: 18, color: '#22c55e', detailColor: '#16a34a' },
      { type: 'tomato', label: 'San Marzano Tomato', height: 20, color: '#ef4444', detailColor: '#dc2626' },
      { type: 'onion', label: 'Caramelized Onion', height: 16, color: '#a855f7', detailColor: '#7e22ce' },
      { type: 'bacon', label: 'Crispy Smoked Strip', height: 16, color: '#b91c1c', detailColor: '#7f1d1d' },
      { type: 'patty', label: 'Double Smashed Patty', height: 26, color: '#4a2511', detailColor: '#2b1307' },
      { type: 'cheese', label: 'Aged Fontina Cheese', height: 16, color: '#fcd34d', detailColor: '#f59e0b' }
    ];

    this.stack = [];
    this.fallingCuts = [];
    this.particles = [];
    this.floatingTexts = [];

    this.currentPiece = null;
    this.baseWidth = 240;
    this.speed = 3.5;
    this.direction = 1;

    this.initUI();
    this.setupEvents();
  }

  initUI() {
    this.container.innerHTML = `
      <div class="game-wrapper burger-game-container">
        <!-- Game HUD -->
        <div class="game-hud">
          <div class="hud-stat">
            <span class="hud-label">STACK HEIGHT</span>
            <span class="hud-val font-mono" id="burger-score">0</span>
          </div>
          <div class="hud-controls">
            <button class="btn-icon" id="burger-pause-btn" title="Pause Game" aria-label="Pause Game">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            </button>
            <button class="btn-icon" id="burger-restart-btn" title="Restart" aria-label="Restart Game">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>
          </div>
          <div class="hud-stat text-right">
            <span class="hud-label">RECORD</span>
            <span class="hud-val text-gold font-mono" id="burger-best">${this.bestScore}</span>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="canvas-viewport" id="burger-canvas-viewport">
          <canvas id="burger-canvas"></canvas>

          <!-- Start Screen Overlay -->
          <div class="game-overlay" id="burger-start-screen">
            <div class="overlay-card">
              <span class="pill-badge pill-chef" style="margin-bottom: 0.75rem;">ARCADE PHYSICS</span>
              <h3 class="overlay-title">BURGER STACK</h3>
              <p class="overlay-desc">Tap or click when the ingredient is centered over the stack. Precision keeps your burger wide; overhang trims off!</p>
              <div class="overlay-hints">
                <span>Aim for the center of the stack</span>
                <span>Perfect alignment grants bonus points</span>
                <span>Speed increases as the burger grows</span>
              </div>
              <button class="btn btn-gold btn-lg w-full" id="burger-start-play-btn">START STACKING</button>
            </div>
          </div>

          <!-- Pause Overlay -->
          <div class="game-overlay hidden" id="burger-pause-screen">
            <div class="overlay-card">
              <h3 class="overlay-title">GAME PAUSED</h3>
              <p class="overlay-desc">Take your time. Your towering burger is waiting!</p>
              <button class="btn btn-gold btn-lg w-full" id="burger-resume-btn">RESUME</button>
            </div>
          </div>

          <!-- Game Over Overlay -->
          <div class="game-overlay hidden" id="burger-over-screen">
            <div class="overlay-card">
              <span class="pill-badge pill-bestseller" style="margin-bottom: 0.75rem;" id="burger-over-badge">STACK COMPLETE</span>
              <h3 class="overlay-title" id="burger-over-title">STACK COLLAPSED</h3>
              <p class="overlay-desc" id="burger-over-msg">Your ingredient sailed past the burger.</p>
              <div class="score-summary-card">
                <div class="score-col">
                  <span>FINAL HEIGHT</span>
                  <strong class="text-xl" id="burger-final-score">0</strong>
                </div>
                <div class="score-divider"></div>
                <div class="score-col">
                  <span>BEST RECORD</span>
                  <strong class="text-xl text-gold" id="burger-final-best">0</strong>
                </div>
              </div>
              <div class="mt-4">
                <button class="btn btn-gold btn-lg w-full" id="burger-play-again-btn">TRY AGAIN</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('burger-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }

  resizeCanvas() {
    const viewport = document.getElementById('burger-canvas-viewport');
    if (!viewport || !this.canvas) return;
    const rect = viewport.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = Math.floor(rect.width || viewport.clientWidth || 320);
    this.height = Math.floor(rect.height || viewport.clientHeight || 340);

    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.baseWidth = Math.min(Math.max(this.width * 0.6, 170), 220);
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      if (this.container && this.container.offsetParent !== null) {
        this.resizeCanvas();
      }
    });

    const startBtn = document.getElementById('burger-start-play-btn');
    const pauseBtn = document.getElementById('burger-pause-btn');
    const resumeBtn = document.getElementById('burger-resume-btn');
    const restartBtn = document.getElementById('burger-restart-btn');
    const playAgainBtn = document.getElementById('burger-play-again-btn');
    const startScreen = document.getElementById('burger-start-screen');
    const overScreen = document.getElementById('burger-over-screen');
    const viewport = document.getElementById('burger-canvas-viewport');

    const handleStartOrReplay = (e) => {
      e?.stopPropagation();
      this.startGame();
    };

    startBtn?.addEventListener('click', handleStartOrReplay);
    playAgainBtn?.addEventListener('click', handleStartOrReplay);
    startScreen?.addEventListener('click', handleStartOrReplay);
    overScreen?.addEventListener('click', handleStartOrReplay);

    pauseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePause();
    });

    resumeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePause();
    });

    restartBtn?.addEventListener('click', handleStartOrReplay);

    viewport?.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || e.target.closest('.game-overlay:not(.hidden)')) {
        return;
      }
      e.preventDefault();
      if (this.isPlaying && !this.isPaused) {
        this.dropPiece();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.isPlaying && !this.isPaused) {
        const rect = this.container.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          e.preventDefault();
          this.dropPiece();
        }
      }
    });
  }

  startGame() {
    this.resizeCanvas();
    this.isPlaying = true;
    this.isPaused = false;
    this.score = 0;
    this.speed = 3.6;
    this.direction = 1;
    this.cameraY = 0;
    this.targetCameraY = 0;
    this.stack = [];
    this.fallingCuts = [];
    this.particles = [];
    this.floatingTexts = [];

    document.getElementById('burger-start-screen')?.classList.add('hidden');
    document.getElementById('burger-pause-screen')?.classList.add('hidden');
    document.getElementById('burger-over-screen')?.classList.add('hidden');
    document.getElementById('burger-score').textContent = '0';

    const plateY = this.height - 40;
    const baseBunWidth = this.baseWidth;
    const baseBunX = (this.width - baseBunWidth) / 2;

    this.stack.push({
      x: baseBunX,
      y: plateY - 32,
      width: baseBunWidth,
      height: 32,
      type: 'bun-bottom',
      label: 'Toasted Brioche Base',
      color: '#d97706',
      detailColor: '#b45309'
    });

    this.spawnNextPiece();

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.loop();
  }

  spawnNextPiece() {
    const topLayer = this.stack[this.stack.length - 1];
    const itemDef = this.ingredientTypes[(this.score) % this.ingredientTypes.length];

    const currentWidth = topLayer.width;
    const pieceHeight = itemDef.height;
    const targetY = topLayer.y - pieceHeight;

    this.direction = Math.random() > 0.5 ? 1 : -1;
    const startX = this.direction === 1 ? -currentWidth : this.width;

    this.currentPiece = {
      x: startX,
      y: targetY,
      width: currentWidth,
      height: pieceHeight,
      type: itemDef.type,
      label: itemDef.label,
      color: itemDef.color,
      detailColor: itemDef.detailColor
    };

    if (targetY < this.height * 0.45) {
      this.targetCameraY = (this.height * 0.45) - targetY;
    }
  }

  dropPiece() {
    if (!this.currentPiece || !this.isPlaying) return;

    const topLayer = this.stack[this.stack.length - 1];
    const cur = this.currentPiece;

    const curLeft = cur.x;
    const curRight = cur.x + cur.width;
    const topLeft = topLayer.x;
    const topRight = topLayer.x + topLayer.width;

    const overlapLeft = Math.max(curLeft, topLeft);
    const overlapRight = Math.min(curRight, topRight);
    const overlapWidth = overlapRight - overlapLeft;

    if (overlapWidth <= 0) {
      if (window.SavorAudio) window.SavorAudio.playBomb();
      this.fallingCuts.push({
        x: cur.x,
        y: cur.y,
        width: cur.width,
        height: cur.height,
        color: cur.color,
        vy: 3,
        vx: this.direction * 4,
        rot: 0,
        vrot: 0.08
      });
      this.currentPiece = null;
      this.gameOver('MISSED THE STACK', 'Your ingredient sailed past the burger.');
      return;
    }

    const diff = Math.abs(curLeft - topLeft);
    let finalX = overlapLeft;
    let finalWidth = overlapWidth;

    if (diff < 6) {
      finalX = topLeft;
      finalWidth = topLayer.width;
      this.score += 2;
      if (window.SavorAudio) window.SavorAudio.playPerfect();
      this.addFloatingText('PERFECT! +2', finalX + finalWidth / 2, cur.y, '#E2A93E');
      this.createSparks(finalX + finalWidth / 2, cur.y + cur.height / 2, '#E2A93E', 15);
    } else {
      this.score += 1;
      if (window.SavorAudio) window.SavorAudio.playDrop();

      let cutX, cutWidth, cutVx;
      if (curLeft < topLeft) {
        cutX = curLeft;
        cutWidth = topLeft - curLeft;
        cutVx = -3;
      } else {
        cutX = topRight;
        cutWidth = curRight - topRight;
        cutVx = 3;
      }

      this.fallingCuts.push({
        x: cutX,
        y: cur.y,
        width: cutWidth,
        height: cur.height,
        color: cur.color,
        vy: 2,
        vx: cutVx,
        rot: 0,
        vrot: cutVx > 0 ? 0.06 : -0.06
      });

      this.createSparks(finalX + (cutVx < 0 ? 0 : finalWidth), cur.y + cur.height, cur.color, 8);
    }

    this.stack.push({
      x: finalX,
      y: cur.y,
      width: finalWidth,
      height: cur.height,
      type: cur.type,
      label: cur.label,
      color: cur.color,
      detailColor: cur.detailColor
    });

    document.getElementById('burger-score').textContent = this.score;

    if (finalWidth < 28) {
      this.gameOver('TOO NARROW', 'The stack became too thin to balance.');
      return;
    }

    this.speed = Math.min(3.6 + (this.score * 0.18), 8.5);
    this.spawnNextPiece();
  }

  addFloatingText(text, x, y, color = '#E2A93E') {
    this.floatingTexts.push({
      text,
      x,
      y,
      color,
      alpha: 1,
      vy: -1.8
    });
  }

  createSparks(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.7) * 5,
        size: Math.random() * 3 + 2,
        color,
        alpha: 1,
        life: 0.95
      });
    }
  }

  togglePause() {
    if (!this.isPlaying) return;
    this.isPaused = !this.isPaused;
    const pauseScreen = document.getElementById('burger-pause-screen');
    if (this.isPaused) {
      pauseScreen?.classList.remove('hidden');
    } else {
      pauseScreen?.classList.add('hidden');
      this.loop();
    }
  }

  gameOver(title, msg) {
    this.isPlaying = false;
    if (window.SavorAudio) window.SavorAudio.playGameOver();

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      try {
        localStorage.setItem('savor_burger_best', this.bestScore);
      } catch (e) {}
      document.getElementById('burger-best').textContent = this.bestScore;
      title = 'NEW TABLE RECORD';
    }

    document.getElementById('burger-final-score').textContent = this.score;
    document.getElementById('burger-final-best').textContent = this.bestScore;
    document.getElementById('burger-over-title').textContent = title;
    document.getElementById('burger-over-msg').textContent = msg;

    const overScreen = document.getElementById('burger-over-screen');
    overScreen?.classList.remove('hidden');
  }

  loop() {
    if (!this.isPlaying || this.isPaused) return;

    this.cameraY += (this.targetCameraY - this.cameraY) * 0.1;

    if (this.currentPiece) {
      this.currentPiece.x += this.speed * this.direction;

      const rightBound = this.width - this.currentPiece.width + 50;
      const leftBound = -50;

      if (this.currentPiece.x >= rightBound) {
        this.currentPiece.x = rightBound;
        this.direction = -1;
      } else if (this.currentPiece.x <= leftBound) {
        this.currentPiece.x = leftBound;
        this.direction = 1;
      }
    }

    for (let i = this.fallingCuts.length - 1; i >= 0; i--) {
      const cut = this.fallingCuts[i];
      cut.y += cut.vy;
      cut.vy += 0.35;
      cut.x += cut.vx;
      cut.rot += cut.vrot;

      if (cut.y - this.cameraY > this.height + 100) {
        this.fallingCuts.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.alpha *= p.life;
      if (p.alpha < 0.05) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.02;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    this.draw();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.save();
    this.ctx.fillStyle = '#141312';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const platterY = this.height - 40 + this.cameraY;
    this.ctx.fillStyle = '#22201D';
    this.ctx.beginPath();
    this.ctx.ellipse(this.width / 2, platterY + 16, this.baseWidth * 0.75, 18, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#383430';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.strokeStyle = 'rgba(226, 169, 62, 0.4)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.ellipse(this.width / 2, platterY + 16, this.baseWidth * 0.7, 14, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    for (const item of this.stack) {
      this.drawIngredient(item.x, item.y + this.cameraY, item.width, item.height, item.type, item.color, item.detailColor);
    }

    if (this.currentPiece) {
      this.drawIngredient(
        this.currentPiece.x,
        this.currentPiece.y + this.cameraY,
        this.currentPiece.width,
        this.currentPiece.height,
        this.currentPiece.type,
        this.currentPiece.color,
        this.currentPiece.detailColor
      );

      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(226, 169, 62, 0.25)';
      this.ctx.setLineDash([4, 4]);
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentPiece.x + this.currentPiece.width / 2, this.currentPiece.y + this.cameraY);
      this.ctx.lineTo(this.currentPiece.x + this.currentPiece.width / 2, this.height);
      this.ctx.stroke();
      this.ctx.restore();
    }

    for (const cut of this.fallingCuts) {
      this.ctx.save();
      this.ctx.translate(cut.x + cut.width / 2, cut.y + cut.height / 2 + this.cameraY);
      this.ctx.rotate(cut.rot);
      this.ctx.fillStyle = cut.color;
      this.ctx.fillRect(-cut.width / 2, -cut.height / 2, cut.width, cut.height);
      this.ctx.restore();
    }

    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y + this.cameraY, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    for (const ft of this.floatingTexts) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.fillStyle = ft.color;
      this.ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y + this.cameraY);
      this.ctx.restore();
    }

    this.ctx.restore();
  }

  drawIngredient(x, y, w, h, type, color, detailColor) {
    this.ctx.save();
    this.ctx.translate(x, y);

    if (type === 'bun-bottom') {
      this.ctx.fillStyle = '#b45309';
      this.ctx.beginPath();
      this.ctx.roundRect(0, 4, w, h - 4, [0, 0, 14, 14]);
      this.ctx.fill();

      this.ctx.fillStyle = '#f59e0b';
      this.ctx.beginPath();
      this.ctx.roundRect(4, 0, w - 8, 8, [4, 4, 0, 0]);
      this.ctx.fill();
    } else if (type === 'patty') {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.roundRect(0, 0, w, h, 6);
      this.ctx.fill();

      this.ctx.strokeStyle = detailColor;
      this.ctx.lineWidth = 3;
      for (let gx = 12; gx < w; gx += 24) {
        this.ctx.beginPath();
        this.ctx.moveTo(gx, 2);
        this.ctx.lineTo(gx + 12, h - 2);
        this.ctx.stroke();
      }
    } else if (type === 'cheese') {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(w, 0);
      this.ctx.lineTo(w - 2, h - 4);
      for (let cx = w - 10; cx > 10; cx -= 25) {
        this.ctx.quadraticCurveTo(cx - 5, h + 5, cx - 12, h - 3);
      }
      this.ctx.lineTo(0, h - 4);
      this.ctx.closePath();
      this.ctx.fill();
    } else if (type === 'lettuce') {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(0, h / 2);
      for (let lx = 0; lx <= w; lx += 14) {
        const my = (lx / 14) % 2 === 0 ? 0 : h;
        this.ctx.lineTo(lx, my);
      }
      this.ctx.lineTo(w, h / 2);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.strokeStyle = detailColor;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(4, h / 2);
      this.ctx.lineTo(w - 4, h / 2);
      this.ctx.stroke();
    } else if (type === 'tomato') {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.roundRect(0, 0, w, h, 8);
      this.ctx.fill();

      this.ctx.fillStyle = '#fca5a5';
      const podCount = Math.max(2, Math.floor(w / 35));
      for (let i = 1; i <= podCount; i++) {
        const px = (w / (podCount + 1)) * i;
        this.ctx.beginPath();
        this.ctx.ellipse(px, h / 2, 6, 4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#7f1d1d';
        this.ctx.beginPath();
        this.ctx.arc(px, h / 2, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    } else {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.roundRect(0, 0, w, h, 5);
      this.ctx.fill();
      this.ctx.fillStyle = detailColor;
      this.ctx.fillRect(4, 2, w - 8, 3);
    }

    this.ctx.restore();
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

window.BurgerStackGame = BurgerStackGame;
