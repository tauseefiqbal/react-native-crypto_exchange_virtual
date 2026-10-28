import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import styles from './styles';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AppContext from '../../utils/AppContext';
import formatMoney from '../../utils/formatMoney';
import {
  subscribeUser,
  logoutUser,
  UserProfileData,
} from '../../firebase';

const image = require('../../../assets/images/Saly-16.png');

const ProfileScreen = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const { userId, setUserId } = useContext(AppContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeUser(userId, (userData) => {
      setUser(userData);
    });

    return () => unsubscribe();
  }, [userId]);

  const signOut = async () => {
    try {
      await logoutUser();
      setUserId(null as any);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        })
      );
    } catch (e) {
      console.error('Error signing out:', e);
    }
  };

  if (!user) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4a40d4" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Image style={styles.image} source={image} />

      <View style={styles.userContainer}>
        <Image style={styles.userImage} source={{ uri: user.image }} />
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.value}>${formatMoney(user.networth, 0)}</Text>
        </View>
      </View>

      <Pressable onPress={signOut} style={{ marginTop: 'auto' }}>
        <Text style={{ color: '#ff4444', fontWeight: 'bold' }}>Sign out</Text>
      </Pressable>
    </View>
  );
};

export default ProfileScreen;
