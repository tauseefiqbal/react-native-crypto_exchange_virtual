import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import styles from './styles';
import UserRankingItem from '../../components/UserRankingItem';
import { subscribeRankings, fetchRankings, UserProfileData } from '../../firebase';

const image = require('../../../assets/images/Saly-20.png');

const RankingsScreen = () => {
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Realtime leaderboard updates
    const unsubscribe = subscribeRankings(100, (rankedUsers) => {
      setUsers(rankedUsers);
    });

    return () => unsubscribe();
  }, []);

  const refreshRankings = async () => {
    setLoading(true);
    try {
      const data = await fetchRankings(100);
      setUsers(data);
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
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <UserRankingItem user={item as any} place={index + 1} />
        )}
        onRefresh={refreshRankings}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={{ alignItems: 'center' }}
        ListHeaderComponent={() => (
          <>
            <Image style={styles.image} source={image} />
            <Text style={styles.label}>Rankings</Text>
          </>
        )}
      />
    </View>
  );
};

export default RankingsScreen;
