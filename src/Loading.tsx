import React, { useEffect } from 'react';
import { Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Loading({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoaded(); // ⬅️ Call the function after 10s
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color="#4B9CD3" />
      <Text style={styles.text}>P E N E L O P E</Text>
      <Text style={styles.bottom}>The Pokemane Company</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 20,
    fontSize: 40,
    fontWeight: '600',
    color: '#575757', // <-- must be string with '#'
  },
  bottom: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#575757',
  },
});
