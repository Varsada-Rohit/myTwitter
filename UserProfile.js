import React, { Component } from "react";
import { View } from "react-native";
import database from '@react-native-firebase/database'
import PopupMenu from './PopupMenu'
import ProfileView from './ProfileView'
function UserProfile({ navigation}) {
    const [name, setname] = React.useState();
    const [user, setuser] = React.useState(global.userName);
    const [update, setupdate] = React.useState(false)
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <PopupMenu navigation = {navigation}/>
            ),
            headerTitle :user
        })
    })
    const isfocused =navigation.isFocused();
    React.useEffect(() => {
     const unsub = navigation.addListener('focus',()=>{
        getName()
        setupdate(!update)
         console.log('focus',update)
     })
     return unsub
  
        // getName()
        // console.log(isfocused)
    }, [update])
    const getName = () => {
        database().ref('Users/' + global.userName ).once('value', snapshot => {
             setname(snapshot.child('Name').val())
            // console.log('check',snapshot);
        })
      

    }

    return (
    
        <View>
            {name &&
                <ProfileView name={name} user={user} update={update} />}
        </View>
    )

}
export default UserProfile