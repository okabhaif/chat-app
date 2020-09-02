import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, TextInput, Button, ImageBackground, YellowBox } from 'react-native';
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
 * @description Imports an image for the background of the chat interface
*/
const image = require('../assets/background.png');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      colour: ''
    };
  }

  render() {
    return (

      <View style={styles.container} >
        <ImageBackground
          accessibilityRole='image'
          source={image}
          style={styles.image}
        >

          <Text
            accessibilityRole={'header', 'text'}
            style={styles.title}
          >
            Chat App
          </Text>
          {/* /**
          *TextInput can be used to set a username for chat screen
          */}
          <View style={styles.containerBottom}>
            <TextInput
              accessible={true}
              accessibilityLabel='enter text here'
              accessibilityHint="Customise your chat username here"
              style={styles.input}
              onChangeText={(username) => this.setState({ username })}
              value={this.state.username}
              placeholder={'Your Name'}
              maxLength={40}
            />
            <Text
              accessibilityRole='text'
              style={styles.choiceHeader}
            >
              Choose Background Colour:
            </Text>
            {/* /**
            *TouchableOpacity buttons are customised in line with project brief 
            *User can select a background colour for their chat screen
            */}
            <View style={styles.buttons}>
              <TouchableOpacity
                accessible={true}
                accessibilityRole='button'
                accessibilityLabel="Select black colour"
                accessibilityHint="Clicking on this button allows users to customise their chat background colour to black"
                style={[{ backgroundColor: '#090C08' }, styles.backgroundColourButtons]}
                onPress={(colour) => this.setState({ colour: '#090C08' })} />
              <TouchableOpacity
                accessible={true}
                accessibilityRole='button'
                accessibilityLabel="Select mauve colour"
                accessibilityHint="Clicking on this button allows users to customise their chat background colour to mauve"
                style={[{ backgroundColor: '#474056' }, styles.backgroundColourButtons]}
                onPress={(colour) => this.setState({ colour: '#474056' })} />
              <TouchableOpacity
                accessible={true}
                accessibilityRole='button'
                accessibilityLabel="Select light-blue colour"
                accessibilityHint="Clicking on this button allows users to customise their chat background colour to light-blue"
                style={[{ backgroundColor: '#8A95A5' }, styles.backgroundColourButtons]}
                onPress={(colour) => this.setState({ colour: '#8A95A5' })} />
              <TouchableOpacity
                accessible={true}
                accessibilityRole='button'
                accessibilityLabel="Select light-green colour"
                accessibilityHint="Clicking on this button allows users to customise their chat background colour to light-green"
                style={[{ backgroundColor: '#B9C6AE' }, styles.backgroundColourButtons]}
                onPress={(colour) => this.setState({ colour: '#B9C6AE' })} />
            </View>

            <TouchableOpacity
              accessible={true}
              accessibilityRole='button'
              accessibilityLabel="Go to chat screen"
              accessibilityHint="Navigate to chat screen"
              color='#757083'
              style={styles.chatButton}
              onPress={() => this.props.navigation.navigate('Chat', { username: this.state.username, colour: this.state.colour })}>

              <Text
                accessibilityRole='text'
                style={styles.chatButtonText}
              >
                Start Chatting
              </Text>

            </TouchableOpacity>
          </View>
        </ImageBackground>

      </ View >

    );
  }
}

/** 
 * @constant {styles}
 * @type {object}
 * @default
 * @description this constant defines the styling for the start screen of the chat interface
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    width: '100%',
    justifyContent: "center"
  },
  containerBottom: {
    backgroundColor: '#fff',
    height: '44%',
    width: '88%',
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  title: {
    alignSelf: 'center',
    fontSize: 45,
    fontWeight: "600",
    color: '#fff',
    marginTop: 50,
    marginBottom: 200
  },
  input: {
    alignSelf: 'center',
    height: 40,
    width: '88%',
    borderColor: 'lightgray',
    borderWidth: 2,
    padding: 10,
    fontSize: 16,
    fontWeight: '600',
    opacity: .5
  },
  chatButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: "center",
    height: 40,
    width: '88%',
    backgroundColor: '#757083',
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    alignSelf: 'center',
  },
  buttons: {
    flexDirection: 'row',
    width: '88%',
    marginLeft: 5,
    justifyContent: 'space-around',
  },
  backgroundColourButtons: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
  },
  choiceHeader: {
    width: '88%',
    color: 'gray',
    marginLeft: 20,
    marginBottom: -20
  }
});