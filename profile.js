import React, { Component } from "react";
import { View } from "react-native";
import ProfileView from './ProfileView'
import database from '@react-native-firebase/database'
class profile extends Component {

    constructor(props) {
        super(props);
        const { user } = this.props.route.params;
        const { name } = this.props.route.params;
        this.state = {
            user: user,
            name: name,
            profileSource : ''
        }
        this.getProfileData();
    }
    getProfileData(){
        database().ref('Users/' + this.state.user ).on('value', snapshot => {
           let url =snapshot.child('ProfilePhoto').val()
           let source = (url === 0) ? require('./images/defaultUSer.jpg') : {uri : url}
            this.setState({profileSource : source})
          
            console.log('check',snapshot);
        })
    }
    render(){
        return(
            <View>
                <ProfileView name={this.state.name} user={this.state.user} profile={this.state.profileSource} />
            </View>
        )
    }
 }
export default profile;