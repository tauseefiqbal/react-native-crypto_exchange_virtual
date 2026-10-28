import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import AppContext from '../../utils/AppContext';
import formatMoney from '../../utils/formatMoney';
import {
  fetchUserHolding,
  executeCoinExchange,
  PortfolioCoinData,
} from '../../firebase';

const image = require('../../../assets/images/Saly-31.png');

const CoinExchangeScreen = () => {
  const [coinAmount, setCoinAmount] = useState('');
  const [coinUSDValue, setCoinUSDValue] = useState('');
  const [usdPortfolioCoin, setUsdPortfolioCoin] = useState<PortfolioCoinData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<any>();
  const { userId } = useContext(AppContext);
  const route = useRoute<any>();

  const isBuy = route?.params?.isBuy;
  const coin = route?.params?.coin;
  const portfolioCoin = route?.params?.portfolioCoin;

  const loadUSDPortfolio = async () => {
    if (!userId) return;
    try {
      const holding = await fetchUserHolding(userId, 'usd');
      setUsdPortfolioCoin(holding);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUSDPortfolio();
  }, [userId]);

  const onCoinAmountChange = (text: string) => {
    setCoinAmount(text);
    const amount = parseFloat(text);
    if (!isNaN(amount) && coin?.currentPrice) {
      setCoinUSDValue((amount * coin.currentPrice).toFixed(2));
    } else {
      setCoinUSDValue('');
    }
  };

  const onUSDAmountChange = (text: string) => {
    setCoinUSDValue(text);
    const usdVal = parseFloat(text);
    if (!isNaN(usdVal) && coin?.currentPrice && coin.currentPrice > 0) {
      setCoinAmount((usdVal / coin.currentPrice).toFixed(6));
    } else {
      setCoinAmount('');
    }
  };

  const onSellAll = () => {
    if (portfolioCoin?.amount) {
      onCoinAmountChange(portfolioCoin.amount.toString());
    }
  };

  const onBuyAll = () => {
    if (usdPortfolioCoin?.amount) {
      onUSDAmountChange(usdPortfolioCoin.amount.toString());
    }
  };

  const onPlaceOrder = async () => {
    const amountToTrade = parseFloat(coinAmount);
    if (isNaN(amountToTrade) || amountToTrade <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to trade.');
      return;
    }

    const maxUsd = usdPortfolioCoin?.amount || 0;
    const totalUsdCost = amountToTrade * (coin?.currentPrice || 0);

    if (isBuy && totalUsdCost > maxUsd) {
      Alert.alert('Insufficient Balance', `Not enough USD balance. Maximum available: $${formatMoney(maxUsd, 2)}`);
      return;
    }

    const currentCoinHolding = portfolioCoin?.amount || 0;
    if (!isBuy && amountToTrade > currentCoinHolding) {
      Alert.alert('Insufficient Coins', `You only hold ${currentCoinHolding} ${coin?.symbol?.toUpperCase()}.`);
      return;
    }

    setIsLoading(true);
    try {
      await executeCoinExchange(coin.id, isBuy, amountToTrade);
      Alert.alert(
        'Order Completed',
        `Successfully ${isBuy ? 'bought' : 'sold'} ${amountToTrade} ${coin?.symbol?.toUpperCase()}!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Portfolio'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Order Failed', err.message || 'There was an error executing this transaction.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <Text style={styles.title}>
        {isBuy ? 'Buy ' : 'Sell '}
        {coin?.name}
      </Text>
      <Text style={styles.subtitle}>
        1 {coin?.symbol?.toUpperCase()} = ${formatMoney(coin?.currentPrice)}
      </Text>
      <Image style={styles.image} source={image} />

      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            keyboardType="decimal-pad"
            placeholder="0"
            value={coinAmount}
            onChangeText={onCoinAmountChange}
          />
          <Text>{coin?.symbol?.toUpperCase()}</Text>
        </View>
        <Text style={{ fontSize: 30 }}>=</Text>

        <View style={styles.inputContainer}>
          <TextInput
            keyboardType="decimal-pad"
            placeholder="0"
            value={coinUSDValue}
            onChangeText={onUSDAmountChange}
          />
          <Text>USD</Text>
        </View>
      </View>

      {isBuy ? (
        <Pressable onPress={onBuyAll}>
          <Text style={{ color: '#0097ff' }}>
            Buy max (${formatMoney(usdPortfolioCoin?.amount || 0, 2)})
          </Text>
        </Pressable>
      ) : (
        <Pressable onPress={onSellAll}>
          <Text style={{ color: '#0097ff' }}>
            Sell all ({portfolioCoin?.amount || 0} {coin?.symbol?.toUpperCase()})
          </Text>
        </Pressable>
      )}

      <Pressable style={styles.button} onPress={onPlaceOrder} disabled={isLoading}>
        <Text style={styles.buttonText}>Place Order</Text>
        {isLoading && <ActivityIndicator color="white" style={{ marginLeft: 10 }} />}
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default CoinExchangeScreen;
