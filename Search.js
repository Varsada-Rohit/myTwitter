import React, { Component } from "react";
import { View, Text, FlatList, TouchableNativeFeedback, Alert } from "react-native";
import database from '@react-native-firebase/database'
class Search extends Component {
    state = {
        users: []
    }
    componentDidMount() {
        this.getusers();
        //  console.log(this.state.users)
    }
    onProfile = (item) => {
        // database().ref('/'+global.userName).child('following').push().set(item.key)
       this.props.navigation.navigate('profile',{user :item.key});
    }
    getusers() {
        database().ref().once('value', snapshot => {
            snapshot.forEach(snap => {
                if(global.userName===snap.child('User').val()){

                }
                else
                {
                    let obj = {
                        key: snap.child('User').val(),
                        name: snap.child('Name').val(),
                    }
                    // console.log('obj', obj)
                    this.setState({
                        users: this.state.users.concat(obj)
                    })
                    //console.log('users', this.state.users)
                }
              
            });
        })
    }
    render() {
        console.log('render', this.state.users)
        return (
            <View>
                <FlatList
                    data={this.state.users}
                    renderItem={({ item }) =>
                        <>
                            <View style={{ flex: 1, height: 60, backgroundColor: '#E9E9E9', width: '90%', alignSelf: 'center', borderRadius: 10, marginVertical: 5 }}>
                                <TouchableNativeFeedback onPress={this.onProfile.bind(this,item)}>
                                    <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
                                        <View style={{ backgroundColor: 'red', height: 40, width: 40, borderRadius: 20, alignSelf: 'center', marginLeft: 10 }}>

                                        </View>
                                        <View style={{ alignSelf: 'center', marginLeft: 15 }}>
                                            <Text style={{ fontWeight: '800', fontSize: 18 }}>{item.name}</Text>
                                            <Text style={{ fontSize: 12, color: 'grey' }}>@{item.key}</Text>
                                        </View>


                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </>
                    }
                />
            </View>
        )
    }
}
export default Search;