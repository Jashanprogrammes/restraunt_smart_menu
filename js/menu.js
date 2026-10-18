/**
 * SAVOR - Luxury Dining Menu Engine
 * Refined culinary catalog, live search, multi-filters,
 * Food Mood recommendations, Surprise Me chef pick,
 * Rich Dish Details Modal, and Favourites.
 * Customer ordering UI removed per dining specification (orders placed with server).
 */

class MenuEngine {
  constructor() {
    this.items = SAVOR_CONFIG.menuItems || [];
    this.activeCategory = 'all';
    this.activeDietFilter = 'all'; // 'all', 'veg', 'non-veg', 'spicy', 'bestseller', 'fav'
    this.activeMood = 'all'; // 'all', 'spicy', 'comfort', 'light', 'crisp', 'sweet'
    this.searchQuery = '';
    this.sortBy = 'recommended'; // 'recommended', 'price-asc', 'price-desc'

    // Favourites loaded from localStorage
    this.favourites = new Set(JSON.parse(localStorage.getItem('savor_favourites') || '[]'));

    this.selectedDishForModal = null;
    this.init();
  }

  init() {
    this.renderCategoryPills();
    this.renderChefPicks();
    this.applyFiltersAndRender();
    this.setupEventListeners();
    this.setupMoodAndSurpriseListeners();
  }

  /* ---------------- CATEGORY PILLS BAR ---------------- */
  renderCategoryPills() {
    const container = document.getElementById('category-pills-bar');
    if (!container) return;

    const categoryCounts = { all: this.items.length };
    this.items.forEach((it) => {
      categoryCounts[it.category] = (categoryCounts[it.category] || 0) + 1;
    });

    container.innerHTML = SAVOR_CONFIG.categories.map((cat) => {
      const count = categoryCounts[cat.id] || 0;
      const isActive = this.activeCategory === cat.id ? 'active' : '';
      return `
        <button class="cat-pill ${isActive}" data-category="${cat.id}" aria-label="Category ${cat.name}">
          <span class="cat-pill-icon">${cat.icon}</span>
          <span class="cat-pill-name">${cat.name}</span>
          <span class="cat-pill-count">${count}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.cat-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-category');
        this.selectCategory(catId);
      });
    });
  }

  selectCategory(catId) {
    this.activeCategory = catId;
    document.querySelectorAll('.cat-pill').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === catId);
    });

    const activeBtn = document.querySelector(`.cat-pill[data-category="${catId}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    if (window.SavorAudio) window.SavorAudio.playTap();
    this.applyFiltersAndRender();
  }

  /* ---------------- CHEF'S SIGNATURE SHOWCASE ---------------- */
  renderChefPicks() {
    const container = document.getElementById('chefs-picks-container');
    if (!container) return;

    const picks = this.items.filter((it) => it.isChefPick).slice(0, 3);
    if (picks.length === 0) return;

    container.innerHTML = picks.map((dish) => `
      <article class="signature-card" data-dish-id="${dish.id}">
        <div class="signature-media">
          <img src="${dish.image || 'assets/logo.svg'}" alt="${dish.name}" loading="lazy" class="signature-img" onerror="this.src='assets/logo.svg'">
          <div class="signature-badges">
            <span class="diet-dot ${dish.isVeg ? 'veg' : 'non-veg'}"></span>
            <span class="gold-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-right:3px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>CHEF'S SIGNATURE</span>
          </div>
        </div>
        <div class="signature-body">
          <div class="flex-between">
            <h3 class="signature-title">${dish.name}</h3>
            <span class="signature-price">${SAVOR_CONFIG.restaurant.currency}${dish.price}</span>
          </div>
          <p class="signature-desc">${dish.description}</p>
          <div class="signature-actions">
            <button class="btn btn-gold btn-sm view-details-trigger w-full" data-dish-id="${dish.id}">
              <span>Tasting Notes &amp; Ingredients</span>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    container.querySelectorAll('.view-details-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openDishModal(btn.getAttribute('data-dish-id'));
      });
    });

    container.querySelectorAll('.signature-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          this.openDishModal(card.getAttribute('data-dish-id'));
        }
      });
    });
  }

  /* ---------------- FILTERING, SEARCH & SORT LOGIC ---------------- */
  applyFiltersAndRender() {
    let filtered = [...this.items];

    // 1. Category Filter
    if (this.activeCategory && this.activeCategory !== 'all') {
      filtered = filtered.filter((it) => it.category === this.activeCategory);
    }

    // 2. Dietary Filter
    if (this.activeDietFilter === 'veg') {
      filtered = filtered.filter((it) => it.isVeg);
    } else if (this.activeDietFilter === 'non-veg') {
      filtered = filtered.filter((it) => !it.isVeg);
    } else if (this.activeDietFilter === 'spicy') {
      filtered = filtered.filter((it) => it.spiceLevel > 1);
    } else if (this.activeDietFilter === 'bestseller') {
      filtered = filtered.filter((it) => it.isBestseller);
    } else if (this.activeDietFilter === 'fav') {
      filtered = filtered.filter((it) => this.favourites.has(it.id));
    }

    // 3. Food Mood Filter
    if (this.activeMood === 'spicy') {
      filtered = filtered.filter((it) => it.spiceLevel > 1);
    } else if (this.activeMood === 'comfort') {
      filtered = filtered.filter((it) => it.category === 'indian-main' || it.category === 'chinese');
    } else if (this.activeMood === 'light') {
      filtered = filtered.filter((it) => it.category === 'starters' || it.isVeg);
    } else if (this.activeMood === 'crisp') {
      filtered = filtered.filter((it) => it.category === 'pizza-pasta' || it.category === 'burgers-snacks');
    } else if (this.activeMood === 'sweet') {
      filtered = filtered.filter((it) => it.category === 'desserts' || it.category === 'beverages');
    }

    // 4. Live Search
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((it) =>
        it.name.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        (it.ingredients && it.ingredients.some((ing) => ing.toLowerCase().includes(q)))
      );
    }

    // 5. Sorting
    if (this.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => {
        const scoreA = (a.isChefPick ? 2 : 0) + (a.isBestseller ? 1 : 0);
        const scoreB = (b.isChefPick ? 2 : 0) + (b.isBestseller ? 1 : 0);
        return scoreB - scoreA;
      });
    }

    this.renderDishGrid(filtered);
  }

  renderDishGrid(dishes) {
    const grid = document.getElementById('menu-items-grid');
    const emptyState = document.getElementById('menu-empty-state');
    const countDisplay = document.getElementById('menu-results-count');

    if (countDisplay) {
      countDisplay.textContent = `Showing ${dishes.length} ${dishes.length === 1 ? 'dish' : 'dishes'}`;
    }

    if (dishes.length === 0) {
      if (grid) grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (!grid) return;

    grid.innerHTML = dishes.map((dish) => {
      const isFav = this.favourites.has(dish.id);
      const spiceIndicator = dish.spiceLevel > 0 ? `<span class="spice-pip" title="Spice Level ${dish.spiceLevel}">SPICE ${'•'.repeat(dish.spiceLevel)}</span>` : '';

      return `
        <article class="dish-card" data-dish-id="${dish.id}">
          <div class="dish-card-media" role="button" tabindex="0" aria-label="View specifications for ${dish.name}">
            <img src="${dish.image || 'assets/logo.svg'}" alt="${dish.name}" loading="lazy" class="dish-card-img" onerror="this.src='assets/logo.svg'">
            
            <div class="dish-media-overlay"></div>

            <div class="dish-card-badges">
              <span class="diet-dot ${dish.isVeg ? 'veg' : 'non-veg'}" title="${dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
              ${dish.isBestseller ? '<span class="pill-badge pill-bestseller"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-right:2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Bestseller</span>' : ''}
              ${dish.isChefPick ? '<span class="pill-badge pill-chef">Chef Pick</span>' : ''}
            </div>

            <button class="btn-fav-circle ${isFav ? 'active' : ''}" data-dish-id="${dish.id}" aria-label="Toggle favourite for ${dish.name}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#ef4444' : 'none'}" stroke="${isFav ? '#ef4444' : '#F7F1E8'}" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <div class="dish-card-body">
            <div class="dish-title-row">
              <h3 class="dish-title">${dish.name}</h3>
              <span class="dish-price">${SAVOR_CONFIG.restaurant.currency}${dish.price}</span>
            </div>

            <p class="dish-desc">${dish.description}</p>

            <div class="dish-meta-info">
              <span class="meta-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:3px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${dish.prepTime}</span>
              <span class="meta-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:3px;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>${dish.calories}</span>
              ${spiceIndicator ? `<span>${spiceIndicator}</span>` : ''}
            </div>

            <div class="dish-card-actions">
              <button class="btn btn-outline btn-sm view-details-btn w-full" data-dish-id="${dish.id}">
                <span>Tasting Notes &amp; Details</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click events
    grid.querySelectorAll('.btn-fav-circle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavourite(btn.getAttribute('data-dish-id'));
      });
    });

    grid.querySelectorAll('.dish-card-media, .view-details-btn').forEach((el) => {
      el.addEventListener('click', (e) => {
        const dishId = el.getAttribute('data-dish-id') || el.closest('.dish-card')?.getAttribute('data-dish-id');
        if (dishId) this.openDishModal(dishId);
      });
    });
  }

  /* ---------------- FAVOURITES ---------------- */
  toggleFavourite(dishId) {
    if (this.favourites.has(dishId)) {
      this.favourites.delete(dishId);
    } else {
      this.favourites.add(dishId);
      if (window.SavorAudio) window.SavorAudio.playAddCart();
    }

    try {
      localStorage.setItem('savor_favourites', JSON.stringify([...this.favourites]));
    } catch (e) {}

    this.applyFiltersAndRender();
  }

  /* ---------------- SURPRISE ME & FOOD MOOD ---------------- */
  surpriseMe() {
    if (this.items.length === 0) return;
    const featured = this.items.filter((it) => it.isChefPick || it.isBestseller);
    const pool = featured.length > 0 ? featured : this.items;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    if (window.SavorAudio) window.SavorAudio.playWin();
    this.showToast(`Chef's Surprise Pick: ${chosen.name}!`);
    this.openDishModal(chosen.id);
  }

  setupMoodAndSurpriseListeners() {
    const moodChips = document.querySelectorAll('.mood-chip');
    moodChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        moodChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeMood = chip.getAttribute('data-mood') || 'all';
        if (window.SavorAudio) window.SavorAudio.playTap();
        this.applyFiltersAndRender();
      });
    });

    const surpriseBtn = document.getElementById('surprise-me-btn');
    surpriseBtn?.addEventListener('click', () => {
      this.surpriseMe();
    });
  }

  /* ---------------- DISH DETAILS MODAL ---------------- */
  openDishModal(dishId) {
    const dish = this.items.find((it) => it.id === dishId);
    if (!dish) return;

    this.selectedDishForModal = dish;

    const modal = document.getElementById('dish-detail-modal');
    const content = document.getElementById('dish-detail-modal-content');
    if (!modal || !content) return;

    const spiceIcons = dish.spiceLevel > 0 ? `Level ${dish.spiceLevel} / 3` : 'Mild';
    const isFav = this.favourites.has(dish.id);

    content.innerHTML = `
      <div class="modal-dialog-inner modal-sheet-layout">
        <button class="modal-close-icon" id="modal-close-x" aria-label="Close dialog">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div class="modal-scrollable-body">
          <div class="modal-dish-visual">
            <img src="${dish.image || 'assets/logo.svg'}" alt="${dish.name}" class="modal-visual-img" onerror="this.src='assets/logo.svg'">
            <div class="modal-visual-gradient"></div>
            
            <div class="modal-visual-badges">
              <span class="diet-dot ${dish.isVeg ? 'veg' : 'non-veg'}"></span>
              <span class="pill-badge">${dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
              ${dish.isBestseller ? '<span class="pill-badge pill-bestseller"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-right:2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Bestseller</span>' : ''}
            </div>

            <button class="btn-fav-circle modal-fav-btn ${isFav ? 'active' : ''}" id="modal-fav-btn" aria-label="Toggle favourite">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? '#ef4444' : 'none'}" stroke="${isFav ? '#ef4444' : '#F7F1E8'}" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <div class="modal-dish-content">
            <div class="flex-between" style="flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <span class="modal-category-tag">${dish.category.replace('-', ' ').toUpperCase()}</span>
                <h2 class="modal-dish-title">${dish.name}</h2>
              </div>
              <div class="modal-price-tag">${SAVOR_CONFIG.restaurant.currency}${dish.price}</div>
            </div>

            <p class="modal-dish-desc">${dish.description}</p>

            <!-- Specs Grid -->
            <div class="modal-specs-grid">
              <div class="spec-cell">
                <span class="spec-cell-label">SPICE</span>
                <span class="spec-cell-val">${spiceIcons}</span>
              </div>
              <div class="spec-cell">
                <span class="spec-cell-label">PREP TIME</span>
                <span class="spec-cell-val">${dish.prepTime}</span>
              </div>
              <div class="spec-cell">
                <span class="spec-cell-label">NUTRITION</span>
                <span class="spec-cell-val">${dish.calories}</span>
              </div>
            </div>

            <!-- Ingredients -->
            ${dish.ingredients && dish.ingredients.length > 0 ? `
              <div class="modal-ingredients-section">
                <h4 class="modal-sub-label">KEY INGREDIENTS</h4>
                <div class="modal-chips-list">
                  ${dish.ingredients.map((ing) => `<span class="modal-chip">${ing}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Recommended Pairings / Sides -->
            ${dish.addOns && dish.addOns.length > 0 ? `
              <div class="modal-addons-section">
                <h4 class="modal-sub-label">CHEF'S RECOMMENDED PAIRINGS &amp; SIDES</h4>
                <div class="modal-addons-list">
                  ${dish.addOns.map((addOn) => `
                    <div class="addon-info-row">
                      <span class="addon-info-name">${addOn.name}</span>
                      <span class="addon-info-price">${SAVOR_CONFIG.restaurant.currency}${addOn.price}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Clean Modal Footer Action -->
        <div class="modal-action-bar">
          <button class="btn btn-outline btn-lg w-full" id="modal-close-action-btn">
            <span>Back to Menu</span>
          </button>
        </div>
      </div>
    `;

    // Handlers
    document.getElementById('modal-close-x')?.addEventListener('click', () => this.closeDishModal());
    document.getElementById('modal-close-action-btn')?.addEventListener('click', () => this.closeDishModal());

    document.getElementById('modal-fav-btn')?.addEventListener('click', () => {
      this.toggleFavourite(dish.id);
      this.openDishModal(dish.id);
    });

    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  closeDishModal() {
    const modal = document.getElementById('dish-detail-modal');
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    this.selectedDishForModal = null;
  }

  showToast(message) {
    const toast = document.getElementById('global-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('toast-active');

    setTimeout(() => {
      toast.classList.remove('toast-active');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2400);
  }

  /* ---------------- EVENT LISTENERS ---------------- */
  setupEventListeners() {
    document.querySelectorAll('.diet-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diet-filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeDietFilter = btn.getAttribute('data-filter');
        if (window.SavorAudio) window.SavorAudio.playTap();
        this.applyFiltersAndRender();
      });
    });

    const searchInput = document.getElementById('menu-search-input');
    const clearSearchBtn = document.getElementById('menu-search-clear');

    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('hidden', this.searchQuery === '');
      }
      this.applyFiltersAndRender();
    });

    clearSearchBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      this.searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      this.applyFiltersAndRender();
    });

    document.getElementById('reset-all-filters-btn')?.addEventListener('click', () => {
      this.activeCategory = 'all';
      this.activeDietFilter = 'all';
      this.activeMood = 'all';
      this.searchQuery = '';
      if (searchInput) searchInput.value = '';
      clearSearchBtn?.classList.add('hidden');

      document.querySelectorAll('.cat-pill').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-category') === 'all');
      });
      document.querySelectorAll('.diet-filter-btn').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
      });
      document.querySelectorAll('.mood-chip').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-mood') === 'all');
      });

      this.applyFiltersAndRender();
    });

    const sortSelect = document.getElementById('menu-sort-select');
    sortSelect?.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.applyFiltersAndRender();
    });

    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.closest('.game-overlay, .modal-root')?.classList.add('hidden');
          document.body.classList.remove('modal-open');
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDishModal();
        document.getElementById('share-qr-modal')?.classList.add('hidden');
        document.body.classList.remove('modal-open');
      }
    });
  }
}

window.MenuEngine = MenuEngine;
