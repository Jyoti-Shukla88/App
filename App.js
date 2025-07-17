import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FormScreen from './components/screens/FormScreen';
import ListScreen from './components/screens/ListScreen';
import DetailScreen from './components/screens/DetailScreen';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for List + Detail + Edit
function ListStack() {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Form" component={FormScreen} options={{ title: 'Edit Entry' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="ListStack" component={ListStack} options={{ title: 'List' }} />
          <Tab.Screen name="New" component={FormScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
