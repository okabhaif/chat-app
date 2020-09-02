import React, { Component } from 'react';
import { View, YellowBox, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';

import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import CustomActions from './CustomActions';

import KeyboardSpacer from 'react-native-keyboard-spacer';

import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

/** 
 * @constant
 * @type {string}
 * @default
 * @description Imports firebase/firestore storage for the chat messages
*/
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
      image: '',
      location: '',

    };
  }

  componentDidMount() {

    /**
    * @constant
    * @type {string}
    * @description username passed down via props from user input on start screen
    * @default
    */
    const username = this.props.route.params.username;

    /**
     * @description
     * NetInfo package tracks if a user is online or not
     * this impacts the UI and functionality of the app
     * user's cant access their text input if they are offline & can't send messages
     * If user's are offline they can still view messages from their AsyncStorage
     * If users are online they are able to access firebase storage & can send messages 
     */
    NetInfo.fetch().then(({isConnected}) => {
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

 /**
  * this function is called to update a user's message collection stored in firebase when there is a change (i.e. new message added)
  * @function onCollectionUpdate
  * @param {string} _id
  * @param {string} text
  * @param {date} createdAt
  * @param {string} image
  * @param {number} location
  * @param {object} user
  */

 onCollectionUpdate = (querySnapshot) => {
   const messages = [];
   // go through each document
   querySnapshot.forEach((doc) => {
     // get the QueryDocumentSnapshot's data
     const data = doc.data();
     //pushes message object
     messages.push({
      _id: data._id,
      text: data.text.toString() || '',
      createdAt: data.createdAt.toDate(),
      image: data.image || '',
      location: data.location || '',
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

/**
* @function getUser
* @returns {user<object>}
* @description this function gets the logged in user from state
*/
 getUser(){
   return {
     ...this.state.user,
     _id: this.state.uid,
   }
 };

/**
* @function addMessage
* @description this function adds messages to the user's firestore collection
*/
 addMessage(message) {
  this.referenceMessages.add(message);
};

//async functions
/**
 * @async
 * @function getMessages
 * @description this function is called when the user is offline, it gets Messages from AsyncStorage
 * @returns {Promise<object>} [messages from AsyncStorage]
 */
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

/**
 * @async
 * @function saveMessages
 * @description this function is called when the user sends a message
 * this allows users to save messages in the AsyncStorage, allowing them to be accessible offline
 * @returns {Promise<string>} [saves stringified messages to AsyncStorage]
 */
async saveMessages(messages) {
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(messages));
  } catch (error) {
    console.log(error.message);
  }
}


/**
 * @async
 * @function deleteMessages
 * @description this function is currently not implemented in the app - but can allow users to delete messages from AsyncStorage
 */
async deleteMessages() {
  try {
    await AsyncStorage.removeItem('messages');
  } catch (error) {
    console.log(error.message);
  }
}


/**
 * @function onSend
 * @description when a user sends a message this function stores sent messages in both the firestore and AsyncStorage
 * @param {string} _id
 * @param {string} text
 * @param {date} createdAt
 * @param {string} image
 * @param {number} location
 * @param {object} user
 */
  onSend(messages = []) {
    const newMessages = GiftedChat.append(this.state.messages, messages);
    this.setState({
      messages: newMessages
    })
    this.addMessage({
      _id: messages[0]._id,
      text:  messages[0].text || '',
      createdAt:  messages[0].createdAt,
      image: messages[0].image || '',
      location: messages[0].location || '',
      user: this.getUser(),
    });  
    console.log(newMessages);
    this.saveMessages(newMessages);
  }

  /**
   * @function renderBubble
   * @returns {Component<Bubble>}
   * @description Gifted chat library used to render and customise chat bubbles
   */
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

  /**
   * @function renderInputToolbar
   * @returns {Component<InputToolbar>}
   * @description Gifted chat library used to only render an input field when users are online
   */
  renderInputToolbar(props) {
    if (this.state.isConnected) {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  /**
   * @function renderCustomActions
   * @returns {Component<CustomActions>}
   * @description As defined in the Custom Actions component allows users to select a variety of options (take photo, select photo from gallery, share location & cancel)
   */
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  /**
   * @function renderCustomView
   * @returns {Component<MapView>}
   * @description This function allows users to share a styled map of their location.
   */
  renderCustomView (props) {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

  render() {
    /** 
     * @constant {username}
     * @type {string} 
     * @description This constant takes the user's text input from the start screen to customise the chat screen's username
     * @default
     */
    const username = this.props.route.params.username;
    /** 
     * @constant {username}
     * @type {string} 
     * @description This constant takes the user's colour selected on the start screen to customise the chat screen's background
     * @default
     */
    const backgroundColour = this.props.route.params.colour

    //displays username in navigation bar
    this.props.navigation.setOptions({ title: username });
    return (
      <View style={{ flex: 1, backgroundColor: backgroundColour }}>
      <Text style={styles.loggedInText}>{this.state.loggedInText}</Text>
        <GiftedChat
          accessible={true}
          accessibilityRole={'text', 'button'}
          accessibilityLabel="Chat here"
          accessibilityHint="Use the input field to write your message, and use the send button to send messages in the chat"
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{_id: this.state.uid}}
        />
        {/* /**
         * @description prevents the input field from getting covered by the keyboard if the user is on an android phone
         */ }
        {Platform.OS === 'android' ? <KeyboardSpacer topSpacing={-320} /> : null}
      </View>
    )
  }
}

/** 
 * @constant
 * @type {object}
 * @default
 * @description this constant defines the styling for the chat screen
*/
const styles = StyleSheet.create({
  loggedInText: {
    alignSelf: 'center',
    paddingBottom: 1, 
    color: 'white',  
  },
});