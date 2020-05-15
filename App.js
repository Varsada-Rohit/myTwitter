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
import { View, Text, Image } from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import signIn from './signIn';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "./Home";
import homeScreen from "./titlescreen"
import database from '@react-native-firebase/database'
import login from "./Login";
import logout from "./logout";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Search from "./Search";
import profile from "./profile";
import UserProfile from "./UserProfile"
import {AuthContext} from "./context"

function LogoTitle() {
    return (
        <Image source={require('./images/twitter_icon.png')} style={{ height: 20, width: 24 }} />
    )
}
const Tab = new createBottomTabNavigator();
function TabScreens() {
    return (
        <Tab.Navigator>
              <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name='search' component={Search} />
            <Tab.Screen name="Logout" component={logout} />
            <Tab.Screen name="profile" component={UserProfile} />
        </Tab.Navigator>

    )
}

const stack = createStackNavigator();
export default function APP() {
    const [isloading, setisloading] = React.useState(true);
    const [name, setname] = React.useState('');
    const [userToken, setUserToken] = React.useState(null);

    React.useEffect( () => {
       if(isloading===true){
           getToken()
       }
    },[isloading])

    const getToken = async () => {
         try {
            let userData = await AsyncStorage.getItem("User");
            let data = JSON.parse(userData)
            setUserToken(data);
            global.Token = data;
            console.log('Token', global.Token);
        } catch (error) {
            console.log("Something went wrong", error);
        }
        if (global.Token == null) {
            setisloading(false);
        }
        else {

            database().ref('/Users').once('value').then(snapshot => {
                let useremail = global.Token.email;
                //console.log( (useremail))
                console.log('snapshot', snapshot)
                snapshot.forEach((user) => {
                    let email = user.child('Email').val()
                    // console.log( (email))
                    if (email === useremail) {
                        //console.log('found')
                        setname(user.child('User').val())
                        //  console.log(this.state.name)
                        global.userName = user.child('User').val()
                        setisloading(false)                        // console.log(user.child('User').val().user)

                    }

                    //  console.log('user data : ', useremail.email)
                    //  console.log(user.child('Email').val())
                })
                // console.log(this.state.name)

            })

        }

    }
    const authContext = React.useMemo(() => {
        return {
            signIned: (token) => {
                console.log('yup')
              setisloading(false);
                setUserToken(token);
            },
            logined: (token) => {
               setisloading(false);
                setUserToken(token);
            },
            signOut: () => {
               setisloading(false);
                setUserToken(null);
            }
        };
    }, []);
    if (isloading) {
        
        return (
            <View style={{ flex: 1, backgroundColor: '#1da1f2' }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 50, fontWeight: 'bold' }}>Welcome</Text>
                </View>
            </View>
        )
    }
    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
             
                {(!userToken) ? (<>
                    <stack.Navigator  screenOptions={{ headerStyle: { elevation: 0, backgroundColor: 'transparent' }, headerTitle: <LogoTitle />, headerTitleAlign: 'center', headerTitleStyle: { height: 25, alignItems: 'center', justifyContent: 'center' } }}>
                        <stack.Screen name="Welcome" component={homeScreen} />
                        <stack.Screen name="signIn" component={signIn} />
                        <stack.Screen name="Login" component={login} />
                    </stack.Navigator>
                </>)
                    : (<>
                        <stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1da1f2' } }}>
                            <stack.Screen name="Twitter" component={TabScreens} />
                            <stack.Screen name="Searchprofile" component={profile} />
                        </stack.Navigator>
                    </>)}

            </NavigationContainer>
        </AuthContext.Provider>
    )
}