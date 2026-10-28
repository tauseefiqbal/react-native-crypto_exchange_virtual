import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import styles from './styles';
import PortfolioCoin from '../../components/PortfolioCoin';
import AppContext from '../../utils/AppContext';
import formatMoney from '../../utils/formatMoney';
import {
  subscribeUserPortfolio,
  PortfolioCoinData,
} from '../../firebase';

const image = require('../../../assets/images/Saly-10.png');

const PortfolioScreen = () => {
  const [balance, setBalance] = useState(0);
  const [portfolioCoins, setPortfolioCoins] = useState<PortfolioCoinData[]>([]);
  const [loading, setLoading] = useState(false);

  const { userId } = useContext(AppContext);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    // Realtime portfolio subscription
    const unsubscribe = subscribeUserPortfolio(userId, (holdings, totalNetWorth) => {
      setBalance(totalNetWorth);
      // Filter out empty holdings and items without a coin object
      const activeHoldings = holdings.filter(
        (h) => h.amount > 0 && h.coin && h.coinId !== 'usd'
      );
      setPortfolioCoins(activeHoldings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <View style={styles.root}>
      <FlatList
        style={{ width: '100%' }}
        data={portfolioCoins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PortfolioCoin portfolioCoin={item as any} />}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={{ alignItems: 'center' }}
        ListHeaderComponent={() => (
          <>
            <Image style={styles.image} source={image} />
            <View style={styles.balanceContainer}>
              <Text style={styles.label}>Portfolio balance</Text>
              <Text style={styles.balance}>${formatMoney(balance)}</Text>
            </View>
          </>
        )}
      />
    </View>
  );
};

export default PortfolioScreen;
