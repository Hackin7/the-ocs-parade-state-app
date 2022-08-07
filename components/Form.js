import * as React from 'react';
import { useState, useEffect } from "react";
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { ProcessingData } from '../helpers/formHandler.js';
import Storage from 'expo-storage';

export default function Form() {
  const [autofillScript, setAutofillScript] = useState("");
  const [url, setURL] = useState("");
  Storage.getItem({ key: `metadata`}).then((value)=>{
    console.log("### Storage Start ##############")
    console.log("metadata", value);
    const metadata = value;
    setURL(JSON.parse(metadata).url);
    Storage.getItem({ key: `staff`}).then((value)=>{
      const staff = value;
      console.log("staff", value);
      const manager = new ProcessingData(JSON.parse(staff), JSON.parse(metadata));
      setAutofillScript(manager.process());
      console.log(autofillScript);      
      console.log("### Storage Retrieved ##############")
    });
  })


  return (
    <WebView 
      style={styles.container}
      source={{uri: url}}  
      javaScriptEnabled={true}
      injectedJavaScript={autofillScript}    
      onMessage={(event) => {}}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
