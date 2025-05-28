import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';

const MIN_SPLASH_TIME = 2000; // 2 seconds minimum display time

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const SplashScreen = ({ navigation }: Props) => {
  useEffect(() => {
    const startTime = Date.now();
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_SPLASH_TIME - elapsedTime);

      setTimeout(() => {
        if (user) {
          navigation.replace('Dashboard');
        } else {
          navigation.replace('Login');
        }
      }, remainingTime);
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splashscreen.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
});

export default SplashScreen;
