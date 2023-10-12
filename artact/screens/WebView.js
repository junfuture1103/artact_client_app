// WebViewScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

function WebViewScreen({ route }) {
  const { art_id } = route.params;

  // 이제 id 변수를 사용하여 서버에서 받은 ID 값을 화면에서 사용할 수 있습니다.

  return (
    <View style={styles.container}>
        <WebView source={{ uri: 'https://artactgallary.netlify.app/' }} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

export default WebViewScreen;
