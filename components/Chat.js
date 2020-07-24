import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import KeyboardSpacer from 'react-native-keyboard-spacer'


export default class Chat extends React.Component {

  state = {
    messages: []
  };

  componentDidMount() {
    //username generated through user's input on start screen
    let username = this.props.route.params.username;

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
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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
          user={{
            _id: 1,
          }}
        />

        {/* prevents the input field from getting covered by the keyboard if the user is on an android phone */}
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}

      </View>
    )
  }
}
