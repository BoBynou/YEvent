import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen.js';
import UserProfileScreen from './screens/UserProfileScreen';
import BookingScreen from './screens/BookingScreen.js';
import ReservedScreen from './screens/ReservedScreen.js';
import MapScreen from './screens/MapScreen.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Acceuil"
          component={MainTabNavigator}
          options={{ headerShown: false }} // Hide header for tabs
        />
        <Stack.Screen name="Infos" component={BookingScreen} />
        <Stack.Screen name="Reservation" component={ReservedScreen} />
        <Stack.Screen name="Carte" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Acceuil"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ size, focused }) => (
            <Text>🏠</Text>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Acceuil' }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Profil"
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({ size, focused }) => (
            <Text >👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: '#f8f8f8',
    borderTopWidth: 0,
    elevation: 5,
    borderRadius: 100,
  },
});
