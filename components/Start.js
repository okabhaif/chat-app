import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, TextInput, Button, ImageBackground } from 'react-native';

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
        <ImageBackground source={image} style={styles.image}>

          <Text style={styles.title}> Chat App</Text>

          <View style={styles.containerBottom}>
            <TextInput
              style={styles.input}
              onChangeText={(username) => this.setState({ username })}
              value={this.state.username}
              placeholder={'Your Name'}
              maxLength={40}
            />
            <Text style={styles.choiceHeader}>Choose Background Colour:</Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                accessibilityLabel="This button changes the background colour of your chat screen to black"
                style={[{ backgroundColor: '#090C08' }, styles.backgroundColourButtons]}
                onPress={(colour) => this.setState({ colour: '#090C08' })} />
              <TouchableOpacity
                accessibilityLabel="This button changes the background colour of your chat screen to a navy blue colour"
                style={[{ backgroundColor: '#474056' }, styles.backgroundColourButtons]}
                onPress={(colour) => this.setState({ colour: '#474056' })} />
              <TouchableOpacity
                accessibilityLabel="This button changes the background colour of your chat screen to a light blue colour"
                style={[{ backgroundColor: '#8A95A5' }, styles.backgroundColourButtons]}
                onPress={(colour) => this.setState({ colour: '#8A95A5' })} />
              <TouchableOpacity
                accessibilityLabel="This button changes the background colour of your chat screen to a light green colour"
                style={[{ backgroundColor: '#B9C6AE' }, styles.backgroundColourButtons]}
                onPress={(colour) => this.setState({ colour: '#B9C6AE' })} />
            </View>

            <TouchableOpacity
              accessibilityLabel="This button launches your chat page"
              color='#757083'
              style={styles.chatButton}
              onPress={() => this.props.navigation.navigate('Chat', { username: this.state.username, colour: this.state.colour })}>
              <Text style={styles.chatButtonText}>Start Chatting</Text>

            </TouchableOpacity>
          </View>
        </ImageBackground>

      </ View >

    );
  }
}
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