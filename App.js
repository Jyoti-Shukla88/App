import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FormScreen from './components/screens/FormScreen';
import ListScreen from './components/screens/ListScreen';
import DetailScreen from './components/screens/DetailScreen';
import Toast from 'react-native-toast-message';
import { Text } from 'react-native';

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

         <Tab.Navigator
             screenOptions={({ route }) => ({
               headerShown: false,
               tabBarIcon: ({ focused, color, size }) => {
                 let icon;
                 if (route.name === 'ListStack') {
                   icon = focused ? '🗂️' : '📋';
                 } else if (route.name === 'New'){
                   icon = focused ? '➕' : '✏️';
                 }
                 return (
                    <Text style={{ fontSize: size-7, color }}>{icon}</Text>
                 );
              },
              tabBarActiveTintColor: '#28b5f1ff',
              tabBarInactiveTintColor: '#757575',
              tabBarLabelStyle: {
                fontWeight: '600',
                fontSize: 13,
                marginBottom: 4,
              },
             tabBarStyle: {
                backgroundColor: '#fff',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: 64,
                borderTopWidth: 0.5,
                borderTopColor: '#e0e0e0',
                shadowColor: '#000',
                shadowOpacity: 0.11,
                shadowOffset: { width: 0, height: -3 },
                shadowRadius: 10,
                elevation: 12,
              },
            })}
         >
           <Tab.Screen name="ListStack" component={ListStack} options={{ title: 'List' }} />
           <Tab.Screen name="New" component={FormScreen} options={{ title: 'New Entry' }}  />
         </Tab.Navigator>   
      </NavigationContainer>
      <Toast />
    </>
  );
}
