import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

type Location = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

export default function HomeGeo() {
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [region, setRegion] = useState<Location | null>(null); // Track region state
    const mapRef = useRef<MapView>(null);
    const watchId = useRef<number | null>(null);

    useEffect(() => {
        // Get initial position and set region
        Geolocation.getCurrentPosition(
            pos => {
                const { latitude, longitude } = pos.coords;
                const newRegion: Location = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.0005,
                    longitudeDelta: 0.0005,
                };
                setUserLocation({ latitude, longitude });
                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 1000);
            },
            err => console.log('GPS ERROR (getCurrentPosition): ', err),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
        );

        // Real-time tracking
        watchId.current = Geolocation.watchPosition(
            pos => {
                const { latitude, longitude } = pos.coords;
                const newRegion: Location = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.0005,
                    longitudeDelta: 0.0005,
                };
                setUserLocation({ latitude, longitude });
                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 800);
            },
            err => console.log('GPS ERROR (watchPosition): ', err),
            {
                enableHighAccuracy: true,
                distanceFilter: 1,
                interval: 1000,
                fastestInterval: 500,
            }
        );

        return () => {
            if (watchId.current !== null) {
                Geolocation.clearWatch(watchId.current);
            }
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                // Removed initialRegion and followsUserLocation for full control
            >
                {userLocation && (
                    <>
                        <Marker
                            coordinate={userLocation}
                            title="You"
                            pinColor="blue"
                        />

                        <Circle
                            center={userLocation}
                            radius={20}
                            strokeColor="rgba{0, 150, 255, 0.8}"
                            fillColor="rgba(0, 150, 255, 0.2)"

                        />

                    </>
                )}
            </MapView>

            <View style={styles.header}>
                <Text style={styles.welcomeText}>Hi! You're In!</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
