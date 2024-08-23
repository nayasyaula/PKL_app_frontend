
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './components/DashboardScreen';
import LandingScreen from './components/LandingScreen';
import RegisterScreen from './components/RegisterScreen';
import SuccessAttendanceInScreen from './components/SuccessAttendanceInScreen';
import HomeScreen from './components/HomeScreen';
import ToDoListScreen from './components/ToDoListScreen';
import CreateToDoListScreen from './components/CreateToDoListScreen'
import DetailToDoList from './components/DetailToDoList';
import UpdateToDoList from './components/UpdateToDoList';
import ScanScreen from './components/ScanScreen';
import AttendanceScreen from './components/AttendanceScreen'
import SuccessAttendanceOut from './components/SuccessAttendanceOutScreen';
import ProfileScreen from './components/ProfileScreen';
import AboutAccountScreen from './components/AboutAccountScreen';
import PasswordOneScreen from './components/PasswordOneScreen';
import PasswordTwoScreen from './components/PasswordTwoScreen';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import DetailAttendanceScreen from './components/DetailAttendanceScreen';

const Stack = createStackNavigator();

const App = () => {

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen name="SplashScreen" options={{ headerShown: false }} component={SplashScreen} />
          {/* <Stack.Screen name="Dashboard" component={DashboardScreen} /> */}
          <Stack.Screen name="Landing" options={{ headerShown: false }} component={LandingScreen} />
          <Stack.Screen name="Register" options={{ headerShown: false }} component={RegisterScreen} />
          <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
          <Stack.Screen name="ToDoList" options={{ headerShown: false }} component={ToDoListScreen} />
          <Stack.Screen name="CreateToDoList" options={{ headerShown: false }} component={CreateToDoListScreen} />
          <Stack.Screen name="DetailToDoList" options={{ headerShown: false }} component={DetailToDoList} />
          <Stack.Screen name="UpdateToDoList" options={{ headerShown: false }} component={UpdateToDoList} />
          <Stack.Screen name='ScanScreen' options={{ headerShown: false }} component={ScanScreen} />
          <Stack.Screen name='AttendanceScreen' options={{ headerShown: false }} component={AttendanceScreen} />
          <Stack.Screen name="SuccessAttendanceIn" options={{ headerShown: false }} component={SuccessAttendanceInScreen} />
          <Stack.Screen name="SuccessAttendanceOut" options={{ headerShown: false }} component={SuccessAttendanceOut} />
          <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
          <Stack.Screen name="AboutAcc" options={{ headerShown: false }} component={AboutAccountScreen} />
          <Stack.Screen name="Password1" options={{ headerShown: false }} component={PasswordOneScreen} />
          <Stack.Screen name="Password2" options={{ headerShown: false }} component={PasswordTwoScreen} />
          <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
          <Stack.Screen name="detail" options={{ headerShown: false }} component={DetailAttendanceScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
  );
};

export default App;