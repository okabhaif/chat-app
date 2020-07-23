import React from 'react';

// import react native gesture handler
import 'react-native-gesture-handler';

//import the Screens for the app to nav between 
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Create the navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    //code to navigate between start screen and chat screen
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




