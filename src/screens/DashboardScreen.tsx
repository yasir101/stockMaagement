import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CardData = {
  title: string;
  value: string | number;
};

const cardData: CardData[] = [
  { title: 'Total Stock Items', value: 128 },
  { title: 'Low Stock Alerts', value: '3 Items' },
  { title: "Today's Sales", value: 'Rs. 12,500' },
];

const DashboardScreen = () => {
  const handleButtonPress = (action: string) => {
    // TODO: Implement navigation or action handling
    console.log(`Pressed ${action} button`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome to Pampers Shop</Text>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1B5E20',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#555',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 5,
    color: '#2E7D32',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default DashboardScreen;
