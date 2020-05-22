import React, { Component } from 'react'
import { View, Image, ActivityIndicator, PermissionsAndroid } from "react-native"
import Ionicons from 'react-native-ionicons'
import ImagePicker from 'react-native-image-picker'
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'
class EditProfile extends Component {
    constructor(){
        super()
        this.getdata();
    }
   
    // static navigationOptions = ({ navigation }) => {
    //     return {
         
    //       headerRight: (
    //         <Button
    //           onPress={navigation.getParam('increaseCount')}
    //           title="+1"
    //           color="#fff"
    //         />
    //       ),
    //     };
    //   };
    state = {
        source: require('./images/defaultUSer.jpg'),
        uploadProgress: 0,
        uploading : false
    }
    getdata(){
        database().ref('Users/' + global.userName ).once('value', snapshot => {
            let url =snapshot.child('ProfilePhoto').val()
            if(url){
                this.setState({source :{uri :url}})
            }
            
        })
    }
    async upload(image) {
        this.setState({uploading:true})
        let extension = image.split('.').pop();
        //console.log(extension)
        let ref = storage().ref('/ProfilePhotos/'+ global.userName+'.'+extension)
            let task =ref.putFile(image)
        task.on('state_changed', snapshot => {
            this.setState({ uploadProgress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 })
        })
        try {
            await task;
            
            let url = await ref.getDownloadURL();
            database().ref('/Users/' + global.userName).update({ ProfilePhoto: url })
            this.setState({ source: { uri: url } })
            console.log(url)
            this.setState({uploading:false})
        }
        catch (error) {
            console.log('Error', error)
            this.setState({uploading:false})
        }

    }
    pickImage() {
        ImagePicker.showImagePicker((response) => {
            if (response.didCancel) {

            }
            else if (response.error) {

            } else {
                this.upload(response.path)
            }
            // console.log(response);
            // this.setState({source : {uri : response.uri}})


        })
    }
    async CheckPermissons() {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                title: 'Camera Permisson', message: 'App requires Camera Access', buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            })
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('granted')
                this.pickImage()

            }
        } catch (error) {
            console.log(error)
        }


    }
    onchangeimage() {
        this.CheckPermissons()
    }
    render() {
        return (
            <View>
                <View style={{ height: 80, width: 80, borderRadius: 40, margin: 20, elevation: 5 }}>

                    <Image source={this.state.source} style={{ width: 80, height: 80, borderRadius: 40 }} />

                    <View style={{ top: -20, alignSelf: 'flex-end', right: 5, }}>
                        <Ionicons style={{ fontSize: 20 }} name='add-circle' color='black' onPress={() => this.onchangeimage()} />
                    </View>
                    <View style={{ position: 'absolute', alignSelf: 'center', marginVertical: 30 }}>
                        <ActivityIndicator animating={this.state.uploading} />
                    </View>
                </View>
            </View>
        )
    }
}
export default EditProfile