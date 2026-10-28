import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './styles';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AppContext from '../../utils/AppContext';
import {
  subscribeAuthState,
  loginAsGuest,
  loginWithEmail,
  registerWithEmail,
  seedSampleCoins,
} from '../../firebase';

const image = require('../../../assets/images/Saly-1.png');
const googleButtonImage = require('../../../assets/images/google-button.png');
const appleButtonImage = require('../../../assets/images/apple-button.png');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { setUserId } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  // Email login modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeAuthState((user) => {
      if (user) {
        setUserId(user.uid);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Root' }],
          })
        );
      }
    });

    return () => unsubscribe();
  }, [navigation, setUserId]);

  const handleGuestSignIn = async () => {
    try {
      setLoading(true);
      await seedSampleCoins();
      const user = await loginAsGuest('Crypto Trader');
      setUserId(user.uid);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Root' }],
        })
      );
    } catch (err: any) {
      console.error('Sign-in error:', err);
      if (err.code === 'auth/admin-restricted-operation') {
        Alert.alert(
          'Anonymous Auth Disabled',
          'To sign in as Guest, please enable "Anonymous" in Firebase Console:\n\n1. Go to Firebase Console > Authentication > Sign-in method\n2. Click "Anonymous" and toggle Enable\n3. Click Save\n\nOr sign in using Email & Password below.',
          [
            { text: 'Use Email Instead', onPress: () => setShowEmailModal(true) },
            { text: 'OK' },
          ]
        );
      } else {
        Alert.alert('Sign-In Error', err.message || 'Could not sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    try {
      setLoading(true);
      await seedSampleCoins();
      if (isRegistering) {
        await registerWithEmail(email.trim(), password, displayName || undefined);
      } else {
        await loginWithEmail(email.trim(), password);
      }
      setShowEmailModal(false);
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        Alert.alert('Login Failed', 'Invalid email or password.');
      } else if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
        Alert.alert(
          'Email Provider Disabled',
          'Please enable "Email/Password" in Firebase Console > Authentication > Sign-in method.'
        );
      } else {
        Alert.alert('Authentication Error', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <Image style={styles.image} source={image} />
      <Text style={styles.header1}>Welcome to VCrypto</Text>
      <Text style={styles.header2}>Invest your virtual $100.000 and compete with others</Text>

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#4a40d4" />
        ) : (
          <>
            {Platform.OS === 'ios' && (
              <Pressable onPress={handleGuestSignIn} style={styles.googleButton}>
                <Image style={styles.buttonImage} source={appleButtonImage} />
              </Pressable>
            )}

            <Pressable onPress={handleGuestSignIn} style={styles.googleButton}>
              <Image style={styles.buttonImage} source={googleButtonImage} />
            </Pressable>

            <Pressable
              onPress={handleGuestSignIn}
              style={{
                marginTop: 15,
                backgroundColor: '#2b2c3a',
                paddingVertical: 12,
                paddingHorizontal: 25,
                borderRadius: 25,
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                Continue as Guest / Demo
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowEmailModal(true)}
              style={{
                marginTop: 10,
                paddingVertical: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#0097ff', fontWeight: '600', fontSize: 14 }}>
                Sign In or Register with Email
              </Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Email / Password Modal */}
      <Modal visible={showEmailModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#1e1f2b',
              borderRadius: 20,
              padding: 25,
              borderWidth: 1,
              borderColor: '#333446',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 15 }}>
              {isRegistering ? 'Create Account' : 'Sign In with Email'}
            </Text>

            {isRegistering && (
              <TextInput
                placeholder="Display Name"
                placeholderTextColor="#777"
                value={displayName}
                onChangeText={setDisplayName}
                style={{
                  backgroundColor: '#2b2c3a',
                  color: '#fff',
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 12,
                }}
              />
            )}

            <TextInput
              placeholder="Email address"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                backgroundColor: '#2b2c3a',
                color: '#fff',
                padding: 12,
                borderRadius: 10,
                marginBottom: 12,
              }}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#777"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{
                backgroundColor: '#2b2c3a',
                color: '#fff',
                padding: 12,
                borderRadius: 10,
                marginBottom: 18,
              }}
            />

            <Pressable
              onPress={handleEmailAuth}
              disabled={loading}
              style={{
                backgroundColor: '#4a40d4',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                  {isRegistering ? 'Sign Up & Get $100,000' : 'Sign In'}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => setIsRegistering(!isRegistering)}
              style={{ alignItems: 'center', paddingVertical: 8 }}
            >
              <Text style={{ color: '#0097ff', fontSize: 14 }}>
                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowEmailModal(false)}
              style={{ alignItems: 'center', marginTop: 10 }}
            >
              <Text style={{ color: '#888', fontSize: 13 }}>Cancel</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default WelcomeScreen;
