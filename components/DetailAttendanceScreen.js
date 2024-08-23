// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRoute } from '@react-navigation/native';
// import moment from 'moment';

// const AttendanceDetailScreen = () => {
//   const route = useRoute();
//   const { attendanceData } = route.params || {};

//   const [inTime, setInTime] = useState(attendanceData?.in ? moment(attendanceData.in).format('YYYY-MM-DD HH:mm:ss') : '');
//   const [outTime, setOutTime] = useState(attendanceData?.out ? moment(attendanceData.out).format('YYYY-MM-DD HH:mm:ss') : '');
//   const [inStatus, setInStatus] = useState(attendanceData?.in_status || 'No status available');
//   const [outStatus, setOutStatus] = useState(attendanceData?.out_status || 'No status available');

//   useEffect(() => {
//     if (attendanceData) {
//       setInTime(attendanceData.in ? moment(attendanceData.in).format('YYYY-MM-DD HH:mm:ss') : '');
//       setOutTime(attendanceData.out ? moment(attendanceData.out).format('YYYY-MM-DD HH:mm:ss') : '');
//       setInStatus(attendanceData.in_status || 'No status available');
//       setOutStatus(attendanceData.out_status || 'No status available');
//     }
//   }, [attendanceData]);

//   const formatDateTime = (dateString) => {
//     return moment(dateString).format('ddd, DD MMMM YYYY HH:mm:ss');
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.incoming}>Incoming Presence</Text>
//       </View>
//       <LinearGradient colors={['#00509F', '#001D39']} style={styles.line} />
//       <View style={styles.details}>
//         <Text style={styles.date}>IN : {inTime ? formatDateTime(inTime) : 'No in time available'}</Text>
//         <Text style={styles.status}>IN Status : {inStatus}</Text>
//         <Text style={styles.date}>OUT : {outTime ? formatDateTime(outTime) : 'No out time available'}</Text>
//         <Text style={styles.status}>OUT Status : {outStatus}</Text>
//       </View>
//       <TouchableOpacity
//         style={[styles.statusButton, inStatus === 'Present' && styles.presentButton]}
//       >
//         <Text style={styles.statusButtonText}>{inStatus}</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: 'white',
//     paddingTop: 50,
//   },
//   header: {
//     marginBottom: 16,
//   },
//   incoming: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000000',
//   },
//   line: {
//     height: 2,
//     width: '100%',
//     marginBottom: 16,
//   },
//   details: {
//     marginBottom: 16,
//   },
//   date: {
//     fontSize: 16,
//     color: '#00509F',
//     marginBottom: 8,
//   },
//   status: {
//     fontSize: 16,
//     color: '#007BFF',
//     marginBottom: 8,
//   },
//   statusButton: {
//     padding: 10,
//     borderRadius: 5,
//     backgroundColor: '#D9D9D9',
//     alignItems: 'center',
//   },
//   presentButton: {
//     backgroundColor: '#00509F',
//   },
//   statusButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default AttendanceDetailScreen;

import { View, Text } from 'react-native'
import React from 'react'

const DetailAttendanceScreen = () => {
  return (
    <View>
      <Text>DetailAttendanceScreen</Text>
    </View>
  )
}

export default DetailAttendanceScreen
