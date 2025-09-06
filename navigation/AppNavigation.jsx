
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Image, LogBox, Text, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function CustomHeader() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ position: 'relative', width: '100%', height: 50, justifyContent: 'center' }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 8,
        height: 50,
      }}>
        <Image source={require('../assets/images/logo.png')} style={{ width: 40, height: 40 }} />
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white', flex: 1, textAlign: 'center' }}>
          Weather App
        </Text>
        <Text style={{ fontSize: 12, color: 'white', marginLeft: 8 }}>
          {time}
        </Text>
      </View>
    </View>
  );
}

export default function AppNavigation() {
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        animation: 'fade',
        headerStyle: { backgroundColor: "#015881cf", height: 50, borderWidth: 0, },
        headerTitleAlign: 'center',
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <CustomHeader />,
        }}
      />
    </Stack.Navigator>
  )
}