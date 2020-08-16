import React, { Component } from 'react';
import { View, YellowBox, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {

    constructor(props) {
    super(props);

   

    if (!firebase.apps.length){
      firebase.initializeApp({
        apiKey: "AIzaSyCWcM4RYqptZQCD_O8i6vLsr7l3w0IZyG0",
        authDomain: "chatapp-e9e03.firebaseapp.com",
        databaseURL: "https://chatapp-e9e03.firebaseio.com",
        projectId: "chatapp-e9e03",
        storageBucket: "chatapp-e9e03.appspot.com",
        messagingSenderId: "508615596908",
        appId: "1:508615596908:web:f04b2aaa3e7de6b5d7b149",
        measurementId: "G-Q80Q7LTXXW"
      });
    }
    this.referenceMessages = firebase.firestore().collection('messages');
    this.state = {
      messages: [],
      uid: 0,
      loggedInText:'Please wait, you are getting logged in',
      user: {
        _id: '',	          
        name: '',	          
        avatar: ''
      },
      isConnected: false,

    };
    
  }

  componentDidMount() {
    //username generated through user's input on start screen
    let username = this.props.route.params.username;
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        console.log('online');
        this.setState({
          isConnected : true,
        })

    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
       user = await firebase.auth().signInAnonymously();
      }
    //update user state with currently active user data
    this.setState({
      uid: user.uid,
      loggedInText: "Welcome to your chat " + username,
    });
    // listen for collection changes for current user 
    this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
  });
} else {
  console.log('offline');
  this.setState({
    isConnected: false,

  })
  this.getMessages();
}
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();

 }

 onCollectionUpdate = (querySnapshot) => {
   const messages = [];
   // go through each document
   querySnapshot.forEach((doc) => {
     // get the QueryDocumentSnapshot's data
     var data = doc.data();
     //pushes message object
     messages.push({
      _id: data._id,
      text: data.text.toString(),
      createdAt: data.createdAt.toDate(),
      user: {
        _id: data.user._id,	          
        name: data.user.name,	          
        avatar: data.user.avatar
      }
    });      
   });
   messages.sort(function(a,b){
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
   this.setState({
     messages,
   });
 };

 //gets logged in user from state
 getUser(){
   return {
     ...this.state.user,
     _id: this.state.uid,
   }
 };

 addMessage(message) {
  this.referenceMessages.add(message);
};

//async functions
//get messages from async storage
async getMessages() {
  let messages = '';
  try {
    messages = await AsyncStorage.getItem('messages') || [];
    this.setState({
      messages: JSON.parse(messages)
    });
  } catch (error) {
    console.log(error.message);
  }
}

//save messages to async storage
async saveMessages() {
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
  } catch (error) {
    console.log(error.message);
  }
}

//delete message from async storage
async deleteMessages() {
  try {
    await AsyncStorage.removeItem('messages');
  } catch (error) {
    console.log(error.message);
  }
}

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    this.addMessage({
      _id: messages[0]._id,
      text:  messages[0].text,
      createdAt:  messages[0].createdAt,
      user: this.getUser(),
    });  
    this.saveMessages();
  }

  //function allows customisation of user's chat bubble background colour
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#555'
          }
        }}
      />
    )
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        />
      );
    }
  }

  render() {
    //takes username entered in start page and uses as a variable 'username' 
    let username = this.props.route.params.username;

    //takes user's colour selection defined on start page and uses it as a variable 'backgroundColour'
    let backgroundColour = this.props.route.params.colour

    //displays username in navigation bar
    this.props.navigation.setOptions({ title: username });
    return (
      //uses the backgroundColour variable to customise the chat screen background colour
      <View style={{ flex: 1, backgroundColor: backgroundColour }}>
      <Text style={styles.loggedInText}>{this.state.loggedInText}</Text>

        <GiftedChat
          accessible={true}
          accessibilityRole={'text', 'button'}
          accessibilityLabel="Chat here"
          accessibilityHint="Use the input field to write your message, and use the send button to send messages in the chat"

          //allows customisation of chat bubble e.g. background in this case 
          renderBubble={this.renderBubble.bind(this)}

          //messages are taken from the state - allows component to render initial system message
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          // user={{
          //   _id: 1,
          // }}
          user={{_id: this.state.uid}}
        />

        {/* prevents the input field from getting covered by the keyboard if the user is on an android phone */}
        {Platform.OS === 'android' ? <KeyboardSpacer topSpacing={-320} /> : null}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  loggedInText: {
    alignSelf: 'center',
    paddingBottom: 1, 
    color: 'white',
    
  
  },
});