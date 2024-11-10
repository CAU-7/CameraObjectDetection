// app/components/CameraView.js
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import ObjectDetection from './ObjectDetection';

const CameraView = () => {
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status === 'denied') {
        Alert.alert(
          'Camera Permission',
          'Camera access is required to use this feature. Please enable it in the settings.',
          [
            {text: 'OK'},
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    })();
  }, []);

  if (!device) {
    return null;
  }

  const handleFrame = async frame => {
    // frame에서 이미지 데이터를 가져와서 ObjectDetection에 전달합니다
    await ObjectDetection.detectObjects(frame);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        onFrameProcessor={handleFrame}
        frameProcessorFps={1} // 1초에 1번씩 프레임을 처리
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
});

export default CameraView;
