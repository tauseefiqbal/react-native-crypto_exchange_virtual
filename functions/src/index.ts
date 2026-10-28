import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp();
const db = admin.firestore();

const USD_COIN_ID = 'usd';
const INITIAL_BALANCE = 100000.0;
const COINGECKO_API_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=bitcoin%2Cethereum%2Ctether%2Cpolkadot%2Ccardano%2Cbinancecoin%2Cripple%2Clitecoin%2Cchainlink%2Cbitcoin-cash%2Cstellar%2Cusd-coin%2Cdogecoin%2Cwrapped-bitcoin%2Cuniswap%2Caave%2Ccosmos%2Ceos%2Cmonero%2Cbitcoin-cash-sv%2Ciota%2Ctron%2Cnem%2Ctezos%2Cvechain%2Ctheta-token%2Chavven%2Cavalanche-2%2Cneo%2Chuobi-token%2Cterra-luna%2Cdash%2Cokb%2Ccrypto-com-chain%2Cthe-graph%2Celrond-erd-2%2Ccompound-ether%2Csolana%2Cmaker%2Cftx-token%2Ccdai%2Cdai%2Cfilecoin%2Ccelsius-degree-token%2Ckusama%2Csushi%2Ccompound-governance-token%2Czcash%2Cethereum-classic%2Ccompound-usd-coin&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d';

/**
 * 1. User Onboarding Trigger
 * Triggered automatically when an account is created in Firebase Auth.
 * Sets up profile document and grants $100,000 USD virtual balance.
 */
export const onUserCreated = functions.identity.beforeUserCreated ? 
  // v2 identity trigger or standard auth onCreate
  functions.identity.beforeUserCreated((event) => {
    // will be initialized below
  }) : null;

// Auth onCreate v1/v2 compatibility
import { auth } from 'firebase-functions/v1';

export const handleUserSignup = auth.user().onCreate(async (user) => {
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const userId = user.uid;

  const userDocRef = db.collection('users').doc(userId);
  const usdPortfolioRef = userDocRef.collection('portfolioCoins').doc(USD_COIN_ID);

  const batch = db.batch();

  batch.set(userDocRef, {
    id: userId,
    email: user.email || '',
    name: user.displayName || user.email?.split('@')[0] || 'Crypto Trader',
    image: user.photoURL || 'https://i.pravatar.cc/150?u=' + userId,
    networth: INITIAL_BALANCE,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  batch.set(usdPortfolioRef, {
    id: USD_COIN_ID,
    coinId: USD_COIN_ID,
    userId,
    amount: INITIAL_BALANCE,
    updatedAt: timestamp,
  });

  await batch.commit();
  console.log(`Successfully initialized portfolio with $${INITIAL_BALANCE} for user: ${userId}`);
});

/**
 * 2. Coin Exchange Engine
 * Atomic buy/sell execution inside a Firestore Transaction.
 */
interface ExchangeRequest {
  coinId: string;
  isBuy: boolean;
  amount: number;
}

export const exchangeCoins = functions.https.onCall<ExchangeRequest>(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be signed in to execute coin trades.'
    );
  }

  const { coinId, isBuy, amount } = request.data;
  if (!coinId || typeof amount !== 'number' || amount <= 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid coin ID or amount.'
    );
  }

  return await db.runTransaction(async (transaction) => {
    const coinRef = db.collection('coins').doc(coinId);
    const userRef = db.collection('users').doc(uid);
    const usdRef = userRef.collection('portfolioCoins').doc(USD_COIN_ID);
    const coinPortfolioRef = userRef.collection('portfolioCoins').doc(coinId);

    const [coinSnap, usdSnap, coinPortfolioSnap] = await Promise.all([
      transaction.get(coinRef),
      transaction.get(usdRef),
      transaction.get(coinPortfolioRef),
    ]);

    if (!coinSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Coin not found in market.');
    }

    const coinData = coinSnap.data()!;
    const currentPrice = Number(coinData.currentPrice) || 0;
    if (currentPrice <= 0) {
      throw new functions.https.HttpsError('failed-precondition', 'Invalid coin price.');
    }

    const currentUsdAmount = usdSnap.exists ? Number(usdSnap.data()?.amount) || 0 : 0;
    const currentCoinAmount = coinPortfolioSnap.exists ? Number(coinPortfolioSnap.data()?.amount) || 0 : 0;

    const totalTransactionCost = amount * currentPrice;
    const now = admin.firestore.FieldValue.serverTimestamp();

    if (isBuy) {
      if (currentUsdAmount < totalTransactionCost) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `Insufficient USD balance. You need $${totalTransactionCost.toFixed(2)} but only have $${currentUsdAmount.toFixed(2)}.`
        );
      }

      const updatedUsd = currentUsdAmount - totalTransactionCost;
      const updatedCoinAmount = currentCoinAmount + amount;

      transaction.set(usdRef, {
        id: USD_COIN_ID,
        coinId: USD_COIN_ID,
        userId: uid,
        amount: updatedUsd,
        updatedAt: now,
      }, { merge: true });

      transaction.set(coinPortfolioRef, {
        id: coinId,
        coinId,
        userId: uid,
        amount: updatedCoinAmount,
        updatedAt: now,
      }, { merge: true });

      return {
        success: true,
        message: `Successfully purchased ${amount} ${coinData.symbol?.toUpperCase()} for $${totalTransactionCost.toFixed(2)}`,
        usdBalance: updatedUsd,
        coinBalance: updatedCoinAmount,
      };
    } else {
      // Selling crypto
      if (currentCoinAmount < amount) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `Insufficient coin balance. You tried to sell ${amount} but only hold ${currentCoinAmount}.`
        );
      }

      const updatedUsd = currentUsdAmount + totalTransactionCost;
      const updatedCoinAmount = currentCoinAmount - amount;

      transaction.set(coinPortfolioRef, {
        id: coinId,
        coinId,
        userId: uid,
        amount: updatedCoinAmount,
        updatedAt: now,
      }, { merge: true });

      transaction.set(usdRef, {
        id: USD_COIN_ID,
        coinId: USD_COIN_ID,
        userId: uid,
        amount: updatedUsd,
        updatedAt: now,
      }, { merge: true });

      return {
        success: true,
        message: `Successfully sold ${amount} ${coinData.symbol?.toUpperCase()} for $${totalTransactionCost.toFixed(2)}`,
        usdBalance: updatedUsd,
        coinBalance: updatedCoinAmount,
      };
    }
  });
});

/**
 * 3. Market Ingestion: CoinGecko Price Sync
 * Runs on a schedule every 5 minutes (or on-demand).
 */
export const syncCoinGeckoPrices = functions.scheduler.onSchedule(
  {
    schedule: 'every 5 minutes',
    timeZone: 'UTC',
  },
  async () => {
    await performCoinSync();
  }
);

// Callable wrapper for development and manual trigger
export const triggerPriceSync = functions.https.onCall(async () => {
  return await performCoinSync();
});

async function performCoinSync() {
  try {
    const response = await fetch(COINGECKO_API_URL);
    if (!response.ok) {
      throw new Error(`CoinGecko API returned status ${response.status}`);
    }
    const data: any = await response.json();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Firestore batch supports up to 500 writes
    const batch = db.batch();

    // Ensure USD virtual coin exists
    const usdRef = db.collection('coins').doc(USD_COIN_ID);
    batch.set(usdRef, {
      id: USD_COIN_ID,
      cgId: USD_COIN_ID,
      name: 'US Dollar',
      symbol: 'usd',
      image: 'https://cdn-icons-png.flaticon.com/512/217/217853.png',
      currentPrice: 1.0,
      valueChange24H: 0.0,
      valueChange1D: 0.0,
      valueChange7D: 0.0,
      priceHistoryString: JSON.stringify([1, 1, 1, 1, 1]),
      priceHistory: [1, 1, 1, 1, 1],
      updatedAt: timestamp,
    }, { merge: true });

    for (const item of data) {
      const coinRef = db.collection('coins').doc(item.id);
      const sparklinePrices = item.sparkline_in_7d?.price || [];

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
        priceHistoryString: JSON.stringify(sparklinePrices),
        priceHistory: sparklinePrices,
        updatedAt: timestamp,
      }, { merge: true });
    }

    await batch.commit();
    console.log(`Synced ${data.length} coins from CoinGecko successfully.`);

    // Recalculate users networth
    await recalculateAllUsersNetWorth();
    return { success: true, count: data.length };
  } catch (err: any) {
    console.error('Error syncing CoinGecko prices:', err);
    throw new functions.https.HttpsError('internal', err.message);
  }
}

/**
 * 4. Net Worth Recalculator
 * Computes networth = sum(portfolioCoin.amount * currentPrice) for all users.
 */
export async function recalculateAllUsersNetWorth() {
  const coinsSnap = await db.collection('coins').get();
  const pricesMap = new Map<string, number>();
  pricesMap.set(USD_COIN_ID, 1.0);

  coinsSnap.forEach((doc) => {
    const data = doc.data();
    pricesMap.set(doc.id, Number(data.currentPrice) || 0);
  });

  const usersSnap = await db.collection('users').get();
  const updates: Promise<any>[] = [];

  for (const userDoc of usersSnap.docs) {
    const userId = userDoc.id;
    const portfolioSnap = await db
      .collection('users')
      .doc(userId)
      .collection('portfolioCoins')
      .get();

    let totalNetWorth = 0;
    portfolioSnap.forEach((coinHolding) => {
      const { coinId, amount } = coinHolding.data();
      const price = pricesMap.get(coinId) || 0;
      totalNetWorth += (Number(amount) || 0) * price;
    });

    updates.push(
      userDoc.ref.update({
        networth: Math.round(totalNetWorth * 100) / 100,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    );
  }

  await Promise.all(updates);
  console.log(`Updated net worth for ${usersSnap.size} users.`);
}

