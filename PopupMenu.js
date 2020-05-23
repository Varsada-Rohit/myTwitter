import React, { Component } from 'react'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { View } from 'react-native'
import Ionicon from 'react-native-ionicons'
import AsyncStorage from '@react-native-community/async-storage'
import {AuthContext} from './context'
export default function PopupMenu({navigation}) {
    const {signOut} = React.useContext(AuthContext);
    const onlogout = () => {
      
        removeToken().then(()=>{
            signOut();
        })
        

    }
    const removeToken = async () => {
        try {
            await AsyncStorage.removeItem("User");
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={{ marginRight: 10 }}>
            <Menu>
                <MenuTrigger>
                    <Ionicon name="ellipsis-vertical-outline" style={{ width: 30, height: 30 }}></Ionicon>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption text='Edit Profile' onSelect={() => navigation.push('EditProfile') }/>
                    <MenuOption text='Logout' onSelect={onlogout}/>
                </MenuOptions>
            </Menu>
        </View>
    )
}
