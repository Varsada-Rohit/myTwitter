import React, { Component } from "react";
import { View,StyleSheet,Text, TextInput, Button, Alert,AsyncStorage } from "react-native";
import auth from '@react-native-firebase/auth'

class login extends Component {
    state={
        email:'',
        pass:''
    }
   

    onlogin (){
        let Email = this.state.email;
        let Pass = this.state.pass;
        if(!Email || !Pass){
            Alert.alert("Please fill all the detail")
        }
        else{
            auth().signInWithEmailAndPassword(Email,Pass).then((res)=>{
               // Alert.alert("Success")
               console.log(res.user)
               global.Token =res.user;
                try{ AsyncStorage.setItem("User",JSON.stringify(res.user))}
                    catch(error){
                        (error)=>console.log(error)
                    }
            }).catch(error => {
                console.error(error)
            });         
    }
}
    render(){
        return(
            <View style={styles.container}>
                <Text
                    style={{fontWeight:'bold',fontSize:20}}
                >Log in to Twitter.</Text>
                <TextInput
                    placeholder='Email'
                  
                    onChangeText={(value)=>this.setState({email:value})}
                ></TextInput>
                <TextInput
                    placeholder='Password'
                  
                    onChangeText={(value)=>this.setState({pass:value})}
                ></TextInput>
                <Button
                    title='Login'
                    onPress={()=>this.onlogin()}
                ></Button>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container :{
        flex:1,
        marginHorizontal:15
    }
})
export default login;