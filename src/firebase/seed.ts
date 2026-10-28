import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const seedSampleCoins = async () => {
  const batch = writeBatch(db);
  const now = serverTimestamp();

  const sampleCoins = [
    {
      id: 'bitcoin',
      cgId: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'btc',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      currentPrice: 65420.5,
      valueChange24H: 1.25,
      valueChange1D: 2.85,
      valueChange7D: 6.4,
      priceHistory: [62000, 62500, 63100, 64200, 63800, 64900, 65420.5],
      priceHistoryString: JSON.stringify([62000, 62500, 63100, 64200, 63800, 64900, 65420.5]),
      updatedAt: now,
    },
    {
      id: 'ethereum',
      cgId: 'ethereum',
      name: 'Ethereum',
      symbol: 'eth',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      currentPrice: 3450.2,
      valueChange24H: -0.4,
      valueChange1D: 1.15,
      valueChange7D: 4.8,
      priceHistory: [3200, 3250, 3300, 3380, 3410, 3420, 3450.2],
      priceHistoryString: JSON.stringify([3200, 3250, 3300, 3380, 3410, 3420, 3450.2]),
      updatedAt: now,
    },
    {
      id: 'solana',
      cgId: 'solana',
      name: 'Solana',
      symbol: 'sol',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      currentPrice: 178.4,
      valueChange24H: 3.1,
      valueChange1D: 8.6,
      valueChange7D: 15.2,
      priceHistory: [145, 150, 158, 162, 170, 172, 178.4],
      priceHistoryString: JSON.stringify([145, 150, 158, 162, 170, 172, 178.4]),
      updatedAt: now,
    },
    {
      id: 'binancecoin',
      cgId: 'binancecoin',
      name: 'BNB',
      symbol: 'bnb',
      image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
      currentPrice: 590.1,
      valueChange24H: 0.2,
      valueChange1D: -0.8,
      valueChange7D: 2.3,
      priceHistory: [570, 580, 585, 592, 588, 591, 590.1],
      priceHistoryString: JSON.stringify([570, 580, 585, 592, 588, 591, 590.1]),
      updatedAt: now,
    },
    {
      id: 'cardano',
      cgId: 'cardano',
      name: 'Cardano',
      symbol: 'ada',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      currentPrice: 0.48,
      valueChange24H: -1.1,
      valueChange1D: 3.2,
      valueChange7D: -2.4,
      priceHistory: [0.5, 0.49, 0.47, 0.46, 0.48, 0.47, 0.48],
      priceHistoryString: JSON.stringify([0.5, 0.49, 0.47, 0.46, 0.48, 0.47, 0.48]),
      updatedAt: now,
    },
    {
      id: 'dogecoin',
      cgId: 'dogecoin',
      name: 'Dogecoin',
      symbol: 'doge',
      image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
      currentPrice: 0.145,
      valueChange24H: 4.8,
      valueChange1D: 12.3,
      valueChange7D: 22.0,
      priceHistory: [0.11, 0.12, 0.125, 0.13, 0.138, 0.14, 0.145],
      priceHistoryString: JSON.stringify([0.11, 0.12, 0.125, 0.13, 0.138, 0.14, 0.145]),
      updatedAt: now,
    },
  ];

  for (const coin of sampleCoins) {
    const coinRef = doc(db, 'coins', coin.id);
    batch.set(coinRef, coin, { merge: true });
  }

  // Ensure USD virtual coin exists
  const usdRef = doc(db, 'coins', 'usd');
  batch.set(usdRef, {
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

  await batch.commit();
  console.log('[Firebase] Sample coins seeded successfully.');
};

