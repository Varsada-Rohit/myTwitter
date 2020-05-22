import React, { Component } from "react";
import { View, Image, Text, ImageBackground, FlatList, TouchableNativeFeedback, Alert } from "react-native";
import database from '@react-native-firebase/database';
import Ionicons from 'react-native-ionicons'
class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            following: 'follow',
            user: this.props.user,
            name: this.props.name,
            numberOfTwitte: '',
            update :this.props.update,
            twitteList: [],
            source :require('./images/defaultUSer.jpg')
        }
        console.log('First',this.state.name)
        this.buttonText();
        this.getdata();
    }
    getdata = () => {
        database().ref('Users/' + this.state.user ).once('value', snapshot => {
            let url =snapshot.child('ProfilePhoto').val()
            if(url !== 0){
                this.setState({source : { uri : url }})
            }
            // let src = (url === 0) ? require('./images/defaultUSer.jpg') : {uri : url}
            
           
             console.log('check',snapshot);
         })
        let datas = [];
        database().ref('/Twittes').child(this.state.user).once('value', snapshot => {

            //  console.log('ss',count.length)

            // this.setState({ numberOfTwitte: snapshot.length })
            snapshot.forEach((snap) => {

                let obj = {
                    name: this.state.user,
                    twitte: snap.child('Twitte').val(),
                    key: snap.key
                }
                datas.push(obj)

            })
            this.setState({
                twitteList: datas.reverse(),
                numberOfTwitte : datas.length
            })
            console.log('twitteList', this.state.twitteList)
        })
    }

    buttonText = () => {
        database().ref('/Users/' + global.userName + '/following').once('value', snapshot => {
            //  console.log(global.userName);
            snapshot.forEach(snap => {
                if (snap.key === this.state.user) {
                    this.setState({ following: 'unfollow' })
                }
            });
        })

    }
    onfollowbutton() {

        database().ref('/Users/' + global.userName + '/following').child(this.state.user).set(this.state.following === 'follow' ? 1 : null)
        database().ref('/Users/' + this.state.user + '/follower').child(global.userName).set(this.state.following === 'follow' ? 1 : null)
        this.setState({ following: this.state.following ==='follow' ? 'unfollow' : 'follow'})
    }
    render() {
        return (
            <View>
                <View style={{ width: '100%', height: '100%' }}>
                    <View style={{
                        width: '100%', height: '45%', shadowColor: 'yellow', elevation: 30, backgroundColor: 'yellow', shadowOpacity: 1, shadowRadius: 16, shadowOffset: { height: 12, width: 0 }
                    }}>
                        <ImageBackground
                            source={this.state.source}
                            style={{
                                width: '100%', height: '100%', shadowColor: "black"
                            }}
                            blurRadius={5}
                        >

                        </ImageBackground>
                        <View
                            style={{ position: 'absolute', backgroundColor: '#0C160D', height: '100%', width: '100%' }}
                            opacity={0.5}

                            >

                        </View>
                           
                        <View style={{ position: 'absolute', top: '18%', alignSelf: 'center', alignContent: 'center', width: '100%' }}>
                            <View style={{ height: 80, width: 80, borderRadius: 40, alignSelf: 'center' }}>
                                <Image source={this.state.source} style={{ width: 80, height: 80, borderRadius: 40 }} /> 
                            </View>
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
                        {(this.state.user !== global.userName) &&  <View style={{ backgroundColor: 'white', width: '35%', height: '15%', justifyContent: 'center', alignSelf: 'center', top: '-8%', borderRadius: 30, elevation: 10 }}>
                            <TouchableNativeFeedback onPress={() => this.onfollowbutton()} >
                                <Text style={{ alignSelf: 'center', fontSize: 20 }}>{this.state.following}</Text>
                            </TouchableNativeFeedback>
                        </View> }
                       
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
export default ProfileView;