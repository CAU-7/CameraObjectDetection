// app/screens/HomeScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CameraView from '../components/CameraView';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Object Detection</Text>
      <CameraView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default HomeScreen;
