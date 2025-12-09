// import React, { useState } from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Loading from './src/Loading';
// import LogIn from './src/LogIn';

// export default function App() {
//   const [isLoaded, setIsLoaded] = useState(false);

//   return (
//     <SafeAreaProvider>
//       {isLoaded ? (
//         <LogIn />
//       ) : (
//         <Loading onLoaded={() => setIsLoaded(true)} />
//       )}
//     </SafeAreaProvider>
//   );
// }
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './src/TypeScripts/types'

import Loading from './src/Screens/Loading';
import LogIn from './src/Screens/auth/LogIn';
import SignUp from './src/Screens/auth/SignUp';
import HomeGeo from './src/Screens/protected/HomeGeo'

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="HomeGeo" component={HomeGeo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
