import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

export default function SuccessAttendanceOutScreen({ navigation }) {
    const [attendanceData, setAttendanceData] = useState({ inTime: 'N/A', outTime: 'N/A', status: '' });
    const [currentDate, setCurrentDate] = useState('');
    const [isLate, setIsLate] = useState(false);

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
                const firstRecord = response.data[0];
                const inTime = moment(firstRecord.in);
                const outTime = firstRecord.out ? moment(firstRecord.out) : moment();

                setAttendanceData({
                    inTime: inTime.format('HH:mm'),
                    outTime: outTime.format('HH:mm'),
                    out_status: firstRecord.out_status,
                });

                // Periksa keterlambatan
                const standardInTime = moment('08:00', 'HH:mm'); // 08:00 AM
                const standardOutTime = moment('17:00', 'HH:mm'); // 05:00 PM
                setIsLate(inTime.isAfter(standardInTime) || outTime.isAfter(standardOutTime));
            } else {
                setAttendanceData({
                    inTime: 'N/A',
                    outTime: 'N/A',
                    out_status: '',
                });
                setIsLate(false);
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
            <Text style={styles.timeText}>{attendanceData.outTime}</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
            <Image source={require('../assets/success-out.png')} style={styles.icon} />
            <Text style={styles.attendanceCompleteText}>Attendance is complete!</Text>
            {isLate ? (
                <>
                    <Text style={styles.descriptionText}>
                        You've completed your attendance, but it's just too late...
                    </Text>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeLabelLate}>Get In - Late</Text>
                        <Text style={styles.timeValueLate}>{attendanceData.inTime}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeLabel}>Get Out</Text>
                        <Text style={styles.timeValue}>{attendanceData.outTime}</Text>
                    </View>
                </>
            ) : (
                <Text style={styles.descriptionText}>
                    You have completed your attendance, continue tomorrow.
                </Text>
            )}
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
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 10,
    },
    timeLabelLate: {
        fontSize: 16,
        color: 'red',
    },
    timeValueLate: {
        fontSize: 16,
        color: 'red',
    },
    timeLabel: {
        fontSize: 16,
        color: '#000',
    },
    timeValue: {
        fontSize: 16,
        color: '#000',
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
