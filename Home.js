import React, { Component } from "react";
import { View, StyleSheet, Button, Text, AsyncStorage, FlatList, RefreshControl, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import database from '@react-native-firebase/database'
import Ionicons from 'react-native-ionicons'
class Home extends Component {
    state = {
        height: 0,
        twitte: '',
        name: '',
        datalist: [],
        refreshing: false
    }

    constructor() {
        super();
        // console.log('Global',global.userName)


    }

    componentDidMount() {
        // Alert.alert('Rohit');
        console.log(global.userName)
        //  this.getToken()
        // this.getdata()
        // let ree = global.userName
        // this.setState({ name:ree});
        //console.log('cdm',this.state.name)
        this.getdata()
        //


    }
    getdata = () => {

        // console.log('hello', this.state.name)
         let datas = [];
        this.setState({ refreshing: true })
        database().ref('/' + global.userName + '').child('Twittes').orderByValue('Time').once('value', snapshot => {
            console.log(snapshot)
            snapshot.forEach((snap) => {
                let obj = {
                    name: global.userName,
                    twitte: snap.child('Twitte').val()
                }
                datas.push(obj)
               
            })
            this.setState({
                datalist:datas.reverse()
            })
            // console.log(datas)
        })
        //this.setState({ datalist: datas })
        console.log(this.state.datalist)
        this.setState({ refreshing: false })

    }


    onsend() {
        let Twitte = this.state.twitte;
        database().ref('/' + global.userName + '').child('Twittes').push().set({Twitte:Twitte,Time:database.ServerValue.TIMESTAMP})
        this.getdata();
    }
    render() {

        return (
            <View style={Styles.container}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.datalist}
                        renderItem={({ item }) =>
                            <>
                            
                                <View style={{ width: '98%', borderWidth: 1, borderColor: '#1da1f2', alignSelf: 'center', borderRadius: 15, marginVertical: 6,backgroundColor:'white',elevation:5} }>
                                    <View style={{  height: 60, borderBottomWidth:0.5,borderColor:'grey' }}>
                                        <View style={{flex:1,flexDirection: 'row',alignItems: 'center', }}>
                                            <View style={{ width: 50, height: 50, backgroundColor: 'red', borderRadius: 25 ,marginHorizontal:5}}></View>
                                            <Text style={{fontWeight:'900',marginHorizontal:5,fontSize: 17}}>Rohit Varsada</Text>
                                            <Text style={{opacity:0.5}}>@rohit</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={{marginHorizontal:10,marginVertical:6}}>{item.twitte}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row',justifyContent: 'space-around'}} >
                                        <Ionicons style={{fontSize:20}}  name="heart-outline" ></Ionicons>
                                        <Ionicons  style={{fontSize:20}} name ='chatbox-outline' color={'red'} />
                                    </View>
                                </View>
                                {/* <View style={{ borderWidth: 1, margin: 5 }}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                    <Text>{item.twitte}</Text>
                                </View> */}
                               
                            </>
                        }
                        refreshControl={<RefreshControl
                            onRefresh={() => this.getdata()}
                            refreshing={this.state.refreshing}
                        ></RefreshControl>}
                    />
                </View>
                <View style={Styles.textInputView}>

                    <View style={{ flexDirection: 'row' }} >
                        <TextInput
                            multiline={true}
                            onChangeText={(value) => this.setState({ twitte: value.trim() })}
                            onContentSizeChange={(event) => {
                                this.setState({ height: event.nativeEvent.contentSize.height })
                            }}
                            style={{ borderWidth: 1, width: '80%', height: Math.max(35, this.state.height) }}
                        ></TextInput>
                        <View style={{ marginLeft: 15, marginTop: 3, justifyContent: 'flex-end' }}>
                            <Button
                                onPress={() => this.onsend()}
                                title='Send'
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        marginHorizontal: 10
    },
    textInputView: {
        justifyContent: 'flex-end',
        marginBottom: 5
    }
})
export default Home;