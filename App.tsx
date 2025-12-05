import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Loading from './src/Loading';
import HomeScreen from './src/HomeScreen';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <SafeAreaProvider>
      {isLoaded ? (
        <HomeScreen />
      ) : (
        <Loading onLoaded={() => setIsLoaded(true)} />
      )}
    </SafeAreaProvider>
  );
}
