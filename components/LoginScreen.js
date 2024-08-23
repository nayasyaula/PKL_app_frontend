import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Loading from './Loading';
import Ionicons from 'react-native-vector-icons/Ionicons';

const formSchema = z.object({
    email: z.string().min(1, "Email is required").email("Email must be valid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

function Input({ name, control, placeholder, secureTextEntry, errors }) {
    const { field } = useController({
        control,
        name,
        defaultValue: ""
    });

    const [showPassword, setShowPassword] = useState(secureTextEntry);

    return (
        <View style={styles.inputContainer}>
            <TextInput
                placeholder={placeholder}
                onChangeText={field.onChange}
                value={field.value}
                style={styles.input}
                secureTextEntry={secureTextEntry && showPassword}
            />
            {secureTextEntry && (
                <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="gray"
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                />
            )}
            {errors[name] && <Text style={styles.errorText}>{errors[name]?.message}</Text>}
        </View>
    );
}

export default function LoginScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.1.110:8000/api/login', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                const { token } = response.data;
                await AsyncStorage.setItem('authToken', token);
                navigation.navigate('Home');
            } else {
                Alert.alert('Login Failed', 'Invalid email or password');
            }
        } catch (error) {
            console.error('Error details:', error);
            Alert.alert('Login Failed', 'Internal Server Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading />}
            <View style={styles.container}>
                <Image source={require('../assets/logo2.png')} style={styles.image} />
                <Text style={styles.heading}>Welcome back!</Text>
                <Input
                    name="email"
                    control={control}
                    placeholder="Email"
                    errors={errors}
                    secureTextEntry={false}
                />
                <Input
                    name="password"
                    control={control}
                    placeholder="Password"
                    errors={errors}
                    secureTextEntry={true}
                />
                <Text style={styles.confirmText}>Please enter your credentials</Text>
                <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit(onSubmit)}>
                    <LinearGradient
                        colors={['#00509F', '#001D39']}
                        style={styles.gradient}
                    >
                        <Text style={styles.buttonText}>Log in</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.registerText}>
                    Don't have an account?
                    <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}> Sign up</Text>
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    heading: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 20,
        lineHeight: 21,
        letterSpacing: -0.32,
        color: '#00000099',
    },
    inputContainer: {
        width: '90%',
        position: 'relative',
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderColor: '#00509F',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start',
        marginLeft: 15,
        marginTop: 5,
    },
    confirmText: {
        alignSelf: 'flex-start',
        marginLeft: 25,
        marginBottom: 20,
        color: '#666',
    },
    buttonContainer: {
        width: '90%',
        borderRadius: 25,
        marginTop: 10,
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
    registerText: {
        marginTop: 20,
        color: '#666',
    },
    registerLink: {
        color: '#00509F',
        fontWeight: 'bold',
    },
});
