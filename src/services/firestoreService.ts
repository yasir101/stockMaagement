import firestore, { FirebaseFirestoreTypes }  from '@react-native-firebase/firestore';

export type InventoryItem = {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
  lastUpdated?: FirebaseFirestoreTypes.Timestamp | null;
};

export const addInventoryItem = async (item: InventoryItem) => {
  return await firestore()
    .collection('inventory')
    .add({
      ...item,
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    });
};

export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>) => {
  return await firestore()
    .collection('inventory')
    .doc(id)
    .update({
      ...item,
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    });
};

export const deleteInventoryItem = async (id: string) => {
  return await firestore()
    .collection('inventory')
    .doc(id)
    .delete();
};

export const fetchInventoryItems = () => {
  return firestore()
    .collection('inventory')
    .orderBy('name')
    .get();
};
