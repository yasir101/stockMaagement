import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

type CardData = {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 3) / 2;

const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const [cardData, setCardData] = useState<CardData[]>([
    {
      id: 'stock',
      title: 'Total Items',
      value: '—',
      subtitle: 'in inventory',
      color: theme.colors.primary[500],
      icon: '📦',
    },
    {
      id: 'alerts',
      title: 'Low Stock',
      value: '—',
      subtitle: 'items need restock',
      color: theme.colors.warning[500],
      icon: '⚠️',
    },
    {
      id: 'sales',
      title: "Today's Sales",
      value: '—',
      subtitle: 'revenue',
      color: theme.colors.accent[500],
      icon: '💰',
    },
    {
      id: 'revenue',
      title: 'This Month',
      value: '—',
      subtitle: 'total revenue',
      color: theme.colors.secondary[600],
      icon: '📊',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name
    const user = auth().currentUser;
    if (user?.email) {
      const name = user.email.split('@')[0];
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    }

    const unsubscribe = firestore()
      .collection('dashboard')
      .doc('data')
      .onSnapshot(
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCardData(prev => prev.map(card => {
              switch (card.id) {
                case 'stock':
                  return { ...card, value: data?.totalStock ?? 'N/A' };
                case 'alerts':
                  return { ...card, value: data?.lowStockAlert ?? 'N/A' };
                case 'sales':
                  return { ...card, value: data?.todaysSales ? `Rs. ${data.todaysSales}` : 'Rs. 0' };
                case 'revenue':
                  return { ...card, value: data?.monthlyRevenue ? `Rs. ${data.monthlyRevenue}` : 'Rs. 0' };
                default:
                  return card;
              }
            }));
          } else {
            setCardData(prev => prev.map(card => ({ ...card, value: 'N/A' })));
          }
          setIsLoading(false);
        },
        (error) => {
          console.error('Error fetching dashboard data:', error);
          Alert.alert('Error', 'Failed to load dashboard data. Please try again later.');
          setIsLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth().signOut();
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleButtonPress = (action: string) => {
    // TODO: implement navigation for Inventory, Sales, Reports
    console.log(`Pressed ${action} button`);
    Alert.alert('Coming Soon', `${action} feature will be available soon!`);
  };

  const quickActions = [
    { id: 'inventory', title: 'Inventory', icon: '📦', color: theme.colors.primary[500] },
    { id: 'sales', title: 'Sales', icon: '💳', color: theme.colors.accent[500] },
    { id: 'reports', title: 'Reports', icon: '📊', color: theme.colors.secondary[600] },
    { id: 'settings', title: 'Settings', icon: '⚙️', color: theme.colors.neutral[600] },
  ];

  const renderStatCard = (card: CardData) => (
    <View key={card.id} style={[styles.statCard, { backgroundColor: card.color }]}>
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardIcon}>{card.icon}</Text>
      </View>
      <View style={styles.statCardContent}>
        <Text style={styles.statCardValue}>{card.value}</Text>
        <Text style={styles.statCardTitle}>{card.title}</Text>
        {card.subtitle && (
          <Text style={styles.statCardSubtitle}>{card.subtitle}</Text>
        )}
      </View>
    </View>
  );

  const renderQuickAction = (action: typeof quickActions[0]) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionButton}
      onPress={() => handleButtonPress(action.title)}
      activeOpacity={0.8}
    >
      <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
        <Text style={styles.actionIconText}>{action.icon}</Text>
      </View>
      <Text style={styles.actionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.primary} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{userName || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutIcon}>👋</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary[500]} />
            <Text style={styles.loadingText}>Loading dashboard...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Stats Grid */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <View style={styles.statsGrid}>
                {cardData.map(renderStatCard)}
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                {quickActions.map(renderQuickAction)}
              </View>
            </View>

            {/* Recent Activity Placeholder */}
            <View style={styles.activitySection}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityCard}>
                <Text style={styles.activityTitle}>No recent activity</Text>
                <Text style={styles.activitySubtitle}>
                  Start by adding products to your inventory
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.normal,
  },
  userName: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  logoutIcon: {
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCard: {
    width: CARD_WIDTH,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  statCardHeader: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.sm,
  },
  statCardIcon: {
    fontSize: 24,
    opacity: 0.8,
  },
  statCardContent: {
    gap: 2,
  },
  statCardValue: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.inverse,
  },
  statCardTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.inverse,
    opacity: 0.9,
  },
  statCardSubtitle: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.inverse,
    opacity: 0.7,
  },
  actionsSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  actionButton: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    ...theme.shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconText: {
    fontSize: 20,
  },
  actionTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  activitySection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  activityCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  activityTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  activitySubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default DashboardScreen;
