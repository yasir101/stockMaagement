import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { theme } from '../theme';

const MIN_SPLASH_TIME = 2000; // 2 seconds minimum display time
const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const SplashScreen = ({ navigation }: Props) => {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startTime = Date.now();
    const auth = getAuth();

    // Start animations
    const logoAnimation = Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    const textAnimation = Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]);

    Animated.parallel([logoAnimation, textAnimation]).start();

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
  }, [navigation, logoScale, logoOpacity, titleOpacity, subtitleOpacity, backgroundOpacity]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary[500]} />
      <View style={styles.container}>
        {/* Background gradient effect */}
        <Animated.View
          style={[
            styles.backgroundGradient,
            { opacity: backgroundOpacity },
          ]}
        />

        {/* Floating circles for visual interest */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />

        {/* Main content */}
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              },
            ]}
          >
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>📦</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.textContainer,
              { opacity: titleOpacity },
            ]}
          >
            <Text style={styles.title}>StockMaster</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.subtitleContainer,
              { opacity: subtitleOpacity },
            ]}
          >
            <Text style={styles.subtitle}>Smart Inventory Management</Text>
          </Animated.View>
        </View>

        {/* Loading indicator */}
        <View style={styles.footer}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingDot} />
            <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
            <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${theme.colors.primary[600]}50`,
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${theme.colors.primary[400]}20`,
    top: height * 0.1,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: `${theme.colors.primary[300]}15`,
    bottom: height * 0.2,
    left: -30,
  },
  circle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${theme.colors.primary[200]}10`,
    top: height * 0.3,
    left: width * 0.2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius['2xl'] + 8,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.xl,
  },
  logoIcon: {
    fontSize: 48,
  },
  textContainer: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes['4xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitleContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: theme.typography.weights.medium,
  },
  footer: {
    position: 'absolute',
    bottom: theme.spacing['3xl'],
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text.inverse,
    opacity: 0.7,
  },
  loadingDotDelay1: {
    opacity: 0.5,
  },
  loadingDotDelay2: {
    opacity: 0.3,
  },
});

export default SplashScreen;
