# VCrypto - Virtual Cryptocurrency Trading Platform

A modern, full-featured virtual cryptocurrency trading and portfolio management application built with **React Native (Expo SDK 51)** and powered by **Google Firebase** (Authentication & Cloud Firestore) with live real-time price feeds from the **CoinGecko API**.

---

## Table of Contents
- [VCrypto - Virtual Cryptocurrency Trading Platform](#vcrypto---virtual-cryptocurrency-trading-platform)
  - [Table of Contents](#table-of-contents)
  - [1. Features](#1-features)
    - [1.1 Trading \& Simulation Features](#11-trading--simulation-features)
    - [1.2 Market \& Analytics Features](#12-market--analytics-features)
    - [1.3 User \& Authentication Features](#13-user--authentication-features)
    - [1.4 Platform \& Technical Features](#14-platform--technical-features)
  - [2. Tech Stack](#2-tech-stack)
    - [2.1 Frontend \& Mobile](#21-frontend--mobile)
    - [2.2 Backend \& Cloud Infrastructure](#22-backend--cloud-infrastructure)
    - [2.3 Third-Party APIs \& Libraries](#23-third-party-apis--libraries)
  - [3. Deployment](#3-deployment)
    - [3.1 Live Application URL](#31-live-application-url)
    - [3.2 Deployment Instructions](#32-deployment-instructions)
  - [4. Test and Admin Users Credentials](#4-test-and-admin-users-credentials)
    - [4.1 Guest \& Demo Access](#41-guest--demo-access)
    - [4.2 Pre-Configured Test Accounts](#42-pre-configured-test-accounts)
  - [5. How to Use App for Regular User](#5-how-to-use-app-for-regular-user)
    - [5.1 Getting Started \& Registration](#51-getting-started--registration)
    - [5.2 Browsing Live Crypto Markets](#52-browsing-live-crypto-markets)
    - [5.3 Viewing Coin Details \& Price Charts](#53-viewing-coin-details--price-charts)
    - [5.4 Executing Buy and Sell Orders](#54-executing-buy-and-sell-orders)
    - [5.5 Tracking Portfolio \& Balance](#55-tracking-portfolio--balance)
    - [5.6 Viewing Global Leaderboard Rankings](#56-viewing-global-leaderboard-rankings)
  - [6. How to Use App for Admin User](#6-how-to-use-app-for-admin-user)
    - [6.1 Accessing the Firebase Management Console](#61-accessing-the-firebase-management-console)
    - [6.2 Managing User Accounts \& Balances](#62-managing-user-accounts--balances)
    - [6.3 Managing Market Coins \& Real-Time Sync](#63-managing-market-coins--real-time-sync)
    - [6.4 Enforcing Database Security Rules](#64-enforcing-database-security-rules)
  - [7. Project Structure](#7-project-structure)
  - [8. Installation \& Local Setup](#8-installation--local-setup)
    - [8.1 Prerequisites](#81-prerequisites)
    - [8.2 Setup Steps](#82-setup-steps)
  - [9. Environment Variables Configuration](#9-environment-variables-configuration)
  - [10. Available Scripts](#10-available-scripts)
  - [11. License](#11-license)

---

## 1. Features

### 1.1 Trading & Simulation Features
* ✅ **Virtual $100,000 Starter Balance:** Every new user receives $100,000 in virtual USD to simulate investing in crypto risk-free.
* ✅ **Instant Buy & Sell Execution:** Seamlessly buy or sell fractional and whole quantities of top cryptocurrencies with instant execution.
* ✅ **One-Tap "Buy Max" & "Sell All":** Quick convenience buttons to invest all available cash or liquidate an entire crypto position instantly.
* ✅ **Atomic Transaction Engine:** ACID-compliant Firestore transactions prevent balance mismatches, double-spending, and race conditions during trading.
* ✅ **Dynamic Position Tracking:** Displays current cryptocurrency holdings, percentage of portfolio, and real-time USD asset valuation.

### 1.2 Market & Analytics Features
* ✅ **Live CoinGecko Price Ingestion:** Automatically fetches real-time prices for top 50+ cryptocurrencies (BTC, ETH, SOL, BNB, XRP, ADA, DOGE, etc.).
* ✅ **Interactive 7-Day Sparkline Graphs:** Visualizes price trends with responsive line graphs rendered using `react-native-chart-kit`.
* ✅ **Price Change Indicators:** Color-coded percentage indicators for 1-hour, 24-hour, and 7-day price movements (green for gains, red for dips).
* ✅ **Pull-to-Refresh Price Sync:** Drag down on the Market screen to instantly fetch up-to-the-minute market rates.
* ✅ **Smart Decimal Formatting:** Accurately formats multi-digit numbers (BTC at $80,000+) down to micro-currencies ($0.000005) without truncation.

### 1.3 User & Authentication Features
* ✅ **One-Tap Guest / Demo Login:** Instant entry for demonstration and testing without requiring password setup.
* ✅ **Email & Password Authentication:** Full registration and sign-in flow with persistent sessions powered by Firebase Auth.
* ✅ **Global Competitive Leaderboard:** Real-time rankings page sorting all traders by calculated total net worth.
* ✅ **Personal Profile Overview:** Displays investor name, email, avatar, and cumulative portfolio net worth.

### 1.4 Platform & Technical Features
* ✅ **Modern Expo SDK 51:** Fully compatible with React Native 0.74, React 18, and modern Android/iOS Expo Go client apps.
* ✅ **Firebase Modular SDK v10:** Clean, modular imports reducing bundle footprint and enabling responsive offline caching.
* ✅ **Real-Time Data Streaming:** Cloud Firestore listeners (`onSnapshot`) push live price and portfolio updates to screens with zero polling.

---

## 2. Tech Stack

### 2.1 Frontend & Mobile
* **Framework:** [React Native](https://reactnative.dev/) (v0.74.5) with [Expo](https://expo.dev/) (SDK 51)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (v5.3) & JavaScript (ES2021+)
* **Navigation:** [React Navigation 6](https://reactnavigation.org/) (Bottom Tabs, Native Stack, Deep Linking)
* **Data Visualization:** [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit) & [react-native-svg](https://github.com/software-mansion/react-native-svg)
* **Icons & Fonts:** [@expo/vector-icons](https://icons.expo.fyi/) (Ionicons, AntDesign, FontAwesome5, Entypo, MaterialIcons)
* **Local Storage:** [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)

### 2.2 Backend & Cloud Infrastructure
* **Database:** [Google Cloud Firestore](https://firebase.google.com/docs/firestore) (NoSQL real-time document database)
* **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth) (Email/Password, Anonymous, OAuth ready)
* **Cloud Functions:** [Firebase Cloud Functions v2](https://firebase.google.com/docs/functions) (Scheduled background sync & order execution)
* **Rules & Security:** Declarative Firestore Security Rules enforcing user data ownership and transaction integrity

### 2.3 Third-Party APIs & Libraries
* **Market Data Provider:** [CoinGecko Public API](https://www.coingecko.com/en/api) (Top 100 markets, sparkline prices, percentage changes)
* **Image Assets:** Custom 3D illustration assets (Saly 3D illustrations)

---

## 3. Deployment

### 3.1 Live Application URL
* **App Live URL:** (https://expo.dev/accounts/tauseefiqbal/projects/VCrypto/builds/1bcbff82-2ba7-4f78-9e65-5cd272095290)

### 3.2 Deployment Instructions
* **Expo EAS Build (Android APK / AAB):**
  ```bash
  eas build --platform android --profile preview
  ```
* **Expo EAS Build (iOS IPA):**
  ```bash
  eas build --platform ios --profile preview
  ```
* **Firebase Cloud Functions & Rules Deployment:**
  ```bash
  firebase deploy --only firestore:rules,functions
  ```

---

## 4. Test and Admin Users Credentials

### 4.1 Guest & Demo Access
* **Access Method:** Tap **"Continue as Guest / Demo"** on the Welcome screen.
* **Credentials:** None required. Automatically generates an authenticated demo session with **$100,000 USD** virtual funds.

### 4.2 Pre-Configured Test Accounts
Use the **"Sign In or Register with Email"** button on the Welcome screen:

| Role | Email Address | Password | Initial Net Worth |
| :--- | :--- | :--- | :--- |
| **Trader 1 (Pro)** | `satoshi@bitcoin.org` | `Crypto123!` | \$1,452,000.00 |
| **Trader 2 (Pro)** | `vitalik@ethereum.org` | `Crypto123!` | \$980,500.00 |
| **Trader 3 (Standard)** | `alex@vcrupto.com` | `Crypto123!` | \$215,400.00 |
| **Trader 4 (Starter)** | `trader@vcrupto.com` | `Crypto123!` | \$100,000.00 |

---

## 5. How to Use App for Regular User

### 5.1 Getting Started & Registration
1. Open the application on your mobile device (via Expo Go or installed build).
2. On the **Welcome Screen**:
   * Tap **"Continue as Guest / Demo"** for instant 1-tap onboarding, OR
   * Tap **"Sign In or Register with Email"** to create a custom persistent account.
3. Your account is automatically credited with a virtual balance of **$100,000.00 USD**.

### 5.2 Browsing Live Crypto Markets
1. Tap the **Market** icon in the bottom navigation tab bar.
2. Browse the list of top cryptocurrencies sorted by market capitalization.
3. View real-time coin names, symbols, live USD prices, and 24-hour gains/losses.
4. Drag down from the top of the list (**Pull to Refresh**) at any time to query CoinGecko for up-to-the-second price updates.

### 5.3 Viewing Coin Details & Price Charts
1. From the Market screen, tap on any cryptocurrency (e.g., Bitcoin, Ethereum, Solana).
2. The **Price Data** screen will display:
   * Current live trading price.
   * Percentage changes across 1 hour, 1 day, and 7 days.
   * Interactive 7-day sparkline performance chart.
   * Your current position in this asset (number of coins held and total USD value).

### 5.4 Executing Buy and Sell Orders
1. On the **Price Data** screen, tap the green **"Buy"** button or red **"Sell"** button.
2. Enter the amount of crypto you want to purchase or sell. The equivalent USD value calculates automatically.
3. Alternatively, tap **"Buy Max"** to use all your available USD cash, or **"Sell All"** to liquidate your holding.
4. Tap **"Place Order"**.
5. Once confirmed, your cash and crypto balances update instantly.

### 5.5 Tracking Portfolio & Balance
1. Tap the **Portfolio** tab in the bottom navigation bar.
2. View your **Total Portfolio Balance** (USD cash + total valuation of all held cryptocurrencies).
3. Review your individual asset allocations, amount of coins held, and current value.

### 5.6 Viewing Global Leaderboard Rankings
1. Tap the **Rankings** tab in the bottom navigation bar.
2. View all traders ranked by their total net worth.
3. Compete to increase your net worth through profitable trades and climb to #1 on the leaderboard.

---

## 6. How to Use App for Admin User

### 6.1 Accessing the Firebase Management Console
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Select the project: **`react-native-crypto-exchange`**.
3. Use the left-hand navigation to access **Authentication**, **Firestore Database**, and **Functions**.

### 6.2 Managing User Accounts & Balances
1. **View / Delete Users:**
   * Go to **Build $\rightarrow$ Authentication $\rightarrow$ Users** to view registered emails, UIDs, and sign-in providers.
2. **Adjust User Balances & Net Worth:**
   * Go to **Build $\rightarrow$ Firestore Database $\rightarrow$ Data**.
   * Open the **`users`** collection and select any user's document UID.
   * Edit the `networth` field directly to adjust leaderboard positioning.
   * Expand the user's **`portfolioCoins`** subcollection and select the `usd` document to increase or decrease cash reserves.

### 6.3 Managing Market Coins & Real-Time Sync
1. **Manual Coin Ingestion:**
   * Run the sync script from your terminal to refresh all 50+ coins with up-to-the-minute exchange data:
     ```bash
     node scripts/syncRealPrices.js
     ```
2. **Adding Custom Coins or Overriding Prices:**
   * In the Firestore Database, navigate to the **`coins`** collection.
   * Click **Add document** or select an existing coin (e.g. `bitcoin`) to modify `currentPrice`, `name`, or `symbol`. All connected mobile clients will update instantaneously via live listeners.

### 6.4 Enforcing Database Security Rules
* Security rules are defined in [`firestore.rules`](file:///e:/CRTST/MOBILE-APPS/WORKON/VCrupto-main/firestore.rules).
* To deploy updated security rules to production:
  ```bash
  firebase deploy --only firestore:rules
  ```

---

## 7. Project Structure

```
VCrupto-main/
├── .env                              # Active environment configuration (API keys)
├── .env.example                      # Template environment variables
├── App.tsx                           # Main React Native entry & Auth state provider
├── app.json                          # Expo project configuration (SDK 51)
├── babel.config.js                   # Babel compiler settings
├── firebase.json                     # Firebase deployment & emulator configuration
├── firestore.indexes.json            # Firestore leaderboard composite indexes
├── firestore.rules                   # Production Firestore security rules
├── package.json                      # Project dependencies & npm scripts
├── tsconfig.json                     # TypeScript configuration
├── assets/                           # Fonts and 3D illustration images
├── functions/                        # Firebase Cloud Functions (v2)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/index.ts                  # Scheduled price sync & exchange logic
├── scripts/                          # Administrative utility scripts
│   ├── checkPrices.js                # Inspect current coins in Firestore
│   ├── initFirestore.js              # Database initialization & seeding
│   └── syncRealPrices.js             # Live CoinGecko price sync utility
└── src/                              # Mobile Application Source Code
    ├── components/                   # Reusable UI components
    │   ├── CoinPriceGraph/           # Sparkline chart visualization
    │   ├── MarketCoin/               # Market item list row
    │   ├── PercentageChange/         # Price change chip
    │   ├── PortfolioCoin/            # Portfolio holding list item
    │   └── UserRankingItem/          # Leaderboard row item
    ├── constants/                    # Color schemes and app constants
    ├── firebase/                     # Firebase Client Integration
    │   ├── auth.ts                   # Auth handlers (Email, Guest, Session)
    │   ├── config.ts                 # Firebase app & SDK initialization
    │   ├── seed.ts                   # Local fallback data seeder
    │   └── services.ts               # Real-time subscriptions & trade functions
    ├── hooks/                        # Custom React hooks (Cached resources, theme)
    ├── navigation/                   # React Navigation 6 route stacks
    │   ├── BottomTabNavigator.tsx    # 5-tab main application navigation
    │   ├── LinkingConfiguration.ts   # Deep linking schema routes
    │   └── index.tsx                 # Root navigation stack
    ├── screens/                      # Application Screens
    │   ├── CoinDetailsScreen/        # Detailed price data & charts
    │   ├── CoinExchangeScreen/       # Buy/Sell transaction screen
    │   ├── HomeScreen/               # App landing screen
    │   ├── MarketScreen/             # Live cryptocurrency listings
    │   ├── PortfolioScreen/          # Holdings & balance overview
    │   ├── ProfileScreen/            # User profile & sign-out
    │   ├── RankingsScreen/           # Competitive leaderboard
    │   └── WelcomeScreen/            # Authentication & Guest entry
    └── utils/                        # Formatting and context utilities
```

---

## 8. Installation & Local Setup

### 8.1 Prerequisites
* [Node.js](https://nodejs.org/) (v18, v20, or v22 recommended)
* [npm](https://www.npmjs.com/) (v9+)
* [Expo Go app](https://expo.dev/go) installed on your iOS or Android mobile device

### 8.2 Setup Steps

1. **Clone or navigate to the repository:**
   ```bash
   git clone https://github.com/tauseefiqbal/react-native-crypto_exchange_virtual.git
   cd react-native-crypto_exchange_virtual
   ```

2. **Install project dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Verify Environment Variables:**
   Ensure your `.env` file contains your Firebase credentials:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database Collections (First-time setup):**
   ```bash
   node scripts/syncRealPrices.js
   ```

5. **Start the Development Server:**
   ```bash
   npx expo start
   ```

6. **Open on Device:**
   * Open the **Expo Go** app on Android and scan the terminal QR code.
   * On iOS, open the **Camera** app and scan the QR code.
   * *Note:* If running across different Wi-Fi bands or encountering firewall warnings, launch with tunnel mode:
     ```bash
     npx expo start --tunnel
     ```

---

## 9. Environment Variables Configuration

Create a `.env` file in the root directory:

```ini
# Firebase Client Configuration (EXPO_PUBLIC_ prefix exposes to Expo client)
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=react-native-crypto-exchange.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=react-native-crypto-exchange
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=react-native-crypto-exchange.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Node.js / Server fallback variables
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=react-native-crypto-exchange.firebaseapp.com
FIREBASE_PROJECT_ID=react-native-crypto-exchange
FIREBASE_STORAGE_BUCKET=react-native-crypto-exchange.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Toggle Local Emulators (true / false)
EXPO_PUBLIC_USE_FIREBASE_EMULATOR=false
```

---

## 10. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm start` or `npx expo start` | Launches the local Metro bundler for Expo Go |
| `npx expo start --tunnel` | Starts Metro bundler through a public tunnel proxy |
| `npx expo start --android` | Opens app directly in connected Android device/emulator |
| `npx expo start --ios` | Opens app directly in iOS Simulator |
| `npx expo start --web` | Runs app in local web browser |
| `npx expo-doctor` | Runs 17 health and dependency compatibility checks |
| `node scripts/syncRealPrices.js` | Fetches top 50 coins from CoinGecko & updates Firestore |
| `node scripts/initFirestore.js` | Seeds sample leaderboard users and initial coins |
| `node scripts/checkPrices.js` | Inspects currently stored coin prices in Firestore |

---

## 11. License

This project is licensed under the [MIT License](file:///e:/CRTST/MOBILE-APPS/WORKON/VCrupto-main/LICENSE).

