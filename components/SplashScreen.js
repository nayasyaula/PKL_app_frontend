import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ImageBackground } from 'react-native';
import { StackActions } from '@react-navigation/native';

export default function SplashScreen({ navigation }) {
    const scaleValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animasi pop-up
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();

        // Navigasi ke layar Landing setelah 5 detik
        const timer = setTimeout(() => {
            navigation.dispatch(StackActions.replace('Landing'));
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <ImageBackground
            source={require('../assets/gatu.jpg')} 
            style={styles.background}
        >
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Animated.Image
                        source={require('../assets/logo1.png')}
                        style={[styles.image, { transform: [{ scale: scaleValue }] }]}
                    />
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});