import React, { Component } from "react";
import { View, Button, Text, ImageBackground, TouchableNativeFeedback, Alert } from "react-native";
import database from '@react-native-firebase/database';
class profile extends Component {
    state = {
        following: false,
        user :''
    }
    componentDidMount(){
        const { user } = this.props.route.params; 
        this.setState({user: user})
    }
    buttonText = () => {
        database().ref('/' + global.userName + '/following').once('value', snapshot => {
          //  console.log(global.userName);
        
            snapshot.forEach(snap => {
                if (snap.val() === this.state.user) {
                    this.setState({ following: true })
                }
            });
        })
        if (this.state.following) {
            return 'Following'
        }
        else {
            return 'Follow'
        }

    }
    onfollowbutton() {
        Alert.alert('yup')
        database().ref('/' + global.userName + '/following').push().set(this.state.user)
        database().ref('/' + this.state.user + '/follower').push().set(global.userName)
        this.setState({ following: true })
    }
    render() {
        return (
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
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }}>{this.state.user}</Text>
                        </View>
                        <View style={{ alignSelf: 'center', flexDirection: 'row', top: 20 }}>
                            <View style={{ width: 100 }}>
                                <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>100</Text>
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
                    <View style={{ backgroundColor: 'white', width: '35%', height: '15%',justifyContent:'center', alignSelf: 'center',top:'-8%',borderRadius:30,elevation:10 }}>
                        <TouchableNativeFeedback onPress ={()=>this.onfollowbutton()} >
                    <Text style={{alignSelf: 'center',fontSize:20}}>{this.buttonText()}</Text>
                        </TouchableNativeFeedback>
                        </View>
                </View>
                {/* <Text>user name {user} </Text>
                <Button disabled={this.state.following} title={this.buttonText(user)} onPress={() => this.onfollowbutton(user)} /> */}
            </View>
        )
    }
}
export default profile;