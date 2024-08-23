import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PasswordTwoScreen = ({ navigation }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [authToken, setAuthToken] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem('authToken');
            setAuthToken(token);
        };
        getToken();
    }, []);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            console.log('Passwords do not match');
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://192.168.1.110:8000/api/users/change-password', {
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            console.log('Password changed successfully', response.data);
            Alert.alert('Success', 'Password changed successfully');
            navigation.navigate('Profile'); // Navigate to the profile screen
        } catch (error) {
            console.error('Password change failed:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'An error occurred while changing the password. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Ionicons name="arrow-back" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.headerText}>Kata Sandi</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.label}>Kata Sandi Baru</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Kata Sandi Baru"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showPassword}
                        />
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={24}
                            color="gray"
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Konfirmasi Kata Sandi"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                        />
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={24}
                            color="gray"
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                        />
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.buttonContainer} onPress={handlePasswordChange}>
                <LinearGradient
                    colors={['#00509F', '#001D39']}
                    style={styles.gradient}
                >
                    <Text style={styles.buttonText}>Ubah & Simpan</Text>
                </LinearGradient>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        marginLeft: 120,
        fontSize: 18,
        fontWeight: 'bold',
    },
    form: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        width: '90%',
        height: 50,
        borderColor: '#00509F',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    buttonContainer: {
        width: '100%',
        borderRadius: 25,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    gradient: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        paddingVertical: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PasswordTwoScreen;
