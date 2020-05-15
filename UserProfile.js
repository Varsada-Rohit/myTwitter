import React, { Component } from "react";
import { View } from "react-native";
import database from '@react-native-firebase/database'
import ProfileView from './ProfileView'
class UserProfile extends Component {
    constructor (){
        super();
        this.state={
            name :'',
            user :global.userName
        }
        this.getName()
    }
    getName (){
        database().ref('Users/'+global.userName+'/Name').once('value',snapshot=>{
            this.setState({ 
                name : snapshot.val()
            })
        })
    }
    render(){
        return(
            <View>
                <ProfileView name={this.state.name} user={this.state.user}/>
            </View>
        )
    }
}
export default UserProfile