import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function DashboardScreen() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo-one.png')} 
                style={styles.image} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: '#fff', 
    },
    image: {
        width: 200,
        height: 500, 
        resizeMode: 'contain',
    },
});
