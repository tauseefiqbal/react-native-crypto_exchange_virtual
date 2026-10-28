const { initializeApp } = require('firebase/app');
const { getFirestore, doc, writeBatch, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBompcVIwQnLNzJZVHZuBJghKHlWcPW6UQ",
  authDomain: "react-native-crypto-exchange.firebaseapp.com",
  projectId: "react-native-crypto-exchange",
  storageBucket: "react-native-crypto-exchange.firebasestorage.app",
  messagingSenderId: "36205928710",
  appId: "1:36205928710:web:1e7ed29e56098a50f53e87"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d';

async function updateLivePrices() {
  console.log('Fetching live real-world crypto prices from CoinGecko API...');
  const res = await fetch(COINGECKO_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch CoinGecko API: ${res.status}`);
  }
  const coins = await res.json();
  console.log(`Received ${coins.length} coins from CoinGecko.`);

  const batch = writeBatch(db);
  const now = serverTimestamp();

  // Ensure USD
  batch.set(doc(db, 'coins', 'usd'), {
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
    updatedAt: now,
  }, { merge: true });

  for (const item of coins) {
    const coinRef = doc(db, 'coins', item.id);
    const sparkline = item.sparkline_in_7d?.price || [];

    batch.set(coinRef, {
      id: item.id,
      cgId: item.id,
      name: item.name,
      symbol: (item.symbol || '').toLowerCase(),
      image: item.image,
      currentPrice: Number(item.current_price) || 0,
      valueChange24H: Number(item.price_change_percentage_1h_in_currency) || 0,
      valueChange1D: Number(item.price_change_percentage_24h_in_currency) || 0,
      valueChange7D: Number(item.price_change_percentage_7d_in_currency) || 0,
      priceHistoryString: JSON.stringify(sparkline),
      priceHistory: sparkline,
      updatedAt: now,
    }, { merge: true });

    console.log(`✓ ${item.name} (${item.symbol.toUpperCase()}): $${item.current_price}`);
  }

  await batch.commit();
  console.log('\n Successfully updated all coins in Firestore with LIVE market prices!');
  process.exit(0);
}

updateLivePrices().catch(err => {
  console.error('Error updating live prices:', err.message);
  process.exit(1);
});

