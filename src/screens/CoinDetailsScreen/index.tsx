import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from './styles';
import PercentageChange from '../../components/PercentageChange';
import CoinPriceGraph from '../../components/CoinPriceGraph';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppContext from '../../utils/AppContext';
import formatMoney from '../../utils/formatMoney';
import {
  subscribeCoin,
  fetchUserHolding,
  CoinData,
  PortfolioCoinData,
} from '../../firebase';

const CoinDetailsScreen = () => {
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [portfolioCoin, setPortfolioCoin] = useState<PortfolioCoinData | null>(null);

  const { userId } = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute<any>();

  const coinId = route.params?.id;

  useEffect(() => {
    if (!coinId) return;

    // Realtime coin price listener
    const unsubscribe = subscribeCoin(coinId, (updatedCoin) => {
      if (updatedCoin) {
        setCoin(updatedCoin);
      }
    });

    // Fetch user holding for this specific coin
    if (userId) {
      fetchUserHolding(userId, coinId).then((holding) => {
        setPortfolioCoin(holding);
      });
    }

    return () => unsubscribe();
  }, [coinId, userId]);

  const onBuy = () => {
    navigation.navigate('CoinExchange', { isBuy: true, coin, portfolioCoin });
  };

  const onSell = () => {
    navigation.navigate('CoinExchange', { isBuy: false, coin, portfolioCoin });
  };

  if (!coin) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2f95dc" />
      </View>
    );
  }

  const holdingAmount = portfolioCoin?.amount || 0;
  const holdingValue = coin.currentPrice * holdingAmount;

  return (
    <View style={styles.root}>
      <View style={styles.topContainer}>
        <View style={styles.left}>
          <Image style={styles.image} source={{ uri: coin.image }} />
          <View>
            <Text style={styles.name}>{coin.name}</Text>
            <Text style={styles.symbol}>{coin.symbol?.toUpperCase()}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <AntDesign name="staro" size={30} color="#2f95dc" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.valueContainer}>
          <Text style={styles.label}>Current price</Text>
          <Text style={styles.value}>${formatMoney(coin.currentPrice)}</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={styles.valueContainer}>
            <Text style={styles.label}>1 hour</Text>
            <PercentageChange value={coin.valueChange24H} />
          </View>

          <View style={styles.valueContainer}>
            <Text style={styles.label}>1 day</Text>
            <PercentageChange value={coin.valueChange1D} />
          </View>

          <View style={styles.valueContainer}>
            <Text style={styles.label}>7 days</Text>
            <PercentageChange value={coin.valueChange7D} />
          </View>
        </View>
      </View>

      {coin.priceHistoryString && (
        <CoinPriceGraph dataString={coin.priceHistoryString} />
      )}

      <View style={styles.row}>
        <Text style={{ fontWeight: '600' }}>Position</Text>
        <Text>
          {coin.symbol?.toUpperCase()} {formatMoney(holdingAmount, 4)} ($
          {formatMoney(holdingValue, 2)})
        </Text>
      </View>

      <View style={[styles.row, { marginTop: 'auto' }]}>
        <Pressable
          style={[styles.button, { backgroundColor: '#20b100' }]}
          onPress={onBuy}
        >
          <Text style={styles.buttonText}>Buy</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: '#ff0000' }]}
          onPress={onSell}
        >
          <Text style={styles.buttonText}>Sell</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CoinDetailsScreen;
