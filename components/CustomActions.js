import React from 'react';
import { StyleSheet, Text, YellowBox, TouchableOpacity, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PropTypes from 'prop-types';
import _ from 'lodash';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {

    constructor(props) {
    super(props); 
    }

    //allows user to pick image from their phone's gallery
    pickImage = async () => {
      try {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (status === 'granted') {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.cancelled) {
            const imageUrl = await this.uploadImage(result.uri);
            this.props.onSend({ image: imageUrl });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };        
  
    //allows user to take a photo to send in the chat

    takePhoto = async () => {
      try {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        if(status === 'granted') {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
         }}
        }
      catch (error) {
        console.error(error);
      }
    }
     
    //allows user to send their location in the chat
    getLocation = async () => {
      try{
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
  
      if(status === 'granted'){
        let result = await Location.getCurrentPositionAsync({});
        const longitude = JSON.stringify(result.coords.longitude);
        const latitude = JSON.stringify(result.coords.latitude);
        if(result) {
          this.props.onSend({
            location:{
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            }
          })
        }
      }
    } catch(error){
      console.log(error)
    }
  }
    
      
   // creates a blob for the image to be uploaded to cloud storage
   uploadImage = async(uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    //allows more than one image to be stored in cloud by giving each image a unique name
    let uriParts = uri.split('/')
    let newImageName = uriParts[uriParts.length - 1]

    const ref = firebase.storage().ref().child(`${newImageName}`)
    
    const snapshot = await ref.put(blob);
    

    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
            case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
            case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      },
    );
  };

  render() {
    return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={this.onActionPress}
      accessible={true}
      accessibilityLabel='Extra chat communication features'
      accessibilityRole='menu'
      accessibilityHint='This menu allows users to send photos and geolocation in their chat thread' 
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        
        {Platform.OS === 'android' ? <KeyboardSpacer topSpacing={-320} /> : null}

        </View>
    </TouchableOpacity>    
    )
  }
}

const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 16,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
   });

   CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
   };