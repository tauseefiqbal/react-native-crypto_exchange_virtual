import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  runTransaction,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, auth } from './config';

export interface CoinData {
  id: string;
  cgId: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  valueChange24H: number;
  valueChange1D: number;
  valueChange7D: number;
  priceHistoryString?: string;
  priceHistory?: number[];
}

export interface PortfolioCoinData {
  id: string;
  coinId: string;
  userId: string;
  amount: number;
  coin?: CoinData;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  image: string;
  networth: number;
  portfolioCoins?: PortfolioCoinData[];
}

/**
 * 1. Market Coins
 */
export const subscribeCoins = (callback: (coins: CoinData[]) => void) => {
  const coinsRef = collection(db, 'coins');
  return onSnapshot(coinsRef, (snapshot) => {
    const coins: CoinData[] = [];
    snapshot.forEach((docSnap) => {
      // Exclude USD from general market crypto listings
      if (docSnap.id !== 'usd') {
        coins.push({ id: docSnap.id, ...docSnap.data() } as CoinData);
      }
    });
    callback(coins);
  });
};

export const fetchCoins = async (): Promise<CoinData[]> => {
  const coinsRef = collection(db, 'coins');
  const snapshot = await getDocs(coinsRef);
  const coins: CoinData[] = [];
  snapshot.forEach((docSnap) => {
    if (docSnap.id !== 'usd') {
      coins.push({ id: docSnap.id, ...docSnap.data() } as CoinData);
    }
  });
  return coins;
};

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d';

/**
 * Fetch live current cryptocurrency prices from CoinGecko API
 * and sync them directly to Cloud Firestore.
 */
export const syncLiveCoinGeckoPrices = async (): Promise<CoinData[]> => {
  try {
    const res = await fetch(COINGECKO_URL);
    if (!res.ok) {
      throw new Error(`CoinGecko status: ${res.status}`);
    }
    const data = await res.json();
    const batch = writeBatch(db);
    const now = serverTimestamp();
    const results: CoinData[] = [];

    // Ensure USD base currency is in Firestore
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

    for (const item of data) {
      const coinRef = doc(db, 'coins', item.id);
      const sparklinePrices = item.sparkline_in_7d?.price || [];
      const coinDoc: CoinData = {
        id: item.id,
        cgId: item.id,
        name: item.name,
        symbol: (item.symbol || '').toLowerCase(),
        image: item.image,
        currentPrice: Number(item.current_price) || 0,
        valueChange24H: Number(item.price_change_percentage_1h_in_currency) || 0,
        valueChange1D: Number(item.price_change_percentage_24h_in_currency) || 0,
        valueChange7D: Number(item.price_change_percentage_7d_in_currency) || 0,
        priceHistoryString: JSON.stringify(sparklinePrices),
        priceHistory: sparklinePrices,
      };

      batch.set(coinRef, {
        ...coinDoc,
        updatedAt: now,
      }, { merge: true });

      results.push(coinDoc);
    }

    await batch.commit();
    return results;
  } catch (err) {
    console.warn('[CoinGecko] Error syncing live prices, using cached Firestore coins:', err);
    return await fetchCoins();
  }
};

export const subscribeCoin = (id: string, callback: (coin: CoinData | null) => void) => {
  const coinRef = doc(db, 'coins', id);
  return onSnapshot(coinRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as CoinData);
    } else {
      callback(null);
    }
  });
};

export const fetchCoin = async (id: string): Promise<CoinData | null> => {
  const coinRef = doc(db, 'coins', id);
  const docSnap = await getDoc(coinRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as CoinData;
  }
  return null;
};

/**
 * 2. User & Portfolio
 */
export const subscribeUser = (userId: string, callback: (user: UserProfileData | null) => void) => {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as UserProfileData);
    } else {
      callback(null);
    }
  });
};

export const fetchUser = async (userId: string): Promise<UserProfileData | null> => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserProfileData;
  }
  return null;
};

export const subscribeUserPortfolio = (
  userId: string,
  callback: (portfolioCoins: PortfolioCoinData[], totalNetWorth: number) => void
) => {
  const portfolioRef = collection(db, 'users', userId, 'portfolioCoins');

  return onSnapshot(portfolioRef, async (snapshot) => {
    const coinsSnap = await getDocs(collection(db, 'coins'));
    const coinsMap = new Map<string, CoinData>();
    coinsSnap.forEach((c) => coinsMap.set(c.id, { id: c.id, ...c.data() } as CoinData));

    let networth = 0;
    const items: PortfolioCoinData[] = [];

    snapshot.forEach((pDoc) => {
      const data = pDoc.data();
      const coinDetail = coinsMap.get(data.coinId);
      const amount = Number(data.amount) || 0;

      if (coinDetail) {
        networth += amount * (Number(coinDetail.currentPrice) || 0);
      } else if (data.coinId === 'usd') {
        networth += amount;
      }

      items.push({
        id: pDoc.id,
        coinId: data.coinId,
        userId: data.userId || userId,
        amount,
        coin: coinDetail,
      });
    });

    callback(items, Math.round(networth * 100) / 100);
  });
};

export const fetchUserHolding = async (userId: string, coinId: string): Promise<PortfolioCoinData | null> => {
  const holdingRef = doc(db, 'users', userId, 'portfolioCoins', coinId);
  const holdingSnap = await getDoc(holdingRef);
  if (holdingSnap.exists()) {
    return { id: holdingSnap.id, ...holdingSnap.data() } as PortfolioCoinData;
  }
  return null;
};

/**
 * 3. Leaderboard Rankings
 */
export const subscribeRankings = (
  maxLimit: number = 100,
  callback: (users: UserProfileData[]) => void
) => {
  const rankingsQuery = query(
    collection(db, 'users'),
    orderBy('networth', 'desc'),
    limit(maxLimit)
  );

  return onSnapshot(rankingsQuery, (snapshot) => {
    const list: UserProfileData[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as UserProfileData);
    });
    callback(list);
  });
};

export const fetchRankings = async (maxLimit: number = 100): Promise<UserProfileData[]> => {
  const rankingsQuery = query(
    collection(db, 'users'),
    orderBy('networth', 'desc'),
    limit(maxLimit)
  );
  const snapshot = await getDocs(rankingsQuery);
  const list: UserProfileData[] = [];
  snapshot.forEach((d) => {
    list.push({ id: d.id, ...d.data() } as UserProfileData);
  });
  return list;
};

/**
 * 4. Execute Buy/Sell Trade
 * Calls the Cloud Function, with fallback to client-side Firestore transaction
 * for direct testing in development environments.
 */
export const executeCoinExchange = async (
  coinId: string,
  isBuy: boolean,
  amount: number
) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User is not authenticated.');

  try {
    // Attempt via Cloud Function first if deployed
    const exchangeFn = httpsCallable<any, any>(functions, 'exchangeCoins');
    const result = await exchangeFn({ coinId, isBuy, amount });
    return result.data;
  } catch (cloudFnErr: any) {
    // Cloud Function is not deployed (common on free Firebase tier).
    // Execute atomic client-side Firestore transaction with balance verification.
    console.log('[Firebase] Executing trade via atomic Firestore transaction.');

    return await runTransaction(db, async (tx) => {
      const coinRef = doc(db, 'coins', coinId);
      const usdRef = doc(db, 'users', user.uid, 'portfolioCoins', 'usd');
      const holdingRef = doc(db, 'users', user.uid, 'portfolioCoins', coinId);

      const [coinDoc, usdDoc, holdingDoc] = await Promise.all([
        tx.get(coinRef),
        tx.get(usdRef),
        tx.get(holdingRef),
      ]);

      if (!coinDoc.exists()) throw new Error('Coin does not exist');
      const price = Number(coinDoc.data().currentPrice) || 0;
      const currentUsd = usdDoc.exists() ? Number(usdDoc.data().amount) || 0 : 0;
      const currentHolding = holdingDoc.exists() ? Number(holdingDoc.data().amount) || 0 : 0;

      const totalCost = amount * price;
      const now = serverTimestamp();

      if (isBuy) {
        if (currentUsd < totalCost) {
          throw new Error(`Not enough USD balance. Needed: $${totalCost.toFixed(2)}, Available: $${currentUsd.toFixed(2)}`);
        }
        tx.set(usdRef, { id: 'usd', coinId: 'usd', userId: user.uid, amount: currentUsd - totalCost, updatedAt: now }, { merge: true });
        tx.set(holdingRef, { id: coinId, coinId, userId: user.uid, amount: currentHolding + amount, updatedAt: now }, { merge: true });
      } else {
        if (currentHolding < amount) {
          throw new Error(`Not enough coins to sell. Tried to sell: ${amount}, Available: ${currentHolding}`);
        }
        tx.set(holdingRef, { id: coinId, coinId, userId: user.uid, amount: currentHolding - amount, updatedAt: now }, { merge: true });
        tx.set(usdRef, { id: 'usd', coinId: 'usd', userId: user.uid, amount: currentUsd + totalCost, updatedAt: now }, { merge: true });
      }

      return { success: true };
    });
  }
};

