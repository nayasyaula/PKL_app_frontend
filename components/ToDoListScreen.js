import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { Linking, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Import expo-file-system
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ToDoListScreen = () => {
  const navigation = useNavigation();
  // const route = useRoute();
  // const { refresh } = route.params || {};

  const [isMonthDropdownVisible, setMonthDropdownVisible] = useState(false);
  const [isAllDropdownVisible, setAllDropdownVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Month');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [monthButtonLayout, setMonthButtonLayout] = useState(null);
  const [filterButtonLayout, setFilterButtonLayout] = useState(null);
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const filters = ['All', 'Present'];

  const fetchToDoList = useCallback(async () => {
    console.log('Fetching to-do list...');
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No token found');
      const response = await axios.get('http://192.168.1.110:8000/api/todolist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched todos:', response.data.todos);
      setTodos(response.data.todos || []);
      setFilteredTodos(response.data.todos || []);
    } catch (error) {
      console.error('Error fetching to-do list:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to fetch to-do list. Please try again.');
    }
  }, []);
  

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchToDoList(); // Fetch the latest to-do list
    } catch (error) {
      console.error('Error refreshing to-do list:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const fetchDocument = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No token found');
  
      const response = await axios.get('http://192.168.1.110:8000/api/create-document', {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });
      console.log('Document fetched successfully:', response.data);
  
      const { fileName, fileContent } = response.data.data;
      return { fileName, fileContent };
    } catch (error) {
      console.error('Error fetching document:', error.message);
      return null;
    }
  };

  const downloadFile = async () => {
    const fileData = await fetchDocument();
    if (fileData) {
      const { fileName, fileContent } = fileData;
      const fileUri = FileSystem.documentDirectory + fileName;
      console.log('Saving file to:', fileUri);
  
      try {
        await FileSystem.writeAsStringAsync(fileUri, fileContent, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        // Menampilkan notifikasi
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Download Complete',
            body: `File ${fileName} has been downloaded successfully.`,
            data: { uri: fileUri },
          },
          trigger: null,
        });
  
        Alert.alert(
          'Success',
          'File downloaded successfully. What would you like to do?',
          [
            { text: 'Open', onPress: () => openFile(fileUri) },
            { text: 'Share', onPress: () => shareFile(fileUri) },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      } catch (error) {
        console.log('Error writing file:', error);
        Alert.alert('Error', 'Failed to download file');
      }
    } else {
      console.log('Error: No file data received');
      Alert.alert('Error', 'No file data received');
    }
  };

  const openFile = async (fileUri) => {
    try {
      if (!fileUri) {
        throw new Error('File URI is invalid');
      }
  
      const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // Tipe MIME untuk file Word
  
      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(fileUri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          type: mimeType,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        });
      } else if (Platform.OS === 'ios') {
        Linking.openURL(fileUri);
      } else {
        throw new Error('Unsupported platform');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', `Error opening file: ${error.message}`);
    }
  };

  const shareFile = async (fileUri) => {
    try {
      if (!fileUri) {
        throw new Error('File URI is invalid');
      }
  
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }
  
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // MIME type buat file Word
      });
    } catch (error) {
      console.error('Error sharing file:', error);
      Alert.alert('Error', `Error sharing file: ${error.message}`);
    }
  };
  
  useEffect(() => {
    setCurrentDate(moment().format('ddd, D MMMM YYYY')); // Set the current date when component mounts
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchToDoList(); // Fetch data when the screen gains focus
    }, [])
  );

  
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setMonthDropdownVisible(false);
    if (month === 'Month') {
      setFilteredTodos(todos);
    } else {
      const monthIndex = months.indexOf(month);
      const filtered = todos.filter(todo => moment(todo.date).month() === monthIndex);
      setFilteredTodos(filtered);
    }
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setAllDropdownVisible(false);
    if (filter === 'All') {
      setFilteredTodos(todos);
    } else {
      const filtered = todos.filter(todo => todo.status === 'Present');
      setFilteredTodos(filtered);
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('ddd, DD MMMM YYYY');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => setAllDropdownVisible(!isAllDropdownVisible)}
            onLayout={(event) => setFilterButtonLayout(event.nativeEvent.layout)}
          >
            <Text style={styles.filterText}>{selectedFilter}</Text>
            <Ionicons name="swap-vertical-outline" size={20} color="black" style={styles.icon1} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => setMonthDropdownVisible(!isMonthDropdownVisible)}
            onLayout={(event) => setMonthButtonLayout(event.nativeEvent.layout)}
          >
            <Text style={styles.filterText}>{selectedMonth}</Text>
            <Ionicons name="arrow-down-outline" size={20} color="#666666" style={styles.icon1} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterItem1} onPress={downloadFile}>
            <View style={styles.iconBox}>
              <Ionicons name="download" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line} />

      {isMonthDropdownVisible && monthButtonLayout && (
        <View style={[styles.dropdownContainer, {
          top: monthButtonLayout.y + monthButtonLayout.height + 40,
          left: monthButtonLayout.x,
        }]}>
          {months.map((month, index) => (
            <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleMonthSelect(month)}>
              <Text style={styles.dropdownText}>{month}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {isAllDropdownVisible && filterButtonLayout && (
        <View style={[styles.dropdownContainer, {
          top: filterButtonLayout.y + filterButtonLayout.height + 40,
          left: filterButtonLayout.x,
        }]}>
          {filters.map((filter, index) => (
            <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleFilterSelect(filter)}>
              <Text style={styles.dropdownText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.sections}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >        
      {filteredTodos.length === 0 ? (
          <Text style={styles.noTodos}>No tasks available</Text>
        ) : (
          filteredTodos.map((todo, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.dateSection}
                onPress={() => navigation.navigate('UpdateToDoList', {
                  todo: {
                    id: todo.id,
                    content: todo.content,
                    keterangan: todo.keterangan,
                    pesan: todo.pesan,
                    date: todo.date,
                    status: todo.status,
                  },
                })}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.incomingPresenceText}>{todo.content || 'No task name'}</Text>
                  <Text style={styles.dateText1}>{todo.date ? formatDate(todo.date) : 'No due date'}</Text>
                </View>
                <Ionicons name="book" size={32} color={todo.status === 'Completed' ? "#00509F" : "#292929"} style={styles.incomingIcon} />
              </TouchableOpacity>
              <View style={styles.line1} />
            </React.Fragment>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate('CreateToDoList')}>
        <LinearGradient colors={['#001D39', '#00509F']} style={styles.gradientCircle}>
          <Ionicons name="add" size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={28} color="#666666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('AttendanceScreen')}>
          <Ionicons name="newspaper" size={28} color="#666666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('ScanScreen')}>
          <Ionicons name="qr-code-sharp" size={29} color="#666666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('ToDoList')}>
          <Ionicons name="book" size={28} color="#00509F" />
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
    paddingTop: 50, // Tambahkan padding atas untuk menghindari tampilan terlalu dekat dengan status bar

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -38,
  },
  icon: {
    marginHorizontal: 8,
  },
  dateText: {
    fontSize: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    // marginBottom: 5,
    flex: 1,
    justifyContent: 'space-evenly',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginHorizontal: 4,
    // justifyContent: 'space-evenly',
  },
  filterText: {
    fontSize: 15,
    marginRight: 2,
    color: '#000000',
    fontWeight: 'bold',
  },
  icon1: {
    marginHorizontal: 4,
    marginLeft: 1,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00509F',
  },
  filterItem1: {
    marginHorizontal: 4,
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    zIndex: 1000,
    width: 100,
    marginLeft: 180,
    marginTop: 40,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 14,
  },
  sections: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  noTodos: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888888',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateSection: {
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
  },
  dateText1: {
    color: '#00509F',
    fontSize: 14,
    marginTop: 4,
    fontWeight: 'bold',
  },
  incomingPresenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  incomingPresenceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  incomingIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    marginTop: 10, // Adjust if needed
    marginRight: 10, // Adjust if needed
  },
  line: {
    borderBottomWidth: 8,
    borderBottomColor: '#EDF3FF',
    width: '100%',
    marginBottom: 16,
    marginTop: -9,
  },
  line1: {
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    marginVertical: 8,
    position: 'relative',
    marginTop: -1,
  },
  circleButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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

export default ToDoListScreen;