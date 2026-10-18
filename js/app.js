/**
 * SAVOR - Main Application Coordinator
 * Bootstraps branding, navigation active states, Web Share API, Table QR modal,
 * and initializes Menu and Arcade engines.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Populate dynamic brand data from SAVOR_CONFIG
  applyBranding();

  // 2. Initialize Sound, Menu and Arcade Engines
  const menuEngine = new window.MenuEngine();
  const arcadeHub = new window.ArcadeHub();

  window.savorMenu = menuEngine;
  window.savorArcade = arcadeHub;

  // 3. Setup Navigation & Smooth Scrolling
  setupNavigation();

  // 4. Setup Share & Instant UPI Table Payment
  setupShareAndUpiPayment();

  // 5. Sound toggle in header/nav
  setupHeaderSoundToggle();

  // 6. Setup Call Waiter & Table Service (Backend-less)
  setupCallWaiter();
});

function applyBranding() {
  const conf = SAVOR_CONFIG.restaurant;

  // Brand Name & Tagline
  document.querySelectorAll('.brand-name-text').forEach((el) => {
    el.textContent = conf.name;
  });
  document.querySelectorAll('.brand-tagline-text').forEach((el) => {
    el.textContent = conf.tagline;
  });
  document.querySelectorAll('.brand-table-text').forEach((el) => {
    el.textContent = conf.tableNumber;
  });

  // Dynamic Table Badge & State
  const isVerified = !!conf.isTokenVerified;
  const waiterBadge = document.getElementById('waiter-modal-badge');
  if (waiterBadge) {
    waiterBadge.textContent = isVerified ? `${conf.tableNumber.toUpperCase()} SERVICE` : 'TABLE SERVICE';
  }
  const waiterTarget = document.getElementById('waiter-target-table');
  if (waiterTarget) {
    waiterTarget.textContent = isVerified ? conf.tableNumber : 'Your Table';
  }
  const waiterConfirmed = document.getElementById('waiter-confirmed-table');
  if (waiterConfirmed) {
    waiterConfirmed.textContent = isVerified ? conf.tableNumber : 'Your Table';
  }

  const upiTitle = document.getElementById('upi-modal-title');
  if (upiTitle) {
    upiTitle.textContent = isVerified ? `Pay ${conf.tableNumber} Bill` : 'Pay Table Bill via UPI';
  }
  const upiNote = document.getElementById('upi-note-preview');
  if (upiNote) {
    upiNote.textContent = isVerified ? `${conf.tableNumber} Bill` : 'Table Bill';
  }

  const footerTableNote = document.getElementById('footer-table-note');
  if (footerTableNote) {
    footerTableNote.textContent = isVerified
      ? `${conf.tableNumber} • Digital Menu & Interactive Experience. Please place your order directly with your table server.`
      : `Digital Menu & Interactive Experience • Handcrafted & cooked to order.`;
  }

  document.title = isVerified
    ? `${conf.name} — Artisanal Dining & Table Arcade // ${conf.tableNumber}`
    : `${conf.name} — Artisanal Dining & Table Arcade`;

  // Footer / About info
  const storyEl = document.getElementById('about-story-text');
  if (storyEl) storyEl.textContent = conf.story;

  const addrEl = document.getElementById('about-address-text');
  if (addrEl) addrEl.textContent = conf.address;

  const hoursEl = document.getElementById('about-hours-text');
  if (hoursEl) hoursEl.textContent = conf.hours;

  const phoneEl = document.getElementById('about-phone-text');
  if (phoneEl) {
    phoneEl.textContent = conf.phone;
    phoneEl.href = `tel:${conf.phone.replace(/\s+/g, '')}`;
  }

  const mapLink = document.getElementById('about-map-link');
  if (mapLink) mapLink.href = conf.mapsUrl;
}

function setupNavigation() {
  // Active section spy with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .bottom-nav-item');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));

  // Navigation click smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function setupShareAndUpiPayment() {
  const shareBtn = document.getElementById('share-menu-btn');
  const upiBtn = document.getElementById('show-upi-btn');
  const upiModal = document.getElementById('upi-pay-modal');
  const upiCloseBtn = document.getElementById('upi-modal-close-btn');
  const upiAmountInput = document.getElementById('upi-amount-input');
  const upiQrContainer = document.getElementById('upi-qr-container');
  const upiDirectAppBtn = document.getElementById('upi-direct-app-btn');
  const upiVpaText = document.getElementById('upi-vpa-text');
  const copyUpiVpaBtn = document.getElementById('copy-upi-vpa-btn');
  const upiModalTitle = document.getElementById('upi-modal-title');
  const upiNotePreview = document.getElementById('upi-note-preview');

  const conf = SAVOR_CONFIG.restaurant;
  const upiConf = conf.upiPayment || {
    vpa: 'savor.dining@upi',
    payeeName: conf.name || 'SAVOR Dining',
    notePrefix: 'Table Bill',
    currency: 'INR'
  };

  const isVerified = !!conf.isTokenVerified;
  const vpa = upiConf.vpa || 'savor.dining@upi';
  const payee = upiConf.payeeName || conf.name || 'SAVOR Dining';

  if (upiVpaText) upiVpaText.textContent = vpa;
  if (upiModalTitle) {
    upiModalTitle.textContent = isVerified ? `Pay ${conf.tableNumber} Bill` : 'Pay Table Bill via UPI';
  }

  // Build standard UPI URL:
  // upi://pay?pa=...&pn=...&tn=...&am=...&cu=INR
  function getUpiDetails(amount) {
    const note = isVerified
      ? `${conf.tableNumber} Bill - ${conf.name}`
      : `Table Bill - ${conf.name}`;

    let url = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payee)}&tn=${encodeURIComponent(note)}&cu=INR`;
    if (amount && !isNaN(amount) && Number(amount) > 0) {
      url += `&am=${encodeURIComponent(Number(amount).toFixed(2))}`;
    }
    return { url, note };
  }

  // Render QR Code SVG & Update Direct Mobile Link
  function renderUpiPayment() {
    const rawAmount = upiAmountInput ? upiAmountInput.value.trim() : '';
    const { url, note } = getUpiDetails(rawAmount);

    if (upiNotePreview) upiNotePreview.textContent = note;

    if (upiDirectAppBtn) {
      upiDirectAppBtn.setAttribute('href', url);
      const btnLabel = document.getElementById('upi-direct-btn-text');
      if (btnLabel) {
        if (rawAmount && Number(rawAmount) > 0) {
          btnLabel.textContent = `Pay ₹${Number(rawAmount).toFixed(0)} in UPI App`;
        } else {
          btnLabel.textContent = 'Open in UPI App';
        }
      }
    }

    if (upiQrContainer && window.QRCode && window.QRCode.generateSVG) {
      try {
        upiQrContainer.innerHTML = window.QRCode.generateSVG(url, 190, 2);
      } catch (err) {
        console.error('Failed to render UPI QR Code:', err);
      }
    }
  }

  // Open UPI Modal
  upiBtn?.addEventListener('click', () => {
    if (window.SavorAudio) window.SavorAudio.playTap();
    renderUpiPayment();
    upiModal?.classList.remove('hidden');
    document.body.classList.add('modal-open');
    if (upiAmountInput) upiAmountInput.focus();
  });

  // Close UPI Modal
  upiCloseBtn?.addEventListener('click', () => {
    upiModal?.classList.add('hidden');
    document.body.classList.remove('modal-open');
  });

  // Backdrop click to close
  upiModal?.querySelector('.modal-backdrop')?.addEventListener('click', () => {
    upiModal?.classList.add('hidden');
    document.body.classList.remove('modal-open');
  });

  // Live amount input updating QR Code & direct mobile link
  upiAmountInput?.addEventListener('input', () => {
    renderUpiPayment();
  });

  // Copy VPA Button
  copyUpiVpaBtn?.addEventListener('click', () => {
    if (window.SavorAudio) window.SavorAudio.playTap();
    copyToClipboard(vpa, 'UPI ID copied to clipboard!');
  });

  // Shortcut from Call Waiter modal when "Request Bill" is picked
  const billShortcutBtn = document.getElementById('waiter-pay-upi-shortcut');
  billShortcutBtn?.addEventListener('click', () => {
    if (window.SavorAudio) window.SavorAudio.playTap();
    const waiterModal = document.getElementById('call-waiter-modal');
    waiterModal?.classList.add('hidden');
    renderUpiPayment();
    upiModal?.classList.remove('hidden');
    document.body.classList.add('modal-open');
  });

  // Web Share API for Share Button
  const getMenuUrl = () => {
    const token = conf.activeToken;
    const base = conf.publicUrl
      ? conf.publicUrl.replace(/\/+$/, '')
      : window.location.href.split('#')[0].split('?')[0];
    return token ? `${base}?t=${encodeURIComponent(token)}` : base;
  };

  shareBtn?.addEventListener('click', async () => {
    if (window.SavorAudio) window.SavorAudio.playTap();
    const url = getMenuUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${conf.name} Digital Menu & Food Arcade`,
          text: `Check out the menu and play table mini-games at ${conf.name}!`,
          url: url
        });
        return;
      } catch (err) {
        // Fall back to copy
      }
    }
    copyToClipboard(url, 'Menu link copied to clipboard!');
  });

  function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (window.savorMenu) window.savorMenu.showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      if (window.savorMenu) window.savorMenu.showToast(successMsg);
    } catch (e) {
      prompt('Copy to clipboard:', text);
    }
    document.body.removeChild(input);
  }
}

function setupHeaderSoundToggle() {
  const toggleBtn = document.getElementById('header-sound-toggle');
  toggleBtn?.addEventListener('click', () => {
    if (window.SavorAudio) {
      const isMuted = window.SavorAudio.toggleMute();
      if (window.savorArcade) {
        window.savorArcade.updateSoundToggleUI(isMuted);
      }
      if (window.savorMenu) {
        window.savorMenu.showToast(isMuted ? 'Audio muted' : 'Audio enabled');
      }
    }
  });
}

function escapeTelegramHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getRequestEmoji(reason) {
  const r = String(reason || '').toLowerCase();
  if (r.includes('water')) return '💧';
  if (r.includes('bill') || r.includes('check') || r.includes('invoice')) return '🧾';
  if (r.includes('cutler') || r.includes('napkin') || r.includes('plate') || r.includes('spoon')) return '🍽️';
  return '🛎️';
}

function formatTableBoxBadge(tableStr) {
  const label = `📍 ${tableStr.toUpperCase()}`;
  const width = 24;
  const paddingTotal = Math.max(0, width - label.length);
  const padLeft = Math.floor(paddingTotal / 2);
  const padRight = paddingTotal - padLeft;
  const innerLine = ' '.repeat(padLeft) + label + ' '.repeat(padRight);
  const border = '━'.repeat(width);

  return [
    '<pre>',
    `┏${border}┓`,
    `┃${innerLine}┃`,
    `┗${border}┛`,
    '</pre>'
  ].join('\n');
}

function formatTelegramServiceMessage(tableStr, reason, date = new Date()) {
  const emoji = getRequestEmoji(reason);
  const escapedTable = escapeTelegramHtml(tableStr.toUpperCase());
  const escapedReason = escapeTelegramHtml(reason);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const escapedTime = escapeTelegramHtml(timeStr);
  const tableBadge = formatTableBoxBadge(tableStr);

  return [
    '🔔 <b>TABLE SERVICE REQUEST</b>',
    `📍 <b><ins>${escapedTable}</ins></b>`,
    '',
    tableBadge,
    `<blockquote>${emoji} <b>Request:</b> ${escapedReason}\n⏰ <b>Time:</b> ${escapedTime}</blockquote>`,
    '<i>Dispatched via SAVOR Table NFC</i>'
  ].join('\n');
}

if (typeof window !== 'undefined') {
  window.formatTelegramServiceMessage = formatTelegramServiceMessage;
}

function setupCallWaiter() {
  const callBtn = document.getElementById('call-waiter-btn');
  const mobileCallBtn = document.getElementById('mobile-call-waiter-btn');
  const waiterModal = document.getElementById('call-waiter-modal');
  const closeBtn = document.getElementById('waiter-modal-close-btn');
  const confirmBtn = document.getElementById('confirm-call-waiter-btn');
  const reasonBtns = document.querySelectorAll('.service-opt-btn');
  const actionContainer = document.getElementById('waiter-action-container');
  const successState = document.getElementById('waiter-success-state');
  const sentReasonEl = document.getElementById('waiter-sent-reason');
  const cooldownSecsEl = document.getElementById('waiter-cooldown-secs');

  let selectedReason = 'General Assistance';
  let isCooldownActive = false;
  let cooldownTimer = null;

  const openWaiterModal = () => {
    if (window.SavorAudio) window.SavorAudio.playTap();
    const conf = SAVOR_CONFIG.restaurant;
    const isVerified = !!conf.isTokenVerified;

    const targetTableEl = document.getElementById('waiter-target-table');
    if (targetTableEl) targetTableEl.textContent = isVerified ? conf.tableNumber : 'Unassigned Table';
    const confirmedTableEl = document.getElementById('waiter-confirmed-table');
    if (confirmedTableEl) confirmedTableEl.textContent = isVerified ? conf.tableNumber : 'Unassigned Table';
    const badgeEl = document.getElementById('waiter-modal-badge');
    if (badgeEl) badgeEl.textContent = isVerified ? `${conf.tableNumber.toUpperCase()} SERVICE` : 'SCAN TABLE PLAQUE';

    const upiShortcutBtn = document.getElementById('waiter-pay-upi-shortcut');
    if (upiShortcutBtn) upiShortcutBtn.classList.add('hidden');

    waiterModal?.classList.remove('hidden');
    document.body.classList.add('modal-open');
  };

  const closeWaiterModal = () => {
    waiterModal?.classList.add('hidden');
    document.body.classList.remove('modal-open');
  };

  callBtn?.addEventListener('click', openWaiterModal);
  mobileCallBtn?.addEventListener('click', openWaiterModal);
  closeBtn?.addEventListener('click', closeWaiterModal);

  // Close modal when tapping backdrop
  waiterModal?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeWaiterModal();
    }
  });

  // Reason selection
  const upiShortcutBtn = document.getElementById('waiter-pay-upi-shortcut');
  reasonBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      reasonBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedReason = btn.getAttribute('data-reason') || 'General Assistance';
      if (upiShortcutBtn) {
        if (selectedReason.toLowerCase().includes('bill')) {
          upiShortcutBtn.classList.remove('hidden');
        } else {
          upiShortcutBtn.classList.add('hidden');
        }
      }
      if (window.SavorAudio) window.SavorAudio.playTap();
    });
  });

  // Confirm and dispatch notification
  confirmBtn?.addEventListener('click', () => {
    if (isCooldownActive) return;

    const conf = SAVOR_CONFIG.restaurant;

    // Reject service call if diner has not scanned a valid NFC table plaque token
    if (!conf.isTokenVerified || !conf.activeToken) {
      if (window.SavorAudio) window.SavorAudio.playMismatch();
      if (window.savorMenu) {
        window.savorMenu.showToast('⚠️ Scan your table NFC plaque or QR code to call waitstaff.');
      }
      return;
    }

    const tableStr = conf.tableNumber || 'Table 04';
    const notifConf = conf.serviceNotification || {};
    const primaryMethod = notifConf.primaryMethod || notifConf.method || 'telegram';
    const tgConf = notifConf.telegram || {};
    const spares = notifConf.spareMethods || {};
    const ntfyTopic = spares.ntfyTopic || notifConf.ntfyTopic;
    const waNumber = spares.whatsappNumber || notifConf.whatsappNumber;

    if (window.SavorAudio) window.SavorAudio.playMatch();

    const dispatchBadgeEl = document.getElementById('waiter-dispatch-badge');
    let dispatchedViaTg = false;

    // Helper: Spare ntfy push notification
    const triggerSpareNtfy = () => {
      if (!ntfyTopic) return;
      try {
        fetch(`https://ntfy.sh/${ntfyTopic}`, {
          method: 'POST',
          body: `🛎️ ${tableStr} requested: ${selectedReason}`,
          headers: {
            'Title': `Table Service Call — ${tableStr}`,
            'Priority': 'urgent',
            'Tags': 'bell,fork_and_knife'
          }
        }).catch(() => {});
      } catch (e) {}
    };

    // 1. PRIMARY DISPATCH: Telegram Bot
    if (tgConf.botToken && tgConf.chatId) {
      try {
        const messageHtml = formatTelegramServiceMessage(tableStr, selectedReason);
        const encodedText = encodeURIComponent(messageHtml);
        fetch(`https://api.telegram.org/bot${tgConf.botToken}/sendMessage?chat_id=${tgConf.chatId}&parse_mode=HTML&text=${encodedText}`)
          .then((res) => {
            if (!res.ok) {
              // If Telegram API returned an error, fallback to spare ntfy
              triggerSpareNtfy();
              if (dispatchBadgeEl) dispatchBadgeEl.textContent = '● Sent via Spare: Push Alert Dispatched';
            }
          })
          .catch(() => {
            // Network fallback to spare ntfy
            triggerSpareNtfy();
            if (dispatchBadgeEl) dispatchBadgeEl.textContent = '● Sent via Spare: Push Alert Dispatched';
          });
        dispatchedViaTg = true;
        if (dispatchBadgeEl) dispatchBadgeEl.textContent = '● Primary: Alerted via Telegram Bot';
      } catch (e) {
        triggerSpareNtfy();
      }
    } else {
      // If Telegram not configured, fallback to ntfy
      triggerSpareNtfy();
      if (dispatchBadgeEl) dispatchBadgeEl.textContent = '● Sent via Spare: Push Alert Dispatched';
    }

    // 2. SPARE: Prepare WhatsApp direct fallback link
    const cleanPhone = (waNumber || '').replace(/[^0-9]/g, '');
    const waMsg = encodeURIComponent(`🛎️ Service Call from ${tableStr}: Requesting ${selectedReason}.`);
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waMsg}` : '';

    const waFallbackEl = document.getElementById('waiter-whatsapp-fallback');
    const waLinkEl = document.getElementById('waiter-whatsapp-link');
    if (waUrl && waFallbackEl && waLinkEl) {
      waLinkEl.href = waUrl;
      waFallbackEl.classList.remove('hidden');
    } else if (waFallbackEl) {
      waFallbackEl.classList.add('hidden');
    }

    // 3. Update UI to success cooldown state
    if (sentReasonEl) sentReasonEl.textContent = selectedReason;
    actionContainer?.classList.add('hidden');
    successState?.classList.remove('hidden');

    if (window.savorMenu) {
      window.savorMenu.showToast(`Telegram alert sent for ${tableStr}!`);
    }

    // Anti-spam countdown
    isCooldownActive = true;
    let remaining = notifConf.cooldownSeconds || 60;
    if (cooldownSecsEl) cooldownSecsEl.textContent = remaining;

    if (cooldownTimer) clearInterval(cooldownTimer);
    cooldownTimer = setInterval(() => {
      remaining--;
      if (cooldownSecsEl) cooldownSecsEl.textContent = remaining;

      if (remaining <= 0) {
        clearInterval(cooldownTimer);
        isCooldownActive = false;
        actionContainer?.classList.remove('hidden');
        successState?.classList.add('hidden');
      }
    }, 1000);
  });
}
