import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailScreen({ route, navigation }) {
  const { entry } = route.params;

  const handleDelete = async () => {
    const data = await AsyncStorage.getItem('formEntries');
    let entries = data ? JSON.parse(data) : [];
    entries = entries.filter(e => e.id !== entry.id);
    await AsyncStorage.setItem('formEntries', JSON.stringify(entries));
    Alert.alert('Deleted', 'Entry has been deleted.');
    navigation.navigate('List');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{entry.firstName} {entry.lastName}</Text>
      <Text>Date of Birth: {entry.dob}</Text>
      <Text>Gender: {entry.gender}</Text>
      <Text>Country: {entry.country}</Text>
      <Text>Email: {entry.email}</Text>
      <Text>Phone: {entry.phone}</Text>
      <Text>Rating: {entry.rating}</Text>
      <Text>Feedback: {entry.feedback}</Text>
      <Text>Topics: {entry.topics.join(', ')}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Delete" color="red" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10
  }
});
