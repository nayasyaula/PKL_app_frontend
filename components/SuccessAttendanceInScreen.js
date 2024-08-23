import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

export default function SuccessAttendanceInScreen({ navigation }) {
    const [attendanceData, setAttendanceData] = useState({ inTime: 'N/A', outTime: 'N/A', in_status: '' });
    const [currentDate, setCurrentDate] = useState('');

    const fetchAttendance = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get('http://192.168.1.110:8000/api/attendance', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Response:', response.data);

            if (Array.isArray(response.data) && response.data.length > 0) {
                // Filter data for today's date
                const today = moment().startOf('day');
                const todayRecords = response.data.filter(record => 
                    moment(record.in).isSame(today, 'day') || moment(record.out).isSame(today, 'day')
                );

                if (todayRecords.length > 0) {
                    const latestRecord = todayRecords.reduce((latest, record) => {
                        return moment(record.in).isAfter(moment(latest.in)) ? record : latest;
                    }, todayRecords[0]);

                    const inTime = moment(latestRecord.in);
                    const outTime = latestRecord.out ? moment(latestRecord.out) : moment();

                    setAttendanceData({
                        inTime: inTime.format('HH:mm'),
                        outTime: outTime.format('HH:mm'),
                        in_status: latestRecord.in_status,
                    });
                } else {
                    setAttendanceData({
                        inTime: 'N/A',
                        outTime: 'N/A',
                        in_status: '',
                    });
                }
            } else {
                setAttendanceData({
                    inTime: 'N/A',
                    outTime: 'N/A',
                    in_status: '',
                });
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'Failed to fetch attendance data. Please try again.');
        }
    };

    useEffect(() => {
        setCurrentDate(moment().format('ddd, D MMMM YYYY'));
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAttendance();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.dataRetrievalText}>Data Retrieval</Text>
            <Text style={styles.timeText}>{attendanceData.inTime}</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
            <Image source={require('../assets/success-in.png')} style={styles.icon} />
            <Text style={styles.attendanceCompleteText}>Attendance is complete!</Text>
            <Text style={styles.descriptionText}>
                You have completed your attendance, continue tomorrow.
            </Text>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('AttendanceScreen')}>
                <LinearGradient
                    colors={['#00509F', '#001D39']}
                    style={styles.gradient}
                >
                    <Text style={styles.buttonText}>Back</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
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
    dataRetrievalText: {
        fontSize: 18,
        color: '#5F6166',
        marginBottom: 20,
    },
    timeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 14,
        color: '#00509F',
        marginBottom: 20,
    },
    icon: {
        width: 142,
        height: 142,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    attendanceCompleteText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descriptionText: {
        width: '100%',
        fontSize: 14,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        width: '90%',
        borderRadius: 25,
    },
    gradient: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        paddingVertical: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
