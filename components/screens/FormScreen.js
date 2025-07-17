import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

export default function FormScreen({ navigation, route }) {
  const editEntry = route.params?.entry;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: new Date(),
    gender: '',
    country: '',
    email: '',
    phone: '',
    feedback: '',
    rating: '',
    topics: {
      Tech: false,
      Health: false,
      Education: false,
    },
  });

  useEffect(() => {
    if (editEntry) {
      // Convert topics array to object with booleans
      const topicsBoolean = { Tech: false, Health: false, Education: false };
      if (Array.isArray(editEntry.topics)) {
        editEntry.topics.forEach(t => {
          topicsBoolean[t] = true;
        });
      }
      setForm({
        firstName: editEntry.firstName || '',
        lastName: editEntry.lastName || '',
        dob: editEntry.dob ? new Date(editEntry.dob) : new Date(),
        gender: editEntry.gender || '',
        country: editEntry.country || '',
        email: editEntry.email || '',
        phone: editEntry.phone || '',
        feedback: editEntry.feedback || '',
        rating: editEntry.rating || '',
        topics: topicsBoolean,
      });
    }
  }, [editEntry]);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateForm = () => {
    const { firstName, email, phone } = form;
    const emailValid = /\S+@\S+\.\S+/.test(email);
    const phoneValid = /^\d{10}$/.test(phone);

    if (!firstName || !email || !phone) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'First name, email, and phone are required.',
      });
      return false;
    }

    if (!emailValid) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please provide a valid email address.',
      });
      return false;
    }

    if (!phoneValid) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone',
        text2: 'Phone number should be 10 digits.',
      });
      return false;
    }

    return true;
  };

  const toggleTopic = (topic) => {
    setForm((prev) => ({
      ...prev,
      topics: { ...prev.topics, [topic]: !prev.topics[topic] },
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const selectedTopics = Object.keys(form.topics).filter(
      (topic) => form.topics[topic]
    );

    const itemToSave = {
      ...form,
      dob: form.dob.toISOString(),
      topics: selectedTopics,
    };

    try {
      const storageData = await AsyncStorage.getItem('formEntries');
      const entries = storageData ? JSON.parse(storageData) : [];

      if (editEntry) {
        // Update existing entry
        const updatedEntry = { ...itemToSave, id: editEntry.id };
        const updatedEntries = entries.map((entry) =>
          entry.id === editEntry.id ? updatedEntry : entry
        );
        await AsyncStorage.setItem('formEntries', JSON.stringify(updatedEntries));

        Toast.show({
          type: 'success',
          text1: 'Entry Updated',
          text2: 'Your changes have been saved.',
        });

        // Navigate back to DetailScreen with updated entry data
        navigation.navigate('Detail', { entry: updatedEntry });
      } else {
        // Add new entry
        const newEntry = { ...itemToSave, id: Date.now().toString() };
        entries.push(newEntry);
        await AsyncStorage.setItem('formEntries', JSON.stringify(entries));

        Toast.show({
          type: 'success',
          text1: 'Form Submitted',
          text2: 'Your data has been saved.',
        });

        setForm({
          firstName: '',
          lastName: '',
          dob: new Date(),
          gender: '',
          country: '',
          email: '',
          phone: '',
          feedback: '',
          rating: '',
          topics: { Tech: false, Health: false, Education: false },
        });

        navigation.navigate('ListStack');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Save Error',
        text2: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formCard}>
        {/* First Name */}
        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter First Name"
          value={form.firstName}
          onChangeText={(text) => setForm({ ...form, firstName: text })}
        />

        {/* Last Name */}
        <Text style={styles.inputLabel}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Last Name"
          value={form.lastName}
          onChangeText={(text) => setForm({ ...form, lastName: text })}
        />

        {/* Date of Birth */}
        <Text style={styles.inputLabel}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>{form.dob.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={form.dob}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setForm((prev) => ({ ...prev, dob: selectedDate }));
            }}
          />
        )}

        {/* Gender */}
        <Text style={styles.inputLabel}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.gender}
            onValueChange={(val) => setForm({ ...form, gender: val })}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Country */}
        <Text style={styles.inputLabel}>Country</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.country}
            onValueChange={(val) => setForm({ ...form, country: val })}
            style={styles.picker}
          >
            <Picker.Item label="Select Country" value="" />
            <Picker.Item label="USA" value="USA" />
            <Picker.Item label="India" value="India" />
            <Picker.Item label="UK" value="UK" />
          </Picker>
        </View>

        {/* Email */}
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
        />

        {/* Phone Number */}
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="numeric"
          maxLength={10}
          value={form.phone}
          onChangeText={(text) => {
            const onlyNumbers = text.replace(/[^0-9]/g, '');
            setForm({ ...form, phone: onlyNumbers });
          }}
        />

        {/* Feedback */}
        <Text style={styles.inputLabel}>Feedback</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Your feedback here..."
          multiline
          numberOfLines={4}
          value={form.feedback}
          onChangeText={(text) => setForm({ ...form, feedback: text })}
        />

        {/* Experience Rating */}
        <Text style={styles.inputLabel}>Experience Rating</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.rating}
            onValueChange={(val) => setForm({ ...form, rating: val })}
            style={styles.picker}
          >
            <Picker.Item label="Select Rating" value="" />
            {[1, 2, 3, 4, 5].map((num) => (
              <Picker.Item label={`${num} Star`} value={String(num)} key={num} />
            ))}
          </Picker>
        </View>

        {/* Interested Topics */}
        <Text style={styles.inputLabel}>Interested Topics</Text>
        {Object.keys(form.topics).map((topic) => (
          <View style={styles.topicRow} key={topic}>
            <Text style={styles.topicText}>{topic}</Text>
            <TouchableOpacity
              style={[
                styles.checkboxButton,
                form.topics[topic] && styles.checkboxButtonChecked,
              ]}
              onPress={() => toggleTopic(topic)}
            >
              <Text style={styles.checkboxText}>
                {form.topics[topic] ? '✓' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Submit/Update Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {editEntry ? 'Update' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
  },
  topicText: {
    fontSize: 16,
    color: '#333',
  },
  checkboxButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxButtonChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 25,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
