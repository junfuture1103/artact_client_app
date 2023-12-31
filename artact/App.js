import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StyleSheet } from 'react-native';
import CameraScreen from './screens/Camera';
import ArTactScreen from './screens/Artact';
import WebViewScreen from './screens/WebView';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Main 화면 v1.0.1 artact client</Text>
      <Button
        title="카메라로 이동"
        onPress={() => navigation.navigate('Camera')}
      />
      <Button
        title="ArTact로 이동"
        onPress={() => navigation.navigate('ArTact')}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ArTact">
        <Stack.Screen name="ArTact" component={ArTactScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="WebView" component={WebViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
