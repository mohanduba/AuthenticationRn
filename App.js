import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'expo-dev-client';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Configure Google Sign-In
  GoogleSignin.configure({
    webClientId: '776009034973-fl47s6876em19l6ptc7bh397m5voa178.apps.googleusercontent.com',
  });

  // Function to handle authentication state change
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const {signInResult} = await GoogleSignin.signIn();
    console.log('welcome',signInResult)
  
    // Try the new style of google-sign in result, from v13+ of that module
    idToken = signInResult.data?.idToken;
    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult.idToken;
    }
    if (!idToken) {
      throw new Error('No ID token found');
    }
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.idToken);
  
    // Sign-in the user with the credential
    const user_sign_in=auth().signInWithCredential(googleCredential)
    user_sign_in.then((user)=>{
      console.log(user)
    }).catch((error)=>{
      console.log(error)
    })
  }

  if (initializing) return null;

  if(!user){
    return(
      <View style={styles.container}>
          <GoogleSigninButton onPress={onGoogleButtonPress} style={{width:300,height:60,marginTop:100}}/>
      </View>
    )
  }

  return(
    <View style={styles.container}>
      <Text>Welcome To Google</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
