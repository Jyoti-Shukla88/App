import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListScreen({ navigation }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        fetchEntries();
  });
  fetchEntries();
    return unsubscribe;
  }, [navigation]);

  const fetchEntries = async () => {
    try {
      const data = await AsyncStorage.getItem('formEntries');
      const storedEntries = data ? JSON.parse(data) : [];
      setEntries(storedEntries.reverse()); // Show most recent on top
    } catch (error) {
      console.log('Error loading form entries:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('Detail', { entry: item })}
    >
      <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.meta}>Country: {item.country}</Text>
      <Text style={styles.meta}>Gender: {item.gender}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button title="Add New Entry" onPress={() => navigation.navigate('Form')} />
      {entries.length === 0 ? (
        <Text style={styles.empty}>No entries yet.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1
  },
  listItem: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16
  }
});
