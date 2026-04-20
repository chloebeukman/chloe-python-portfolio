// App.js
// -------
// Entry point for the Split Fair mobile app.
// Sets up navigation between all screens.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import AddPeopleScreen from './screens/AddPeopleScreen';
import ScanReceiptScreen from './screens/ScanReceiptScreen';
import SplitScreen from './screens/SplitScreen';
import ResultsScreen from './screens/ResultsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1e1e2e' },
          headerTintColor: '#4ecca3',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#1e1e2e' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '💸 Split Fair' }}
        />
        <Stack.Screen
          name="AddPeople"
          component={AddPeopleScreen}
          options={{ title: 'Who\'s Splitting?' }}
        />
        <Stack.Screen
          name="ScanReceipt"
          component={ScanReceiptScreen}
          options={{ title: 'Scan Receipt' }}
        />
        <Stack.Screen
          name="Split"
          component={SplitScreen}
          options={{ title: 'Split the Bill' }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: 'Who Owes What' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
