import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { getFirestore, doc, deleteDoc } from '@react-native-firebase/firestore';


export default function DetailScreen({ route, navigation }) {
  const { entry: initialEntry, updatedEntry } = route.params;
  const [entry, setEntry] = useState(initialEntry);

  // If an updated entry is returned, update the local state
  useEffect(() => {
    if (updatedEntry) {
      setEntry(updatedEntry);
      Toast.show({
        type: 'success',
        text1: 'Updated',
        text2: 'Entry has been successfully updated.',
        position: 'top',
      });
    }
  }, [updatedEntry]);

  const handleDelete = async () => {
    try {
      const db = getFirestore();
      const docRef = doc(db, 'formEntries', entry.id);
      await deleteDoc(docRef);

      Toast.show({
        type: 'success',
        text1: 'Entry Deleted',
        text2: 'The form entry has been successfully removed.',
        position: 'top',
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: 'Something went wrong. Please try again.',
      });
    }
  };

  const handleEdit = () => {
    navigation.navigate('Form', { entry });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {entry.firstName} {entry.lastName}
      </Text>

      <View style={styles.detailCard}>
        <Detail label="Date of Birth" value={entry.dob} />
        <Detail label="Gender" value={entry.gender} />
        <Detail label="Country" value={entry.country} />
        <Detail label="Email" value={entry.email} />
        <Detail label="Phone" value={entry.phone} />
        <Detail label="Rating" value={`${entry.rating} Star(s)`} />
        <Detail label="Feedback" value={entry.feedback} />
        <Detail label="Topics" value={entry.topics.join(', ')} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
          <Text style={styles.editBtnText}>✏️ Edit Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>🗑 Delete Entry</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Reusable component to display a label and value
const Detail = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// ... your existing styles remain unchanged


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f3f6',
    padding: 20,
    paddingBottom: 50,
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    color: '#26509A',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  detailItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#257de1ff', 
    marginLeft: 10,
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#268ce6ff',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  deleteBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#257ae9ff', 
    marginRight: 10,
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    shadowColor: 'rgba(26, 132, 232, 1)',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  editBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
