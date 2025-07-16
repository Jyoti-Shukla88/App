import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import FormScreen from './components/screens/FormScreen';
import ListScreen from './components/screens/ListScreen';
import DetailScreen from './components/screens/DetailScreen';

const Stack = createNativeStackNavigator();
export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen name ="List" component={ListScreen}/>
        <Stack.Screen name ="Form" component={FormScreen}/>
        <Stack.Screen name ="Detail" component={DetailScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
