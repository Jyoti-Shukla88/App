import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { getFirestore, doc,getDoc, deleteDoc } from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function DetailScreen({ route, navigation }) {
const { entry } = route.params;
const [item, setItem] = useState(null);

  // If an updated entry is returned, update the local state
  useFocusEffect(
  useCallback(() => {
    const fetchEntry = async () => {
      if (!entry?.id) return;
      try {
        const db = getFirestore();
        const docRef = doc(db, 'formEntries', entry.id);
        const snap = await getDoc(docRef);
        if (snap.exists) {
          setItem({ id: snap.id, ...snap.data() });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to Fetch',
          text2: 'Unable to load entry details.',
        });
      }
    };
    fetchEntry();
  }, [entry?.id])
);
  
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
    navigation.navigate('Form', { entry: item });
  };

  return (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>
      {item?.firstName} {item?.lastName}
    </Text>

    {item ? (
      <View style={styles.detailCard}>
        <Detail label="Date of Birth" value={new Date(item.dob).toLocaleDateString()} />
        <Detail label="Gender" value={item.gender} />
        <Detail label="Country" value={item.country} />
        <Detail label="Email" value={item.email} />
        <Detail label="Phone" value={item.phone} />
        <Detail label="Rating" value={`${item.rating} Star(s)`} />
        <Detail label="Feedback" value={item.feedback} />
        <Detail label="Topics" value={Array.isArray(item.topics) ? item.topics.join(', ') : ''} />
      </View>
    ) : (
      <Text>Loading...</Text>
    )}

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
