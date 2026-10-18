/**
 * SAVOR ARCADE: GAME 3 - CATCH THE FOOD
 * 30-Second Rapid reflex challenge with combos, touch/mouse follow & Canvas rendering.
 * Emojis removed; clean vector/geometric culinary shapes rendered on canvas.
 */

class CatchFoodGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.timerInterval = null;

    this.isPlaying = false;
    this.isPaused = false;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.timeLeft = 30;
    this.bestScore = parseInt(localStorage.getItem('savor_catch_best') || '0', 10);

    // Basket state
    this.basket = {
      x: 150,
      y: 0,
      width: 90,
      height: 26,
      speed: 8
    };

    this.keys = { left: false, right: false };
    this.fallingItems = [];
    this.particles = [];
    this.floatingScores = [];
    this.spawnTimer = 0;

    // Items definition with vector styling
    this.itemTypes = [
      { type: 'good', label: '10', color: '#E2A93E', points: 10, weight: 4 },
      { type: 'good', label: '15', color: '#F0B74D', points: 15, weight: 3 },
      { type: 'golden', label: '30', color: '#FFD700', points: 30, weight: 1 },
      { type: 'penalty', label: 'TRAP', color: '#EF4444', points: -15, weight: 2 }
    ];

    this.initUI();
    this.setupEvents();
  }

  initUI() {
    this.container.innerHTML = `
      <div class="game-wrapper catch-game-container">
        <!-- Game HUD -->
        <div class="game-hud">
          <div class="hud-stat">
            <span class="hud-label">SCORE</span>
            <span class="hud-val font-mono" id="catch-score">0</span>
          </div>
          <div class="hud-stat text-center">
            <span class="hud-label">TIME LEFT</span>
            <span class="hud-val text-gold font-mono" id="catch-timer">30s</span>
          </div>
          <div class="hud-stat text-right">
            <span class="hud-label">COMBO</span>
            <span class="hud-val font-mono" id="catch-combo">x0</span>
          </div>
        </div>

        <!-- Canvas Viewport -->
        <div class="canvas-viewport" id="catch-viewport" style="touch-action: none;">
          <canvas id="catch-canvas"></canvas>

          <!-- Start Screen -->
          <div class="game-overlay" id="catch-start-screen">
            <div class="overlay-card">
              <span class="pill-badge pill-chef" style="margin-bottom: 0.75rem;">30-SECOND SPRINT</span>
              <h3 class="overlay-title">CATCH THE HARVEST</h3>
              <p class="overlay-desc">Glide your culinary tray horizontally across the screen to catch falling ingredients before time runs out!</p>
              <div class="overlay-hints">
                <span>Gold ingredients award +10 and +15 points</span>
                <span>Star tokens grant +30 points</span>
                <span>Red penalty traps deduct -15 points and reset combo</span>
              </div>
              <button class="btn btn-gold btn-lg w-full" id="catch-start-btn">START SPRINT</button>
            </div>
          </div>

          <!-- Game Over Screen -->
          <div class="game-overlay hidden" id="catch-over-screen">
            <div class="overlay-card">
              <span class="pill-badge pill-bestseller" style="margin-bottom: 0.75rem;">ROUND CONCLUDED</span>
              <h3 class="overlay-title">TIME EXPIRED</h3>
              <p class="overlay-desc">Round finished! Here is your 30-second harvest result:</p>
              <div class="score-summary-card">
                <div class="score-col">
                  <span>FINAL SCORE</span>
                  <strong class="text-xl text-gold font-mono" id="catch-final-score">0</strong>
                </div>
                <div class="score-divider"></div>
                <div class="score-col">
                  <span>MAX COMBO</span>
                  <strong class="text-xl font-mono" id="catch-final-combo">x0</strong>
                </div>
              </div>
              <div class="best-record-pill mt-3">
                Table Record: <span class="font-mono" id="catch-best-score">${this.bestScore}</span>
              </div>
              <div class="mt-4">
                <button class="btn btn-gold btn-lg w-full" id="catch-play-again-btn">PLAY AGAIN</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('catch-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }

  resizeCanvas() {
    const viewport = document.getElementById('catch-viewport');
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

    this.basket.width = Math.min(Math.max(this.width * 0.28, 70), 92);
    this.basket.height = 22;
    this.basket.y = this.height - 34;
    this.basket.x = Math.max(0, Math.min(this.basket.x || (this.width - this.basket.width) / 2, this.width - this.basket.width));
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      if (this.container && this.container.offsetParent !== null) {
        this.resizeCanvas();
      }
    });

    const startBtn = document.getElementById('catch-start-btn');
    const playAgainBtn = document.getElementById('catch-play-again-btn');
    const startScreen = document.getElementById('catch-start-screen');
    const overScreen = document.getElementById('catch-over-screen');
    const viewport = document.getElementById('catch-viewport');

    const handleStart = (e) => {
      e?.stopPropagation();
      this.startGame();
    };

    startBtn?.addEventListener('click', handleStart);
    playAgainBtn?.addEventListener('click', handleStart);
    startScreen?.addEventListener('click', handleStart);
    overScreen?.addEventListener('click', handleStart);

    const moveBasketToPointer = (clientX) => {
      if (!this.isPlaying) return;
      const rect = this.canvas.getBoundingClientRect();
      const pointerX = clientX - rect.left;
      this.basket.x = Math.max(0, Math.min(this.width - this.basket.width, pointerX - this.basket.width / 2));
    };

    viewport?.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || e.target.closest('.game-overlay:not(.hidden)')) return;
      if (this.isPlaying) {
        moveBasketToPointer(e.clientX);
      }
    });

    viewport?.addEventListener('pointermove', (e) => {
      if (this.isPlaying) {
        moveBasketToPointer(e.clientX);
      }
    });

    viewport?.addEventListener('touchstart', (e) => {
      if (e.target.closest('button') || e.target.closest('.game-overlay:not(.hidden)')) return;
      if (this.isPlaying && e.touches.length > 0) {
        moveBasketToPointer(e.touches[0].clientX);
      }
    }, { passive: true });

    viewport?.addEventListener('touchmove', (e) => {
      if (this.isPlaying && e.touches.length > 0) {
        e.preventDefault();
        moveBasketToPointer(e.touches[0].clientX);
      }
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = false;
      }
    });
  }

  startGame() {
    this.resizeCanvas();
    this.isPlaying = true;
    this.isPaused = false;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.timeLeft = 30;
    this.fallingItems = [];
    this.particles = [];
    this.floatingScores = [];
    this.spawnTimer = 0;

    document.getElementById('catch-score').textContent = '0';
    document.getElementById('catch-timer').textContent = '30s';
    document.getElementById('catch-combo').textContent = 'x0';
    document.getElementById('catch-start-screen')?.classList.add('hidden');
    document.getElementById('catch-over-screen')?.classList.add('hidden');

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const timerEl = document.getElementById('catch-timer');
      if (timerEl) timerEl.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        this.gameOver();
      }
    }, 1000);

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.loop();
  }

  spawnItem() {
    const totalWeight = this.itemTypes.reduce((acc, it) => acc + it.weight, 0);
    let rand = Math.random() * totalWeight;
    let chosen = this.itemTypes[0];

    for (const it of this.itemTypes) {
      if (rand < it.weight) {
        chosen = it;
        break;
      }
      rand -= it.weight;
    }

    const itemWidth = 28;
    const x = Math.random() * (this.width - itemWidth - 20) + 10;
    const speed = Math.random() * 2 + 2.5 + (30 - this.timeLeft) * 0.08;

    this.fallingItems.push({
      x,
      y: -itemWidth,
      size: itemWidth,
      label: chosen.label,
      type: chosen.type,
      color: chosen.color,
      points: chosen.points,
      speed
    });
  }

  gameOver() {
    this.isPlaying = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (window.SavorAudio) window.SavorAudio.playWin();

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      try {
        localStorage.setItem('savor_catch_best', this.bestScore);
      } catch (e) {}
    }

    document.getElementById('catch-final-score').textContent = this.score;
    document.getElementById('catch-final-combo').textContent = `x${this.maxCombo}`;
    document.getElementById('catch-best-score').textContent = this.bestScore;
    document.getElementById('catch-over-screen')?.classList.remove('hidden');
  }

  loop() {
    if (!this.isPlaying) return;

    if (this.keys.left) {
      this.basket.x = Math.max(0, this.basket.x - this.basket.speed);
    }
    if (this.keys.right) {
      this.basket.x = Math.min(this.width - this.basket.width, this.basket.x + this.basket.speed);
    }

    this.spawnTimer++;
    if (this.spawnTimer > 35) {
      this.spawnItem();
      this.spawnTimer = 0;
    }

    const bx = this.basket.x;
    const by = this.basket.y;
    const bw = this.basket.width;
    const bh = this.basket.height;

    for (let i = this.fallingItems.length - 1; i >= 0; i--) {
      const it = this.fallingItems[i];
      it.y += it.speed;

      if (
        it.y + it.size >= by &&
        it.y <= by + bh &&
        it.x + it.size >= bx &&
        it.x <= bx + bw
      ) {
        if (it.type === 'penalty') {
          this.score = Math.max(0, this.score + it.points);
          this.combo = 0;
          if (window.SavorAudio) window.SavorAudio.playBomb();
          this.addFloatingScore(`${it.points}`, it.x, it.y, '#ef4444');
          this.createSparks(it.x + it.size / 2, it.y, '#ef4444', 12);
        } else {
          this.combo++;
          if (this.combo > this.maxCombo) this.maxCombo = this.combo;

          const multiplier = this.combo >= 6 ? 3 : (this.combo >= 3 ? 2 : 1);
          const gainedPoints = it.points * multiplier;
          this.score += gainedPoints;

          if (window.SavorAudio) window.SavorAudio.playCatch(it.type === 'golden');

          const color = it.type === 'golden' ? '#E2A93E' : '#22c55e';
          const label = multiplier > 1 ? `+${gainedPoints} (x${multiplier})` : `+${gainedPoints}`;
          this.addFloatingScore(label, it.x, it.y, color);
          this.createSparks(it.x + it.size / 2, it.y, color, 8);
        }

        document.getElementById('catch-score').textContent = this.score;
        document.getElementById('catch-combo').textContent = `x${this.combo}`;
        this.fallingItems.splice(i, 1);
        continue;
      }

      if (it.y > this.height + 20) {
        if (it.type !== 'penalty') {
          this.combo = 0;
          document.getElementById('catch-combo').textContent = 'x0';
        }
        this.fallingItems.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.floatingScores.length - 1; i >= 0; i--) {
      const fs = this.floatingScores[i];
      fs.y -= 1.4;
      fs.alpha -= 0.025;
      if (fs.alpha <= 0) {
        this.floatingScores.splice(i, 1);
      }
    }

    this.draw();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  addFloatingScore(text, x, y, color) {
    this.floatingScores.push({ text, x, y, color, alpha: 1 });
  }

  createSparks(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.7) * 5,
        color,
        alpha: 1
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#141312';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.basket.y + this.basket.height + 4);
    this.ctx.lineTo(this.width, this.basket.y + this.basket.height + 4);
    this.ctx.stroke();

    const bx = this.basket.x;
    const by = this.basket.y;
    const bw = this.basket.width;
    const bh = this.basket.height;

    this.ctx.fillStyle = '#854d0e';
    this.ctx.beginPath();
    this.ctx.roundRect(bx, by, bw, bh, [4, 4, 12, 12]);
    this.ctx.fill();

    this.ctx.strokeStyle = '#E2A93E';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(bx - 2, by, bw + 4, 6, 3);
    this.ctx.stroke();

    for (const it of this.fallingItems) {
      this.ctx.save();
      this.ctx.fillStyle = it.color;
      this.ctx.beginPath();
      this.ctx.roundRect(it.x, it.y, it.size, it.size, 6);
      this.ctx.fill();

      this.ctx.fillStyle = '#12100E';
      this.ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(it.label, it.x + it.size / 2, it.y + it.size / 2);
      this.ctx.restore();
    }

    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    for (const fs of this.floatingScores) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, fs.alpha);
      this.ctx.fillStyle = fs.color;
      this.ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(fs.text, fs.x, fs.y);
      this.ctx.restore();
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

window.CatchFoodGame = CatchFoodGame;
