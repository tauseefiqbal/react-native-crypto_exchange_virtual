const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function check() {
  console.log('Reading coins from Firestore...');
  try {
    const snap = await getDocs(collection(db, 'coins'));
    console.log(`Found ${snap.size} coins in Firestore:`);
    snap.forEach((d) => {
      const data = d.data();
      console.log(`- ${data.name} (${data.symbol}): currentPrice = ${data.currentPrice} (type: ${typeof data.currentPrice})`);
    });
  } catch (err) {
    console.error('Error reading Firestore:', err.message);
  }
}

check();

