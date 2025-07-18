import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from '@react-native-firebase/firestore';

export default function ListScreen({ navigation }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const collectionRef = collection(db, 'formEntries');
    const q = query(collectionRef, orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(fetched);
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { entry: item })}
    >
      <Text style={styles.cardTitle}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.cardMeta}>📍 Country: {item.country}</Text>
      <Text style={styles.cardMeta}>👤 Gender: {item.gender}</Text>
    </TouchableOpacity>
    
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📋 Submitted Entries</Text>
      {entries.length === 0 ? (
        <Text style={styles.empty}>No entries yet. Tap + to add one.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 14,
    color: '#666',
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  addButton: {
  backgroundColor: '#28b5f1',
  padding: 12,
  borderRadius: 16,
  alignItems: 'center',
  marginTop: 20,
},
addButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
});
