import React from "react";
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { AuthContext } from './context'
import Ionicons from 'react-native-ionicons'
import { StyleSheet, View, Text,Image, ActivityIndicator, TextInput, TouchableWithoutFeedback, Alert, } from "react-native";
import AsyncStorage from '@react-native-community/async-storage'

function signIn() {
    const { signIned } = React.useContext(AuthContext);
    const [email, setemail] = React.useState('');
    const [password, setpassword] = React.useState('');
    const [username, setusername] = React.useState('');
    const [name, setname] = React.useState('');
    const [texthide, settexthide] = React.useState(true);
    const [loading, setloading] = React.useState(false);
    const [error, seterror] = React.useState();
    const [isUsernameValid , setisUsernameValid] = React.useState();
    const [checking , setchecking] = React.useState(false)

    const checkUserName = async () =>{
        console.log('checking')
        setchecking(true)
        setisUsernameValid(true)
        await database().ref('/Users').once('value', snapshot=>{
            snapshot.forEach(snap =>{
                if(snap.key === username){
                    setisUsernameValid(false)
                }
            })
        })
        setchecking(false)
    }

    const submitButton = async () => {

        setloading(true)
        let Email = email;
        let Password = password;
        let Name = name;
        let user = username;
        await checkUserName()
        if (!Email || !Password || !user || !Name) {
            Alert.alert('Please fill all the details')
            setloading(false)
        }else if(!isUsernameValid){
            seterror('user name already exists')
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
                        Email: Email,
                        Name: Name,
                        User: user,
                        ProfilePhoto: 0
                    }).then(() => {
                        global.Token = res.user
                        database().ref('/Users').once('value').then(snapshot => {
                            let useremail = global.Token.email;
                            snapshot.forEach((user) => {
                                let email = user.child('Email').val()
                                if (email === useremail) {
                                    global.userName = user.child('User').val()
                                }
                            })


                        }).then(() => {
                            setloading(false)
                            signIned(res.user);
                        })
                    })
                    // this.props.navigation.navigate('Home');
                    //global.Token = res.user;


                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        seterror('That email address is already in use!');
                    }else if (error.code === 'auth/invalid-email') {
                        seterror('That email address is invalid!');
                    }else if(error.code === 'auth/weak-password'){
                        seterror('Weak password - password must be at least 6 characters')
                    }else if(error.code === 'auth/unknown'){
                        seterror('Check your network connection')
                    }else {
                        console.error(error);
                        console.log(error)
                    }
                    setloading(false)

                   
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
                {(error) ? <Text style={{alignSelf: 'center',color:'red'}}>{error}</Text> : null}
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
                    onEndEditing={checkUserName}
                    textContentType='username'
                    onChangeText={(value) => setusername(value.trim())}
                ></TextInput>
                   <View style={{position: 'relative', alignItems: 'flex-end',top : -30,right:10}}>
                 {(checking) ? <ActivityIndicator animating={true}/> : null}
                { (isUsernameValid != null && !checking) ?  <Ionicons name={(isUsernameValid) ? 'checkmark-circle':'close-circle'} color={(isUsernameValid)? 'green' : 'red'}/> : null}
                </View>

                <TextInput style={styles.textinput} placeholder='Email'
                    textContentType='emailAddress'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    onChangeText={(value) => setemail(value.trim())}></TextInput>
                <TextInput
                    secureTextEntry={texthide}
                    textContentType='password'
                    style={[styles.textinput, { marginTop: 10, fontSize: 17 }]}
                    placeholder='Password'
                    onChangeText={(value) => setpassword(value.trim())}
                ></TextInput>
             

                <ActivityIndicator style={{ position: 'absolute', alignSelf: 'center', }} animating={loading} size='large'></ActivityIndicator>
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
        marginTop: 5
    }
})
export default signIn;