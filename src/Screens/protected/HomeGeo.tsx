import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Dimensions, 
    TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '@/src/TypeScripts/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '@/src/TypeScripts/firebaseConfig';
import { signOut } from '@react-native-firebase/auth';



const { width, height } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'HomeGeo'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Location = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}


export default function HomeGeo({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text>Hi Nigger You're In!</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 20,
    }
})
