import React, { Component } from "react";
import { View, Button, Text, ImageBackground, FlatList, TouchableNativeFeedback, Alert } from "react-native";
import database from '@react-native-firebase/database';
import Ionicons from 'react-native-ionicons'
class profile extends Component {

    constructor(props) {
        super(props);
        const { user } = this.props.route.params;
        const { name } = this.props.route.params;
        this.state = {
            following: 'follow',
            user: user,
            name: name,
            numberOfTwitte:'',
                twitteList : []
        }
        this.buttonText();
        this.getdata();
    }

    getdata = () => {
        let count =database().ref('/' + this.state.user + '').child('Twittes');
        console.log('count',count.numChildren())
        let datas = [];
        database().ref('/' + this.state.user + '').child('Twittes').once('value', snapshot => {
        
          //  console.log('ss',count.length)
            
           // this.setState({ numberOfTwitte: snapshot.length })
            snapshot.forEach((snap) => {
                
                let obj = {
                    name: this.state.user,
                    twitte: snap.child('Twitte').val()
                }
                datas.push(obj)

            })
            this.setState({
                twitteList: datas.reverse()
            })
            console.log('twitteList', this.state.twitteList)
        })
    }

    buttonText = () => {
        database().ref('/' + global.userName + '/following').once('value', snapshot => {
            //  console.log(global.userName);
            snapshot.forEach(snap => {
                if (snap.val() === this.state.user) {
                    this.setState({ following: 'following' })
                }
            });
        })

    }
    onfollowbutton() {
        Alert.alert('yup')
        database().ref('/' + global.userName + '/following').push().set(this.state.user)
        database().ref('/' + this.state.user + '/follower').push().set(global.userName)
        this.setState({ following: 'following' })
    }
    render() {
        return (
            <View>
                <View style={{ width: '100%', height: '100%' }}>
                    <View style={{
                        width: '100%', height: '45%', shadowColor: 'yellow', elevation: 30, backgroundColor: 'yellow', shadowOpacity: 1, shadowRadius: 16, shadowOffset: { height: 12, width: 0 }
                    }}>
                        <ImageBackground
                            source={require('./images/gradient.jpg')}
                            style={{
                                width: '100%', height: '100%', shadowColor: "black"
                            }}
                            blurRadius={25}
                        >

                        </ImageBackground>
                        <View
                            style={{ position: 'absolute', backgroundColor: '#0C160D', height: '100%', width: '100%' }}
                            opacity={0.5}

                            blurRadius={60} >

                        </View>

                        <View style={{ position: 'absolute', top: '18%', alignSelf: 'center', alignContent: 'center', width: '100%' }}>
                            <View style={{ height: 80, width: 80, borderRadius: 40, alignSelf: 'center', backgroundColor: 'black', }}></View>
                            <View style={{ alignSelf: 'center', top: 10 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }}>{this.state.name}</Text>
                            </View>
                            <View style={{ alignSelf: 'center', flexDirection: 'row', top: 20 }}>
                                <View style={{ width: 100 }}>
                                    <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>{this.state.numberOfTwitte}</Text>
                                    <Text style={{ color: 'white', alignSelf: 'center' }}>Twittes</Text>
                                </View>

                                <View style={{ width: 100 }}>
                                    <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>100</Text>
                                    <Text style={{ color: 'white', alignSelf: 'center' }}>Followers</Text>
                                </View>

                                <View style={{ width: 100 }}>
                                    <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>100</Text>
                                    <Text style={{ color: 'white', alignSelf: 'center' }}>Following</Text>
                                </View>



                            </View>
                        </View>
                        <View style={{ backgroundColor: 'white', width: '35%', height: '15%', justifyContent: 'center', alignSelf: 'center', top: '-8%', borderRadius: 30, elevation: 10 }}>
                            <TouchableNativeFeedback onPress={() => this.onfollowbutton()} >
                                <Text style={{ alignSelf: 'center', fontSize: 20 }}>{this.state.following}</Text>
                            </TouchableNativeFeedback>
                        </View>
                    </View>

                </View>
                <View style={{ position: 'absolute', top: '48%', width: '100%', height: '50%', }}>
                    <FlatList
                        data={this.state.twitteList}
                        renderItem={({ item }) =>
                            <>

                                <View style={{ width: '95%', borderWidth: 1, borderColor: '#1da1f2', alignSelf: 'center', borderRadius: 15, marginVertical: 6, backgroundColor: 'white', elevation: 5, paddingHorizontal: 20 }}>

                                    <View>
                                        <Text style={{ marginHorizontal: 10, marginVertical: 6 }}>{item.twitte}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
                                        <Ionicons style={{ fontSize: 20 }} name="heart-outline" ></Ionicons>
                                        <Ionicons style={{ fontSize: 20 }} name='chatbox-outline' color={'red'} />
                                    </View>
                                </View>
                            </>
                        }
                    />
                </View>
            </View>
        )
    }
}
export default profile;