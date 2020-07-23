import React, { Component } from 'react';
import { View, Text } from 'react-native';


export default class Chat extends React.Component {
  render() {

    //gets username from user's inputted text
    let username = this.props.route.params.username; // OR ...
    // let { name } = this.props.route.params;

    let backgroundColour = this.props.route.params.colour

    //displays username on page
    this.props.navigation.setOptions({ title: username });
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColour }}>
        <Text>Hello Chat screen!!</Text>
      </View>
    )
  }
}