import React, { useEffect, useState, useRef } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity,
    Dimensions, Modal
 } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('window');

type Location = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

export default function HomeGeo() {
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [region, setRegion] = useState<Location | null>(null); 
    const [modalVisible, setModalVisible] = useState(false);
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

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
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
            <TouchableOpacity style={styles.pokeBallButton} onPress={openModal}>
                <Image source={require('@assets/pokeBall.png')} style={styles.pokeImage}/>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={closeModal}
                >
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <Text style={styles.modalTitle}>Pokémon Home</Text>
                        
                        {/* 3 Buttons Row */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => console.log('Bag opened')}>
                                <Image 
                                    source={require('@assets/bag.png')} 
                                    style={styles.buttonIcon} 
                                />
                                <Text style={styles.buttonText}>Bag</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalButton} onPress={() => console.log('Pokedex opened')}>
                                <Image 
                                    source={require('@assets/pokedex.png')} 
                                    style={styles.buttonIcon} 
                                />
                                <Text style={styles.buttonText}>Pokédex</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalButton} onPress={() => console.log('Pokémon opened')}>
                                <Image 
                                    source={require('@assets/pikachu.png')} 
                                    style={styles.buttonIcon} 
                                />
                                <Text style={styles.buttonText}>Pokémon</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>✕ Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    pokeBallButton: {
        position: 'absolute',
        bottom: 30,
        left: width / 2 - 35, // Perfect center
        width: 70,
        height: 70,
        borderRadius: 35,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        backgroundColor: 'rgba(83, 70, 199, 0.1)', // Red tint fallback
        justifyContent: 'center',
        alignItems: 'center',
    },
    pokeImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    //MODAL
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        width: width * 0.85,
        maxHeight: height * 0.6,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
     modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    modalButton: {
        alignItems: 'center',
        padding: 15,
    },
    buttonIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 12,
        borderRadius: 25,
        backgroundColor: '#E63946',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

});
