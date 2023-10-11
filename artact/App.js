import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const { uri } = await camera.takePictureAsync();
      setPhoto(uri);
    }
  };

  const uploadPhoto = async () => {
    if (photo) {
      const formData = new FormData();
      formData.append('photo', {
        uri: photo,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      try {
        const response = await fetch('http://172.30.1.100:3000/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.ok) {
          console.log('이미지 업로드 성공');
        } else {
          console.error('이미지 업로드 실패');
        }
      } catch (error) {
        console.error('이미지 업로드 중 오류 발생', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <Text>카메라 권한 요청 중...</Text>
      ) : hasPermission === false ? (
        <Text>카메라 접근 권한이 거부되었습니다.</Text>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            style={{ flex: 1 }}
            type={Camera.Constants.Type.back}
            ref={(ref) => setCamera(ref)}
          />
        </View>
      )}
      <Text>Picture Upload Test application</Text>
      <Button title="사진 찍기" onPress={takePicture} />
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      <Button title="이미지 업로드" onPress={uploadPhoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
  },
});
