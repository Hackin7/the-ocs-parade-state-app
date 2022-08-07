import { useState, useEffect } from "react";
import * as React from 'react';
import Constants from 'expo-constants';
import {   
    Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,ScrollView,
  Button, TextInput,
  TouchableOpacity} from 'react-native';

import storageHelper from '../helpers/storageHelper.js';
import Storage from 'expo-storage';

const fields = [
  {"name":"Wing"},
  {"name":"Your Name"},
  {"name":"Cadets - NSFs"},
  {"name":"Cadets - Regular"},
  {"name":"Cadets - International"},
  {"name":"MC Cadets (if any)"},
  {"name":"Form URL"},
];

let run = false;
export default function Metadata({navigation, route}){
  console.log("<<<<<< Metadata >>>>>>>>>>>>>>>>>>>>");

  let [fieldVars, setFieldVars] = useState([]);
  
  async function changeFieldVars(data){
    console.log("### set ##################");
    console.log(data);
    //setFieldVars(data);
    await Storage.setItem({ key: `metadata`, value: JSON.stringify(data) });
  }
  
  async function loadData(){
    let metadata = storageHelper.getMetadata(await Storage.getItem({ key: `metadata` }));
    console.log(metadata);
    let fieldVarsValues = [];
    fieldVarsValues.push(metadata["wing"]);
    fieldVarsValues.push(metadata["name"]);
    fieldVarsValues.push(metadata["cadetsNSF"]);
    fieldVarsValues.push(metadata["cadetsReg"]);
    fieldVarsValues.push(metadata["cadetsIO"]);
    fieldVarsValues.push(metadata["mcCadets"]);
    fieldVarsValues.push(metadata["url"]);
    setFieldVars(fieldVarsValues);
    console.log(fieldVars);
  }
  
  useEffect(() => { 
    console.log("### fieldvars ##################");
    console.log(fieldVars);
    console.log("### others ##################");
  	loadData();
  }, []);
  
  function saveData(){
    let data = {
      "wing": fieldVars[0], 
      "name": fieldVars[1], 
      "cadetsNSF": fieldVars[2], 
      "cadetsReg": fieldVars[3], 
      "cadetsIO": fieldVars[4], 
      "mcCadets": fieldVars[5], 
      "url": fieldVars[6],
    };
    Storage.setItem({ key: `metadata`, value: JSON.stringify(data) })
    .then(() => {
      console.log("saved");
      navigation.goBack();
    }, (err) => {console.log(err);})
  }

  return (
    <View style={styles.container}>
    {
      fields.map((item, index) => {
        return (<View style={[styles.item, { flexDirection: "row" }]}  >
          <Text>{item.name}: </Text>
          <TextInput 
          style={{ borderBottomColor: 'lightgray',
        borderBottomWidth: 1, minWidth:30}}
          editable
          defaultValue={fieldVars[index]}
          onChangeText={text => {
            let newFieldVars = fieldVars;fieldVars[index] = text;
            console.log("### set ##################");
            console.log(newFieldVars);
            setFieldVars(newFieldVars);
          }}
          />
        </View>);
      })
    }
    <Button onPress={saveData} title="Save" />  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, 
  },
  item: {  
        padding: 10,  
        fontSize: 18,  
        height: 44,  
    },  
});
