import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScreen({ navigation }) {
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
        const response = await fetch('http://101.79.9.58:1103/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.ok) {
          const art_id = await response.text(); // 응답 본문에서 ID 값을 가져옴
          console.log('이미지 업로드 성공');
          console.log('서버에서 반환한 ART ID:', art_id); // ID 값을 출력

          // 이미지 업로드 성공 시, 다른 화면으로 이동
          navigation.navigate('WebView', {art_id}); // 'WebViewScreen'은 React Navigation에서 정의한 다른 화면 이름
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
      <Button
        title="Home 화면으로 이동"
        onPress={() => navigation.goBack()}
      />
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
