import React from "react";
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { AuthContext } from './context'
import { StyleSheet, View, Text, ActivityIndicator,TextInput, TouchableWithoutFeedback, Alert,  } from "react-native";
import AsyncStorage from '@react-native-community/async-storage'

function signIn(){
const { signIned } = React.useContext(AuthContext);
const [email, setemail] = React.useState('');
const [password, setpassword] = React.useState('');
const [username, setusername] = React.useState('');
const [name, setname] = React.useState('');
const [texthide, settexthide] = React.useState(true);
const [loading , setloading]= React.useState(false)

const submitButton = () => {

    setloading(true)
    let Email = email;
    let Password = password;
    let Name =name;
    let user =username;
    if (!Email || !Password || !user || !Name) {
        Alert.alert('Please fill all the details')
        setloading(false)
    }
    else {

        auth().createUserWithEmailAndPassword(Email, Password)
            .then((res) => {
                console.log('yup')
                console.log('User account created & signed in!' + "\n" + JSON.stringify(res.user));
                try {
                    AsyncStorage.setItem("User", JSON.stringify(res.user))

                }
                catch (error) {
                    (error) => console.log(error)
                }

                database().ref('/Users/' + user).set({
                   Email : Email ,
                   Name : Name ,
                 User : user ,
                 ProfilePhoto : 0
                 }).then(()=>{
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
                        signIned(res.user);
                    })
                 })
                // this.props.navigation.navigate('Home');
                //global.Token = res.user;
                

            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    Alert.alert('That email address is invalid!');
                }

                 console.error(error);
            });


        // this.props.navigation.navigate('Login')
    }
}



    // console.log(this.props.navigation.navigate('home'));
    return (


        <View style={{ flex: 1 }}>

            <View style={{ flex: 0.1 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 35, marginTop: 10 }}>
                    Create your account</Text>
            </View>
          
            <View style={{ flex: 0.8, margin: 35, justifyContent: 'center' }}>
            <TextInput
                    textContentType='name'
                    autoCapitalize='words'
                    onChangeText={(value) => setname(value.trim())}
                    style={styles.textinput}
                    placeholder='Name'
                />
                <TextInput
                    style={[styles.textinput, { marginTop: 10 }]}
                    placeholder="User name "
                    autoCapitalize='none'
                    textContentType='username'
                    onChangeText={(value) =>setusername(value.trim())}
                ></TextInput>
                <TextInput style={styles.textinput} placeholder='Email'
                    textContentType='emailAddress'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    onChangeText={(value) =>setemail(value.trim())}></TextInput>
                <TextInput
                    secureTextEntry={texthide}
                    textContentType='password'
                    style={[styles.textinput, { marginTop:10, fontSize: 17 }]}
                    placeholder='Password'
                    onChangeText={(value) => setpassword(value.trim())}
                ></TextInput>
               
               
                <ActivityIndicator style={{position:'absolute',alignSelf: 'center',}} animating={loading} size='large'></ActivityIndicator>
            </View>
            <View style={{ flex: 0.1, position: 'relative' }}>
                <View style={{ backgroundColor: 'grey', height: 0.5, marginTop: 4 }}></View>
                <TouchableWithoutFeedback onPress={submitButton} >
                    <View style={{ alignItems: 'center', marginRight: 10, marginTop: 9, }}>
                        <Text style={{ fontWeight: 'bold', backgroundColor: '#1da1f2', height: 30, width: 60, color: 'white', borderRadius: 20, textAlign: 'center', paddingTop: 5, fontSize: 15 }}>Submit</Text>
                    </View>
                </TouchableWithoutFeedback>
               

            </View>
        </View>


    )
}
const styles = StyleSheet.create({
    textinput: {
        borderBottomColor: '#1da1f2',
        borderBottomWidth: 1.2,
        paddingBottom: 5, 
        marginTop:5
    }
})
export default signIn;