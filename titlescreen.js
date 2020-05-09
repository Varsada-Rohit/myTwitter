import React ,{Comment}from 'react'
import { StyleSheet, View, Text, Image, Button, TouchableNativeFeedback, TouchableWithoutFeedback, Alert, AsyncStorage } from "react-native";

function homeScreen({ navigation }) {
   

    return (
        <View style={styles.container}>

            <View style={styles.tt}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>See what' s happening in the world right now.</Text>
                <TouchableNativeFeedback onPress={() => navigation.navigate('signIn')} style={{borderRadius:30}}>
                    <View style={{ backgroundColor: '#1da1f2', alignItems: 'center', height: 43, borderRadius: 30, justifyContent: 'center', marginTop: 30 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Create account</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            <View style={styles.endtt}>
                <Text style={{ color: 'grey' }}>Have an account already?</Text>
                <TouchableWithoutFeedback  onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: '#1da1f2' }}> Log in</Text>
                </TouchableWithoutFeedback>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 10,

        justifyContent: 'center',

    },
    icon: {
        width: 25,
        height: 25,
    },
    tt: {
        flex: 9.2,
        justifyContent: 'center',
        padding: 40,

    },
    endtt: {
        flex: 0.8,
        alignItems: 'flex-start',
        marginLeft: 35,
        flexDirection: 'row'
    }

})
export default homeScreen;