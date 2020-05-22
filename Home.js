import React, { Component } from "react";
import { View, StyleSheet, Button, Text, Image, FlatList, RefreshControl, Alert } from "react-native";
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
        console.log('gloabal name', global.userName)
        //  this.getToken()
        // this.getdata()
        // let ree = global.userName
        // this.setState({ name:ree});
        //console.log('cdm',this.state.name)
        this.getdata()
        //


    }
    getdata() {
        this.setState({ refreshing: true })
        let followings = [];
        let datas = [];
        let detail = [];
        database().ref('/Users/' + global.userName + '/following').once('value', snapshot => {
            snapshot.forEach(following => {
                followings.push(following.key);
            })
            followings.push(global.userName)
        }).then(() => {
            followings.forEach((following, index) => {
                database().ref('Users/' + following).once('value', snapshot => {
                    let url =snapshot.child('ProfilePhoto').val();
                    let source = (url === 0)? require('./images/defaultUSer.jpg') : {uri :url}
                    detail.push({name: snapshot.child('Name').val(),profile :source})
                }).then(() => {

                    database().ref('Twittes/' + following).once('value', snapshot => {
                        snapshot.forEach(snap => {
                           // console.log(name[index])
                            let obj = {
                                name: detail[index].name,
                                profile : detail[index].profile,
                                user: following,
                                key: snap.key,
                                time: snap.child('Time').val(),
                                twitte: snap.child('Twitte').val(),
                            }
                            datas.push(obj)
                        })

                    }).then(() => {
                        if (index == followings.length - 1) {
                           // console.log(datas)
                            datas.sort(this.compare_item)
                            this.setState({
                                datalist: datas.reverse()
                            })
                            this.setState({ refreshing: false })
                        }

                    })
                })
            })
        })

    }
    compare_item(a, b) {
        // a should come before b in the sorted order
        if (a.time < b.time) {
            return -1;
            // a should come after b in the sorted order
        } else if (a.time > b.time) {
            return 1;
            // and and b are the same
        } else {
            return 0;
        }
    }
    onsend() {
        let Twitte = this.state.twitte;
        if(Twitte !== ''){
            database().ref('/Twittes').child(global.userName).push().set({ Twitte: Twitte, Time: database.ServerValue.TIMESTAMP })
            this.getdata();
            this.setState({twitte:''})
            this.textInput.clear();
        }
        
    }
    render() {

        return (
            <View style={Styles.container}>
                <View style={{ flex: 1 }}>
                    {(this.state.datalist.length === 0) && (<><View style={{position:'absolute', flex:1,alignItems: 'center',justifyContent: 'center' } }><Text>follow other users to see their twittes</Text></View></>)}
                    <FlatList
                        data={this.state.datalist}
                        renderItem={({ item }) =>
                            <>

                                <View style={{ width: '96%', borderWidth: 1, borderColor: '#1da1f2', alignSelf: 'center', borderRadius: 15, marginVertical: 6, backgroundColor: 'white', elevation: 5 }}>
                                    <View style={{ height: 60, borderBottomWidth: 0.5, borderColor: 'grey' }}>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                            <View style={{ width: 50, height: 50,  borderRadius: 25, marginHorizontal: 5 }}>
                                                <Image source={item.profile} style={{width:50,height:50,borderRadius:25}}/>
                                            </View>
                                            <Text style={{ fontWeight: '900', marginHorizontal: 5, fontSize: 17 }}>{item.name}</Text>
                                            <Text style={{ opacity: 0.5 }}>@{item.user}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={{ marginHorizontal: 10, marginVertical: 6 }}>{item.twitte}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
                                        <Ionicons style={{ fontSize: 20 }} name="heart-outline" color={'red'}></Ionicons>
                                        <Ionicons style={{ fontSize: 20 }} name='chatbox-outline' />
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
                           ref={input =>{this.textInput =input}}
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
    },
    textInputView: {
        justifyContent: 'flex-end',
        marginBottom: 5
    }
})
export default Home;