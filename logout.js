import React, { Component } from "react";
import { View, Button, AsyncStorage, ActivityIndicator } from "react-native"
import {AuthContext} from './context'
function logout() {
    const {signOut} = React.useContext(AuthContext);
    const [loading , setloading]= React.useState(false)
    const onlogout = () => {
        setloading(true)
        removeToken().then(()=>{
            setloading(false)
            signOut();
        })
        

    }
    removeToken = async () => {
        try {
            await AsyncStorage.removeItem("User");
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={{ flex:1,justifyContent:'center',alignItems: 'center',}}>
            <Button title='Logout' onPress={onlogout}></Button>
            <ActivityIndicator size='large' animating ={loading}></ActivityIndicator>
        </View>
    )
}
export default logout