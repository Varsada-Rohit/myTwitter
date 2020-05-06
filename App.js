/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
//import { View, Text } from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import React, { Component } from "react";
import { View, Text, Image, AsyncStorage } from "react-native";
import signIn from './signIn';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "./Home";
import homeScreen from "./titlescreen"
import database from '@react-native-firebase/database'
import login from "./Login";
import logout from"./logout";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Search from "./Search";
import profile from "./profile";

function LogoTitle() {
    return (
        <Image source={require('./images/twitter_icon.png')} style={{ height: 20, width: 24 }} />
    )
}
const Tab = new createBottomTabNavigator();
function TabScreens (){
    return(
        <Tab.Navigator>
            <Tab.Screen name='search' component={Search}/>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Logout" component={logout}/>
        </Tab.Navigator>

    )
}

const stack = createStackNavigator();
export default class APP extends Component {

    state = {
        name: '',
        isloading: true
    }

    constructor() {
        super();
        this.getToken()

    }
    async getToken() {
        try {
            let userData = await AsyncStorage.getItem("User");
            data = JSON.parse(userData)
            global.Token = data;
            console.log('Token',global.Token);
        } catch (error) {
            console.log("Something went wrong", error);
        }
        if (global.Token==null) {
            this.setState({ isloading: false })
        }
        else {
            
            database().ref().once('value').then(snapshot => {
                let useremail =global.Token.email;
                //console.log( (useremail))
                 console.log('snapshot',snapshot)
                snapshot.forEach((user) => {
                    let email = user.child('Email').val()
                    // console.log( (email))
                    if (email === useremail) {
                        //console.log('found')
                        this.setState({ name: user.child('User').val() })
                        //  console.log(this.state.name)
                        global.userName = this.state.name;
                        this.setState({ isloading: false });
                        // console.log(user.child('User').val().user)

                    }

                    //  console.log('user data : ', useremail.email)
                    //  console.log(user.child('Email').val())
                })
                // console.log(this.state.name)

            })

        }

    }
    render() {
        if (this.state.isloading) {
            return (
                <View style={{ flex: 1, backgroundColor: '#1da1f2' }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 50, fontWeight: 'bold' }}>Welcome</Text>
                    </View>
                </View>
            )
        }
        return (
            <NavigationContainer>

                {(global.Token===null) ? (<>
                    <stack.Navigator screenOptions={{ headerStyle: { elevation: 0, backgroundColor: 'transparent' }, headerTitle: <LogoTitle />, headerTitleAlign: 'center', headerTitleStyle: { height: 25, alignItems: 'center', justifyContent: 'center' } }}>
                        <stack.Screen name="Welcome" component={homeScreen} />
                        <stack.Screen name="signIn" component={signIn} />
                        <stack.Screen name="Login" component={login} />
                    </stack.Navigator>
                </>)
                    : (<>
                        <stack.Navigator screenOptions={{headerStyle:{ backgroundColor:'#1da1f2'}}}>
                           <stack.Screen name="tabscreens" component={TabScreens}/>
                           <stack.Screen name="profile" component={profile}/>
                        </stack.Navigator>
                    </>)}

            </NavigationContainer>
        )
    }
}
