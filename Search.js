import React, { Component } from "react";
import { View, Text, FlatList,Image, TouchableNativeFeedback, Alert } from "react-native";
import database from '@react-native-firebase/database'
class Search extends Component {
    constructor() {
        super();
        console.log('glgoglgo', global.userName)
    }
    state = {
        users: []
    }
    componentDidMount() {
        this.getusers();
        //  console.log(this.state.users)
    }
    onProfile = (item) => {
        // database().ref('/'+global.userName).child('following').push().set(item.key)
        this.props.navigation.navigate('Searchprofile', { user: item.key, name: item.name });
    }
    getusers() {
        let followings = []
        let userlist = []
        database().ref('/Users/' + global.userName).child("following").once('value', snapshot => {
            console.log('follow', snapshot)
            snapshot.forEach(snap => {
                followings.push(snap.key)
            })
        })

        database().ref('/Users').once('value', snapshot => {
            snapshot.forEach(snap => {
                if (global.userName === snap.child('User').val()) {

                }
                else {
                    console.log(followings.includes(snap.child('User').val()))
                    let obj = {
                        key: snap.child('User').val(),
                        name: snap.child('Name').val(),
                        status: (followings.includes(snap.child('User').val())) ? 'unfollow' : 'follow'
                    }
                    // console.log('obj', obj)
                    // this.setState({
                    //     users: this.state.users.concat(obj)
                    // })
                    userlist.push(obj)
                    //console.log('users', this.state.users)
                }

            });
            this.setState({ users: userlist })
        })
    }
    onfollowbutton = (item) => {

        database().ref('/Users/' + global.userName + '/following').child(item.key).set(item.status === 'follow' ? 1 : null)
        database().ref('/Users/' + item.key + '/follower').child(global.userName).set(1)
        this.getusers();
    }
    render() {
        return (
            <View>
                <FlatList
                    data={this.state.users}
                    renderItem={({ item }) =>
                        <>
                            <View style={{ flex: 1, height: 60, backgroundColor: '#E9E9E9', width: '90%', alignSelf: 'center', borderRadius: 10, marginVertical: 5 }}>
                                <TouchableNativeFeedback onPress={this.onProfile.bind(this, item)}>
                                    <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
                                        <View style={{ backgroundColor: 'red', height: 40, width: 40, borderRadius: 20, alignSelf: 'center', marginLeft: 10 }}>
                                            <Image source={require('./images/download.jpg')} style={{ width: 40, height: 40, borderRadius:20}} />
                                        </View>
                                        <View style={{ alignSelf: 'center', marginLeft: 15 }}>
                                            <Text style={{ fontWeight: '800', fontSize: 18 }}>{item.name}</Text>
                                            <Text style={{ fontSize: 12, color: 'grey' }}>@{item.key}</Text>
                                        </View >

                                        <View style={{ alignSelf: 'center', backgroundColor: 'pink', width: 80, height: 30, borderRadius: 20, position: 'absolute', right: 10 }}>
                                            <TouchableNativeFeedback onPress={this.onfollowbutton.bind(this, item)}>
                                                <Text style={{ alignSelf: 'center', top: 7 }}>{item.status}</Text>
                                            </TouchableNativeFeedback>
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