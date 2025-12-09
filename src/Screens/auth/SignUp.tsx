import React, { useState }from 'react';
import { Text, StyleSheet, Image, Dimensions, View, TextInput,
          Button, TouchableOpacity, Pressable, Alert
  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../TypeScripts/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '../../TypeScripts/firebaseConfig';
import { createUserWithEmailAndPassword } from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignUp({ navigation }: Props) {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ password2, setPassword2 ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !password2) {
      Alert.alert('Error', 'Please fill in all the blanks');
      return;
    }

    if (password !== password2) {
      Alert.alert('Error', 'Passwords do not match');
      setPassword('');
      setPassword2('');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth(), email, password);
      Alert.alert('Success', 'Account created!, redirecting...');
      navigation.navigate('HomeGeo' as any);
    } catch (error: any) {
      Alert.alert('Sign Up failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('@assets/Precious_Paths_loading_screen.png')}style={styles.image}/>
      <View style={styles.titleHeader}>
        <Image source={require('@assets/Poke_Title.png')} style={styles.pokeTitle}/>
        <Image source={require('@assets/Poke_Logo.png')} style={styles.pokeLogo}/>
      </View>
      <View style={styles.userInput}>
        <TextInput
          style={styles.email} 
          placeholder='  Email Address'
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize='none'
        />
        <TextInput
          style={styles.password} 
          placeholder='   Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.password} 
          placeholder='   Re-type Password'
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
        />
        <TouchableOpacity 
          style={styles.logInButton} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.logInButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonsBox}>
        <Text style={styles.text2}>-- OR --</Text>
        <View style={styles.logInChoices}>
          <Image source={require('@assets/google.png')}  style={styles.icon}/>
          <Image source={require('@assets/Apple.png')} style={styles.icon}/>
          <Image source={require('@assets/fb.png')} style={styles.icon}/>
        </View>
      <Text style={styles.text3}>
        Already have an Account?
        <Text style={styles.signUp} onPress={() => navigation.navigate("LogIn")}>
          {" "}Log In
        </Text>
      </Text>

      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 20,
  },
  image: {
    width: width,
    height: height,
    resizeMode: 'cover',
    position: 'absolute',
  },
  titleHeader: {
    width: width * 2,
    height: width * 0.5,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',

  },
  userInput: {
    width: width * 2,
    height: width * 1.2,
    // backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: {
    height: width * 0.2,
    width: width * 0.8,
    margin: 12,
    borderWidth: 5,
    borderColor: '#00FEBA',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 10,
  },
  password: {
    height: width * 0.2,
    width: width * 0.8,
    margin: 12,
    borderWidth: 5,
    borderColor: '#00FEBA',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 10,
  },
  logInButton: {
    height: width * 0.15,
    width: width * 0.5,
    backgroundColor: '#00FEBA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 20,
  },
  logInButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  pokeTitle: {
    width: width * 0.8,
    height: width * 0.2,
  },
  pokeLogo: {
    width: width * 0.2,
    height: width * 0.2,
    bottom: 10,
  },
  buttonsBox: {
    flex: 1,
    width: width * 2,
    height: width * 1,
    // flexDirection: 'row',
    // backgroundColor: 'yellow', 
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 20,
  },
  text2: {
    fontSize: 15,
    color: '#00FEBA',
  },
  text3: {
    top: 20,
    fontSize: 15,
    color: '#00FEBA',
  },  
  signUp: {
    color: '#FFFF',
    fontWeight: 'bold',
  },

  logInChoices: {
    width: width * 0.5,
    height: width * 0.15,
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  }
});
