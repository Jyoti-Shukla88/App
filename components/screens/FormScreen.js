import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function FormScreen({ navigation }) {
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
      Education: false
    }
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateForm = () => {
    const { firstName, email, phone } = form;
    const emailValid = /\S+@\S+\.\S+/.test(form.email);
    const phoneValid = /^\d{10}$/.test(phone);
    if (!firstName || !email || !phone) {
      Alert.alert('Validation Error', 'First name, valid email and phone are required.');
      return false;
    }
    if (!emailValid) {
    Alert.alert('Validation Error', 'Please enter a valid email address.');
    return false;
  }
    if (!phoneValid) {
    Alert.alert('Validation Error', 'Phone number must be 10 digits.');
    return false;
  } 
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const selectedTopics = Object.keys(form.topics).filter(topic => form.topics[topic]);

    const newEntry = {
      id: Date.now().toString(),
      ...form,
      dob: form.dob.toLocaleDateString(),
      topics: selectedTopics
    };

    const existing = await AsyncStorage.getItem('formEntries');
    const entries = existing ? JSON.parse(existing) : [];
    entries.push(newEntry);
    await AsyncStorage.setItem('formEntries', JSON.stringify(entries));

    Alert.alert('Success', 'Form submitted successfully!');
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
      topics: { Tech: false, Health: false, Education: false }
    });

    navigation.navigate('List');
  };

  const toggleTopic = (topic) => {
    setForm(prev => ({ ...prev, topics: { ...prev.topics, [topic]: !prev.topics[topic] } }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="First Name" value={form.firstName} onChangeText={text => setForm({...form, firstName: text})} />
      <TextInput style={styles.input} placeholder="Last Name" value={form.lastName} onChangeText={text => setForm({...form, lastName: text})} />

      <Text>Date of Birth:</Text>
      <Button title={form.dob.toDateString()} onPress={() => setShowDatePicker(true)} />
      {showDatePicker &&
        <DateTimePicker
          value={form.dob}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setForm(prev => ({ ...prev, dob: date }));
          }}
        />
      }

      <Text>Gender</Text>
      <Picker selectedValue={form.gender} onValueChange={(val) => setForm({ ...form, gender: val })}>
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text>Country</Text>
      <Picker selectedValue={form.country} onValueChange={(val) => setForm({ ...form, country: val })}>
        <Picker.Item label="Select Country" value="" />
        <Picker.Item label="USA" value="USA" />
        <Picker.Item label="India" value="India" />
        <Picker.Item label="UK" value="UK" />
      </Picker>

      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={form.email} onChangeText={(text) => setForm({ ...form, email: text })} />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="numeric" value={form.phone} maxLength={10} onChangeText={(text) => { const onlyNumber = text.replace(/[^0-9]/g, ''); setForm({ ...form, phone: onlyNumber});} }/>
      <TextInput style={[styles.input, { height: 100 }]} multiline placeholder="Feedback" value={form.feedback} onChangeText={(text) => setForm({ ...form, feedback: text })} />

      <Text>Experience Rating</Text>
      <Picker selectedValue={form.rating} onValueChange={(val) => setForm({ ...form, rating: val })}>
        <Picker.Item label="Select Rating" value="" />
        {[1, 2, 3, 4, 5].map(r => <Picker.Item key={r} label={String(r)} value={r} />)}
      </Picker>

      <Text>Interested Topics</Text>
      {Object.keys(form.topics).map(topic => (
        <View key={topic} style={styles.topicRow}>
          <Text>{topic}</Text>
          <Button title={form.topics[topic] ? '✓' : '+'} onPress={() => toggleTopic(topic)} />
        </View>
      ))}
      <TouchableOpacity
  style={styles.button}
  onPress={handleSubmit}
>
  <Text style={styles.buttonText}>Submit</Text>
</TouchableOpacity>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8
  },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  button: {
  backgroundColor: '#3973dc',
  borderRadius: 25,
  paddingVertical: 13,
  marginTop: 16,
  alignItems: 'center',
  shadowColor: '#3973dc',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  elevation: 2
},
buttonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 17,
  
}
});
