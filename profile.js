import React, { Component } from "react";
import { View } from "react-native";
import ProfileView from './ProfileView'
class profile extends Component {

    constructor(props) {
        super(props);
        const { user } = this.props.route.params;
        const { name } = this.props.route.params;
        this.state = {
            user: user,
            name: name,
        }
    }
    render(){
        return(
            <View>
                <ProfileView name={this.state.name} user={this.state.user} />
            </View>
        )
    }
 }
export default profile;