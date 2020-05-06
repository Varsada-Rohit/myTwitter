import React, { Component } from "react";
import {View, Button,AsyncStorage} from "react-native"
class logout extends Component {
    onlogout (){
        this.removeToken();
      
        
    }
    async removeToken (){
        try{
            await AsyncStorage.removeItem("User"); 
        }
        catch(error){
            console.log(error)
        }
    }
    render(){
        return(
            <View>
                <Button title='Logout' onPress={()=> this.onlogout()}></Button>
            </View>
        )
    }
}
export default logout