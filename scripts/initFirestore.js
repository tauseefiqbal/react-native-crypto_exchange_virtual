const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} = require('firebase/firestore');
const { getAuth, signInAnonymously } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyBompcVIwQnLNzJZVHZuBJghKHlWcPW6UQ",
  authDomain: "react-native-crypto-exchange.firebaseapp.com",
  projectId: "react-native-crypto-exchange",
  storageBucket: "react-native-crypto-exchange.firebasestorage.app",
  messagingSenderId: "36205928710",
  appId: "1:36205928710:web:1e7ed29e56098a50f53e87"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const sampleCoins = [
  {
    id: 'usd',
    cgId: 'usd',
    name: 'US Dollar',
    symbol: 'usd',
    image: 'https://cdn-icons-png.flaticon.com/512/217/217853.png',
    currentPrice: 1.0,
    valueChange24H: 0.0,
    valueChange1D: 0.0,
    valueChange7D: 0.0,
    priceHistory: [1, 1, 1, 1, 1],
    priceHistoryString: JSON.stringify([1, 1, 1, 1, 1]),
  },
  {
    id: 'bitcoin',
    cgId: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    currentPrice: 67850.0,
    valueChange24H: 1.45,
    valueChange1D: 3.2,
    valueChange7D: 7.8,
    priceHistory: [63000, 63800, 64200, 65500, 66100, 67200, 67850],
    priceHistoryString: JSON.stringify([63000, 63800, 64200, 65500, 66100, 67200, 67850]),
  },
  {
    id: 'ethereum',
    cgId: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    currentPrice: 3520.4,
    valueChange24H: -0.35,
    valueChange1D: 2.1,
    valueChange7D: 5.6,
    priceHistory: [3300, 3340, 3380, 3450, 3480, 3500, 3520.4],
    priceHistoryString: JSON.stringify([3300, 3340, 3380, 3450, 3480, 3500, 3520.4]),
  },
  {
    id: 'solana',
    cgId: 'solana',
    name: 'Solana',
    symbol: 'sol',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    currentPrice: 182.5,
    valueChange24H: 2.8,
    valueChange1D: 9.4,
    valueChange7D: 18.2,
    priceHistory: [150, 155, 160, 168, 172, 179, 182.5],
    priceHistoryString: JSON.stringify([150, 155, 160, 168, 172, 179, 182.5]),
  },
  {
    id: 'binancecoin',
    cgId: 'binancecoin',
    name: 'BNB',
    symbol: 'bnb',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    currentPrice: 598.0,
    valueChange24H: 0.1,
    valueChange1D: -0.5,
    valueChange7D: 3.1,
    priceHistory: [580, 582, 590, 595, 592, 596, 598],
    priceHistoryString: JSON.stringify([580, 582, 590, 595, 592, 596, 598]),
  },
  {
    id: 'cardano',
    cgId: 'cardano',
    name: 'Cardano',
    symbol: 'ada',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    currentPrice: 0.49,
    valueChange24H: -0.8,
    valueChange1D: 1.5,
    valueChange7D: -1.2,
    priceHistory: [0.5, 0.49, 0.48, 0.47, 0.48, 0.49, 0.49],
    priceHistoryString: JSON.stringify([0.5, 0.49, 0.48, 0.47, 0.48, 0.49, 0.49]),
  },
  {
    id: 'dogecoin',
    cgId: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'doge',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    currentPrice: 0.152,
    valueChange24H: 5.2,
    valueChange1D: 14.1,
    valueChange7D: 25.0,
    priceHistory: [0.12, 0.125, 0.13, 0.135, 0.14, 0.148, 0.152],
    priceHistoryString: JSON.stringify([0.12, 0.125, 0.13, 0.135, 0.14, 0.148, 0.152]),
  },
  {
    id: 'ripple',
    cgId: 'ripple',
    name: 'XRP',
    symbol: 'xrp',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    currentPrice: 0.58,
    valueChange24H: 0.4,
    valueChange1D: 2.3,
    valueChange7D: 4.1,
    priceHistory: [0.55, 0.56, 0.55, 0.57, 0.56, 0.57, 0.58],
    priceHistoryString: JSON.stringify([0.55, 0.56, 0.55, 0.57, 0.56, 0.57, 0.58]),
  }
];

const demoUsers = [
  {
    id: 'demo_user_satoshi',
    name: 'Satoshi Nakamoto',
    email: 'satoshi@bitcoin.org',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
    networth: 1452000.0,
  },
  {
    id: 'demo_user_vitalik',
    name: 'Vitalik Buterin',
    email: 'vitalik@ethereum.org',
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150',
    networth: 980500.0,
  },
  {
    id: 'demo_user_alex',
    name: 'Alex Crypto',
    email: 'alex@vcrupto.com',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150',
    networth: 215400.0,
  },
  {
    id: 'demo_user_sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.j@invest.io',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150',
    networth: 112000.0,
  }
];

async function initializeDatabase() {
  console.log('Connecting to Firebase project: react-native-crypto-exchange...');

  // Try signing in anonymously if enabled
  try {
    const cred = await signInAnonymously(auth);
    console.log('Signed in anonymously with UID:', cred.user.uid);
  } catch (authErr) {
    console.log('Note: Anonymous sign-in not enabled or skipped. Proceeding to write docs...');
  }

  // 1. Create 'coins' collection
  console.log('\n--- Creating & Seeding "coins" collection ---');
  for (const coin of sampleCoins) {
    const coinRef = doc(db, 'coins', coin.id);
    await setDoc(coinRef, {
      ...coin,
      updatedAt: serverTimestamp(),
    });
    console.log(` Created coin: ${coin.name} (${coin.symbol.toUpperCase()})`);
  }

  // 2. Create 'users' collection (Leaderboard demo traders)
  console.log('\n--- Creating & Seeding "users" collection (Rankings) ---');
  for (const user of demoUsers) {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Also seed a USD holding for them
    const usdHoldingRef = doc(db, 'users', user.id, 'portfolioCoins', 'usd');
    await setDoc(usdHoldingRef, {
      id: 'usd',
      coinId: 'usd',
      userId: user.id,
      amount: 100000.0,
      updatedAt: serverTimestamp(),
    });

    console.log(` Created user: ${user.name} - Networth: $${user.networth}`);
  }

  console.log('\n Success! All collections ("coins", "users", "portfolioCoins") have been initialized.');
  process.exit(0);
}

initializeDatabase().catch((err) => {
  console.error('\nError initializing database:', err.message);
  console.error('Code:', err.code);
  process.exit(1);
});

