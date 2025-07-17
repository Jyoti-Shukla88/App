import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ListScreen({ navigation }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchEntries);
    fetchEntries();
    return unsubscribe;
  }, [navigation]);

  const fetchEntries = async () => {
    try {
      const data = await AsyncStorage.getItem('formEntries');
      const storedEntries = data ? JSON.parse(data) : [];
      setEntries(storedEntries.reverse()); // Show most recent first
    } catch (error) {
      console.log('Error loading form entries:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { entry: item })}
    >
      <Text style={styles.cardTitle}>
        {item.firstName} {item.lastName}
      </Text>
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 60 }}
        />
      )}

      {/* Floating Add Button 
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Form')}
      >
        <Text style={styles.fabText}>Add</Text>
        {/*<Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>*/}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
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
  fab: {
    backgroundColor: '#007AFF',
    position: 'absolute',
    bottom: 25,
    right: 80,
    left: 130,
    height: 60,
    width: 150,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    
  },
  fabText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
}
});
