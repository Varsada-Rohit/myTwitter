import React, { Component } from "react";
import { View, StyleSheet, Text, TextInput, Button,ActivityIndicator, Alert, AsyncStorage } from "react-native";
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import {AuthContext} from './context'
function login() {
    const [email, setemail] = React.useState('');
    const [pass, setpass] = React.useState('');
    const { logined } = React.useContext(AuthContext);
    const [loading,setloading]= React.useState(false)
    const onlogin = () => {
        setloading(true)
        let Email = email;
        let Pass = pass;
        if (!Email || !Pass) {
            Alert.alert("Please fill all the detail")
            setloading(false)
        }
        else {
            auth().signInWithEmailAndPassword(Email, Pass).then((res) => {
                // Alert.alert("Success")
                console.log(res.user)
                global.Token = res.user;
                try {
                    AsyncStorage.setItem("User", JSON.stringify(res.user)).then(()=>{
                        global.Token = res.user
                    database().ref('/Users').once('value').then(snapshot => {
                        let useremail = global.Token.email;
                        snapshot.forEach((user) => {
                            let email = user.child('Email').val()
                            if (email === useremail) {
                                global.userName = user.child('User').val()
                            }
                        })
                       
        
                    }).then(()=>{
                        setloading(false)
                        logined(res.user);
                    })
                    })
                   
                }
                catch (error) {
                    (error) => console.log(error)
                }
            }).catch(error => {
                console.error(error)
            });
        }
    }

    return (
        <View style={styles.container}>
            <Text
                style={{ fontWeight: 'bold', fontSize: 20 }}
            >Log in to Twitter.</Text>
            <TextInput style={styles.textinput}
                placeholder='Email'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoCapitalize='none'
                onChangeText={(value) => setemail(value.trim())}
            ></TextInput>
            <TextInput style={styles.textinput}
                placeholder='Password'
                secureTextEntry={true}
                textContentType='password'
                onChangeText={(value) => setpass( value.trim() )}
            ></TextInput>
            <View style={{marginTop:20,width:100,alignSelf: 'center'}}>
            <Button
                title='Login'
                onPress={onlogin}
            ></Button>
            </View>
            <ActivityIndicator animating={loading} size='large'></ActivityIndicator>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15
    },
    textinput:{
        borderBottomWidth:1
    }
})
export default login;