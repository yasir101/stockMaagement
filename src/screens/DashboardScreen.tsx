import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

type CardData = {
  title: string;
  value: string | number;
};

const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const [cardData, setCardData] = useState<CardData[]>([
    { title: 'Total Stock Items', value: 'Loading...' },
    { title: 'Low Stock Alerts', value: 'Loading...' },
    { title: "Today's Sales", value: 'Loading...' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('dashboard')
      .doc('data')
      .onSnapshot(
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCardData([
              { title: 'Total Stock Items', value: data?.totalStock ?? 'N/A' },
              { title: 'Low Stock Alerts', value: `${data?.lowStockAlert ?? 'N/A'} Items` },
              { title: "Today's Sales", value: `Rs. ${data?.todaysSales ?? 'N/A'}` },
            ]);
          } else {
            setCardData([
              { title: 'Total Stock Items', value: 'N/A' },
              { title: 'Low Stock Alerts', value: 'N/A Items' },
              { title: "Today's Sales", value: 'Rs. N/A' },
            ]);
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
    try {
      await auth().signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleButtonPress = (action: string) => {
    // TODO: implement navigation for Inventory, Sales, Reports
    console.log(`Pressed ${action} button`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoading}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {cardData.map((card, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
            </View>
          ))}

          <View style={styles.buttonRow}>
            {['Inventory', 'Sales', 'Reports'].map((action) => (
              <TouchableOpacity
                key={action}
                style={styles.button}
                onPress={() => handleButtonPress(action)}
              >
                <Text style={styles.buttonText}>{action}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E3F2FD' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1B5E20', letterSpacing: 0.5 },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, color: '#555' },
  cardValue: { fontSize: 28, fontWeight: '700', marginTop: 5, color: '#2E7D32' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default DashboardScreen;
