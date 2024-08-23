import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const ScanScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scanData, setScanData] = useState(null);

    useEffect(() => {
        const askForCameraPermission = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        askForCameraPermission();
    }, []);

    const handleScanAgain = () => {
        setScanned(false);
    };

    const handleBarCodeScanned = async ({ type, data }) => {
        if (scanned) return;

        setScanned(true);
        setScanData(data);

        console.log('Scanned Data:', data); // Debug scanned data

        const authToken = await AsyncStorage.getItem('authToken');
        console.log('Auth Token:', authToken); // Debug auth token

        try {
            const response = await axios.post(
                'http://192.168.1.110:8000/api/mark-attendance',
                { qrCodeData: data },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            console.log('Response:', response.data); // Debug response data

            if (response.status === 200) {
                const isFirstScan = await AsyncStorage.getItem('isFirstScan');
                console.log('Is First Scan:', isFirstScan); // Debug AsyncStorage value

                if (isFirstScan === null) {
                    await AsyncStorage.setItem('isFirstScan', 'false');
                    Alert.alert('Success', 'Attendance marked successfully', [
                        {
                            text: 'OK',
                            onPress: () => {
                                setScanned(false); // Reset scanned status
                                navigation.navigate('SuccessAttendanceIn');
                            },
                        },
                    ]);
                } else {
                    await AsyncStorage.removeItem('isFirstScan');
                    Alert.alert('Success', 'Attendance marked successfully', [
                        {
                            text: 'OK',
                            onPress: () => {
                                setScanned(false); // Reset scanned status
                                navigation.navigate('SuccessAttendanceOut');
                            },
                        },
                    ]);
                }
            } else {
                Alert.alert('Error', 'Failed to mark attendance');
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            Alert.alert('Error', error.response ? error.response.data.message : 'An error occurred while marking attendance');
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.scannerContainer}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
                {scanned && (
                    <LinearGradient
                        colors={['#001D39', '#00509F']}
                        style={styles.button}
                    >
                        <TouchableOpacity
                            style={styles.buttonContent}
                            onPress={handleScanAgain}
                        >
                            <Text style={styles.buttonText}>Tap to Scan Again</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                )}
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Home')}>
                    <Ionicons name="home" size={28} color="#666666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('AttendanceScreen')}>
                    <Ionicons name="newspaper" size={28} color="#666666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('ScanScreen')}>
                    <Ionicons name="qr-code-sharp" size={29} color="#00509F" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('ToDoList')}>
                    <Ionicons name="book" size={28} color="#666666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Profile')}>
                    <Ionicons name="person" size={28} color="#666666" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingTop: 50,
    },
    scannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    iconContainer: {
        alignItems: 'center',
    },
});

export default ScanScreen;