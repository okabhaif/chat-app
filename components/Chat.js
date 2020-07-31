import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import KeyboardSpacer from 'react-native-keyboard-spacer'


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
      user: {
        _id: '',	          
        name: '',	          
        avatar: ''
      }

    };
    
  }

  componentDidMount() {
    //username generated through user's input on start screen
    let username = this.props.route.params.username;
    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
       user = await firebase.auth().signInAnonymously();
      }
    //update user state with currently active user data
    this.setState({
      uid: user.uid,
      loggedInText: "Welcome to your chat",
    });
    // create a reference to the active user's documents (shopping lists)
    // this.referenceMessageUser = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);
    // listen for collection changes for current user 
    this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
  });

    this.setState({

      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        //creates a system message saying '{username}' has entered the chat
        {
          _id: 2,
          text: username + ' has entered the chat',
          createdAt: new Date(),
          system: true,
        },
      ],
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

 addMessage(message) {
  this.referenceMessages.add(message);
}
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    this.addMessage({
      _id: messages[0]._id,
      text:  messages[0].text,
      createdAt:  messages[0].createdAt,
      uid:  this.state.uid,
      user: this.state.user
    });  
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
        {Platform.OS === 'android' ? <KeyboardSpacer topSpacing={-280} /> : null}

      </View>
    )
  }
}
