# SAVOR — NFC-Enabled Smart Restaurant Menu & Table Arcade

A modern, zero-backend, interactive digital restaurant menu website designed for physical **8 × 13 cm matte black table plaques** with embedded NFC stickers and scannable QR codes.

Built with pure vanilla web technologies (HTML5, CSS3, ES6 JavaScript) with zero runtime dependencies and zero ongoing cloud costs (₹0).

---

## 🌟 Key Features

### 1. Zero-Backend Table Service Notifications
- **Primary Channel**: Real-time push alerts delivered directly to the restaurant floor captain's phone/tablet via a dedicated **Telegram Bot API** in HTML parse mode.
- **High-Visibility Formatting**: Table numbers are framed in prominent illuminated monospace cards with dynamic request-type emojis (🛎️ General Assistance, 💧 Water Refill, 🧾 Request Bill, 🍽️ Cutlery & Napkins).
- **Zero-Cost Spare Channels**: Automatic failover to free **`ntfy.sh`** pub-sub push notifications and one-tap **WhatsApp direct messaging** (`wa.me`).
- **Anti-Spam Protection**: Built-in 60-second cooldown timer between table service calls.

### 2. Cryptographic NFC Table Token Security
- **No Exposed Table Numbers**: URLs use unique obfuscated tokens (e.g. `?t=sv-i9752`) rather than plaintext table numbers (e.g. `?table=04`).
- **Tamper Protection**: Diners cannot manually alter the URL to prank-call other tables. Plain table numbers (`?table=XX`) are strictly rejected.
- **Auto-Mapping**: The client-side registry automatically resolves tokens to physical table names and sections (Main Dining, Terrace Garden, Chef's Hearth, Private Alcove, Rooftop Deck).

### 3. Interactive Table Arcade
Four casual dining mini-games to entertain guests while their food is prepared on open coals:
1. **Burger Stack**: Fast-paced reflex challenge to stack buns, patties, cheeses, and veggies.
2. **Coal Hearth Catch**: Catch gourmet food items into the chef's basket while dodging penalties.
3. **Memory Match**: Gourmet ingredient pairing game with combo counters.
4. **Pizza vs Burger**: Classic table duel played against a smart bot or dining companion.

### 4. Artisanal Menu Experience
- **Category Browsing & Live Search**: Starters, Coal-Fired Gravies, Wok & Claypot, Stone Hearth Pizza, Iron Skillet Burgers, Cold Brews & Tonics, Plated Sweets.
- **Dietary Indicators**: Authentic green veg & red non-veg indicators with one-tap veg-only filter.
- **Discovery Tools**: *"Food Mood"* craving selector and *"Surprise Me"* chef spinner.
- **Synthesized Audio Engine**: Nostalgic micro-interaction sound effects with header audio toggle.
- **Sharp Brutalist Aesthetics**: Sleek dark mode palette, gold accents, and 0px architectural borders.

---

## 📋 Technology Stack

- **Markup**: Semantic HTML5 (Mobile-first responsive architecture)
- **Styling**: Vanilla CSS3 (Custom design tokens, glassmorphism, 0px radius)
- **Logic**: Vanilla ES6 JavaScript (Decoupled configuration store, zero build steps)
- **Audio**: Web Audio API (Synthesized waveforms, zero external audio asset files)
- **APIs**: Telegram Bot API (HTML parse mode), ntfy.sh HTTP Pub-Sub, WhatsApp URL Scheme

---

## 🚀 Quick Start (Local Development)

Because this project is built on vanilla web standards, it requires no build tools or npm packages:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jashanprogrammes/restraunt_smart_menu.git
   cd restraunt_smart_menu
   ```

2. **Start a local static server:**
   ```bash
   # Python 3
   python -m http.server 8080

   # Or using Node
   npx serve .
   ```

3. **Open in your browser:**
   - Default Dine-In: [http://localhost:8080/](http://localhost:8080/)
   - Table 01: [http://localhost:8080/?t=sv-w77lx](http://localhost:8080/?t=sv-w77lx)
   - Table 04: [http://localhost:8080/?t=sv-i9752](http://localhost:8080/?t=sv-i9752)
   - Table 09: [http://localhost:8080/?t=sv-4415p](http://localhost:8080/?t=sv-4415p)

---

## 🏷️ Table Token Reference (Tables 01 – 15)

Program these URLs onto your physical NFC tags or QR code plaques:

| Physical Table | Section | Token | NFC URL Query |
| :--- | :--- | :--- | :--- |
| **Table 01** | Main Dining | `sv-w77lx` | `?t=sv-w77lx` |
| **Table 02** | Main Dining | `sv-28ej0` | `?t=sv-28ej0` |
| **Table 03** | Main Dining | `sv-c807z` | `?t=sv-c807z` |
| **Table 04** | Main Dining | `sv-i9752` | `?t=sv-i9752` |
| **Table 05** | Main Dining | `sv-s8su1` | `?t=sv-s8su1` |
| **Table 06** | Terrace Garden | `sv-y9zr4` | `?t=sv-y9zr4` |
| **Table 07** | Terrace Garden | `sv-89lg3` | `?t=sv-89lg3` |
| **Table 08** | Terrace Garden | `sv-u4fgq` | `?t=sv-u4fgq` |
| **Table 09** | Chef's Hearth | `sv-4415p` | `?t=sv-4415p` |
| **Table 10** | Chef's Hearth | `sv-rpge3` | `?t=sv-rpge3` |
| **Table 11** | Chef's Hearth | `sv-hpup4` | `?t=sv-hpup4` |
| **Table 12** | Chef's Hearth | `sv-bons1` | `?t=sv-bons1` |
| **Table 13** | Chef's Hearth | `sv-1p232` | `?t=sv-1p232` |
| **Table 14** | Chef's Hearth | `sv-vnv5z` | `?t=sv-vnv5z` |
| **Table 15** | Private Alcove | `sv-lo9h0` | `?t=sv-lo9h0` |

*To export the full list of all 30 table URLs, run `window.getNfcPlaqueUrls()` in the browser console.*

---

## ⚙️ Configuration

All restaurant details, menu items, table tokens, and notification settings are centralized in [`js/config.js`](js/config.js):

```javascript
serviceNotification: {
  enabled: true,
  primaryMethod: "telegram",
  telegram: {
    botToken: "YOUR_TELEGRAM_BOT_TOKEN",
    chatId: "YOUR_STAFF_CHAT_ID"
  },
  spareMethods: {
    ntfyTopic: "your-secret-ntfy-topic",
    whatsappNumber: "+919876543210"
  },
  cooldownSeconds: 60
}
```

---

## 📄 License

This project is licensed under the MIT License.
