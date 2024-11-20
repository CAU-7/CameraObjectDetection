// app/components/CameraView.js
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Alert, Linking} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  runOnJS,
} from 'react-native-vision-camera';
import ObjectDetection from './ObjectDetection';

const CameraView = () => {
  const devices = useCameraDevices();
  const device = devices.back;
  const [detections, setDetections] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'authorized');

      if (cameraPermission === 'denied') {
        Alert.alert(
          '카메라 권한',
          '카메라 접근 권한이 필요합니다. 설정에서 권한을 활성화해주세요.',
          [
            {text: '확인'},
            {
              text: '설정 열기',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    })();
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    try {
      // frame 데이터를 직접 처리
      const image = frame.toArrayBuffer();
      const width = frame.width;
      const height = frame.height;

      // ObjectDetection 클래스에 필요한 정보 전달
      const results = ObjectDetection.detectObjects({
        image: image,
        width: width,
        height: height,
        rotation: frame.orientation,
      });

      runOnJS(setDetections)(results);
    } catch (error) {
      runOnJS(console.error)('Frame processing error:', error);
    }
  }, []);

  if (!device || !hasPermission) {
    return null;
  }

  const renderDetections = () => {
    return detections.map((det, idx) => (
      <View
        key={idx}
        style={[
          styles.detectionBox,
          {
            left: det.bbox[0],
            top: det.bbox[1],
            width: det.bbox[2],
            height: det.bbox[3],
          },
        ]}>
        <Text style={styles.detectionText}>
          {`${det.class} (${Math.round(det.score * 100)}%)`}
        </Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={10}
        photo={true}
        video={true}
        audio={false}
      />
      {renderDetections()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  detectionBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'transparent',
  },
  detectionText: {
    color: 'red',
    backgroundColor: 'white',
    padding: 2,
    fontSize: 12,
  },
});

export default CameraView;
