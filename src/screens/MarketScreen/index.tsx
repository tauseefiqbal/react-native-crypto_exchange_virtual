import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import styles from './styles';
import MarketCoin from '../../components/MarketCoin';
import {
  subscribeCoins,
  syncLiveCoinGeckoPrices,
  CoinData,
} from '../../firebase';

const image = require('../../../assets/images/Saly-17.png');

const MarketScreen = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Subscribe to live Firestore updates
    const unsubscribe = subscribeCoins((liveCoins) => {
      if (liveCoins.length > 0) {
        setCoins(liveCoins);
      }
    });

    // 2. Fetch current prices directly from CoinGecko API on screen open
    syncLiveCoinGeckoPrices();

    return () => unsubscribe();
  }, []);

  const refreshCoins = async () => {
    setLoading(true);
    try {
      const data = await syncLiveCoinGeckoPrices();
      if (data && data.length > 0) {
        setCoins(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <FlatList
        style={{ width: '100%' }}
        data={coins}
        keyExtractor={(item) => item.id}
        onRefresh={refreshCoins}
        refreshing={loading}
        renderItem={({ item }) => <MarketCoin marketCoin={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={{ alignItems: 'center' }}
        ListHeaderComponent={() => (
          <>
            <Image style={styles.image} source={image} />
            <Text style={styles.label}>Market</Text>
          </>
        )}
      />
    </View>
  );
};

export default MarketScreen;
