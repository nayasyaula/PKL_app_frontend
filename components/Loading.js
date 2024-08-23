import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loading = () => (
    <View style={[styles.container]}>
        <ActivityIndicator size="large" color="#001D39" />
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        opacity: 0.5,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999
    },
});

export default Loading;