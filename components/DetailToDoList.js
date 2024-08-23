import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


const DetailToDoList = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Membuat desain poster dan compro</Text>
      </View>
      <Text style={styles.date}>Wed, 17 July 2024</Text>
      <LinearGradient colors={['#00509F', '#001D39']} style={styles.line} />
      <Text style={styles.description}>
        Poster yang efektif adalah poster yang mampu menarik perhatian, menyampaikan pesan dengan jelas, dan mendorong tindakan dari audiens yang ditargetkan. Berikut adalah beberapa elemen kunci yang harus dipertimbangkan saat membuat deskripsi desain poster.
      </Text>
      <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate('UpdateToDoList')}>
        <LinearGradient
          colors={['#001D39', '#00509F']}
          style={styles.gradientCircle}
        >
          <Ionicons name="pencil" size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00509F',
  },
  icon: {
    padding: 4,
  },
  date: {
    fontSize: 16,
    color: '#00509F',
    marginBottom: 16,
  },
  line: {
    height: 2,
    width: '100%',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'black',
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
    overflow: 'hidden'
  },
  gradientCircle: {
    width: '100%', 
    height: '100%', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },  
});

export default DetailToDoList;
