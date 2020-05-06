import React, { Component } from "react";
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { StyleSheet, View, Text, Image, Button, TextInput, TouchableWithoutFeedback, Alert, ToastAndroid, AsyncStorage } from "react-native";
class signIn extends Component {
    constructor() {
        super();
        this.getToken()

    }
    async getToken() {
        try {
            let userData = await AsyncStorage.getItem("User");
            let data = JSON.parse(userData);
            console.log(data);
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    state = {
        email: '',
        password: '',
        username: '',
        name: '',
        texthide: true
    }
    hidingtext() {
        this.setState({ texthide: !this.state.texthide })
    }
    submitButton() {
        let Email = this.state.email;
        let Password = this.state.password;
        let Name = this.state.name;
        let user = this.state.username
        if (!Email || !Password || !user || !Name) {
            Alert.alert(Name)
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

                    database().ref('/' + user).set({
                       Email : Email ,
                     Password : Password ,
                       Name : Name ,
                     User : user 
                     })
                    // this.props.navigation.navigate('Home');
                    global.Token = res.user;

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

    render() {

        // console.log(this.props.navigation.navigate('home'));
        return (


            <View style={{ flex: 1 }}>

                <View style={{ flex: 0.1 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 35, marginTop: 10 }}>
                        Create your account</Text>
                </View>

                <View style={{ flex: 0.8, margin: 35, justifyContent: 'center' }}>
                    <TextInput style={styles.textinput} placeholder='Email'
                        textContentType='emailAddress'
                        keyboardType='email-address'
                        onChangeText={(value) => this.setState({ email: value.trim() })}></TextInput>
                    <TextInput
                        secureTextEntry={this.state.texthide}
                        textContentType='password'
                        style={[styles.textinput, { marginTop: 40, fontSize: 17 }]}
                        placeholder='Password'
                        onChangeText={(value) => this.setState({ password: value.trim() })}
                    ></TextInput>
                    <TextInput
                        textContentType='name'
                        onChangeText={(value) => this.setState({ name: value.trim() })}
                        style={styles.textinput}
                        placeholder='Name'
                    />
                    <TextInput
                        style={[styles.textinput, { marginTop: 20 }]}
                        placeholder="User name "
                        textContentType='username'
                        onChangeText={(value) => this.setState({ username: value.trim() })}
                    ></TextInput>
                    <View style={{ alignItems: 'flex-end', position: 'relative', top: -25 }}>
                        <Text onPress={() => this.hidingtext()}>hii</Text>
                    </View>
                </View>
                <View style={{ flex: 0.1, position: 'relative' }}>
                    <View style={{ backgroundColor: 'grey', height: 0.5, marginTop: 4 }}></View>
                    <TouchableWithoutFeedback onPress={() => this.submitButton()} >
                        <View style={{ alignItems: 'center', marginRight: 10, marginTop: 9, }}>
                            <Text style={{ fontWeight: 'bold', backgroundColor: '#1da1f2', height: 30, width: 60, color: 'white', borderRadius: 20, textAlign: 'center', paddingTop: 5, fontSize: 15 }}>Submit</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </View>


        )
    }
}
const styles = StyleSheet.create({
    textinput: {
        borderBottomColor: '#1da1f2',
        borderBottomWidth: 1.2,
        paddingBottom: 5
    }
})
export default signIn;