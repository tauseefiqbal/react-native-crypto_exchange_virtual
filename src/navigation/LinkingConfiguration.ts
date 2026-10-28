import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Welcome: 'welcome',
      Root: {
        screens: {
          Home: 'home',
          Portfolio: 'portfolio',
          Market: 'market',
          Rankings: 'rankings',
          Profile: 'profile',
        },
      },
      CoinDetails: 'coin/:id',
      CoinExchange: 'exchange',
      NotFound: '*',
    },
  },
};
