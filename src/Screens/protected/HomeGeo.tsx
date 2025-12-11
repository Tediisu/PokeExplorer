import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, Dimensions, Modal } from 'react-native';
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

type MapPokemon = {
    id: number;
    name: string;
    types: Array<{ type: { name: string } }>;
    latitude: number;
    longitude: number;
    sprite: string;
};

export default function HomeGeo() {
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [region, setRegion] = useState<Location | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [mapPokemon, setMapPokemon] = useState<MapPokemon[]>([]);
    const [loadingPokemon, setLoadingPokemon] = useState(false);
    const mapRef = useRef<MapView>(null);
    const watchId = useRef<number | null>(null);

    const [imageLoaded, setImageLoaded] = useState<{[key: string]: boolean}>({});

    const handleImageLoad = useCallback((pokemonId: number) => {
        setImageLoaded(prev => ({...prev, [pokemonId]: true}));
    }, []);

    // ✅ FIXED: Proper template literals with backticks
    const spawnRandomPokemon = useCallback(async () => {
        const currentLocation = userLocation;
        if (!currentLocation) {
            console.log('Cannot spawn: No user location');
            return;
        }
        if (loadingPokemon) {
            console.log('Already loading a Pokemon...');
            return;
        }

        console.log('Attempting to spawn Pokemon...');
        setLoadingPokemon(true);
        try {
            const randomId = Math.floor(Math.random() * 151) + 1;
            console.log('Fetching Pokemon ID:', randomId);

            // ✅ FIXED: Proper template literal syntax
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            if (!response.ok) throw new Error('Failed to fetch Pokemon');
            const pokemonData = await response.json();

            console.log('Pokemon fetched:', pokemonData.name);

            // Spawn in a wider radius (0.01 = ~1km)
            const offsetLat = currentLocation.latitude + (Math.random() - 0.5) * 0.01;
            const offsetLng = currentLocation.longitude + (Math.random() - 0.5) * 0.01;

            const mapPokemonItem: MapPokemon = {
                id: pokemonData.id,
                name: pokemonData.name,
                types: pokemonData.types,
                latitude: offsetLat,
                longitude: offsetLng,
                // ✅ FIXED: Proper sprite URL template literals
                sprite: pokemonData.sprites.other['official-artwork']?.front_default ||
                       pokemonData.sprites.front_default ||
                       `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`
            };

            console.log('Creating Pokemon at:', offsetLat, offsetLng);

            setMapPokemon(prev => {
                if (prev.length >= 20) {
                    console.log('Max Pokemon reached (20)');
                    return prev;
                }
                const newList = [...prev, mapPokemonItem];
                console.log('✅ Pokemon spawned:', pokemonData.name, 'Total:', newList.length);
                return newList;
            });
        } catch (error) {
            console.error('❌ Failed to spawn Pokemon:', error);
        } finally {
            setLoadingPokemon(false);
        }
    }, [userLocation, loadingPokemon]);

    // ✅ FIXED: Proper template literal in console.log
    useEffect(() => {
        if (!userLocation) {
            console.log('⏳ Waiting for user location...');
            return;
        }

        console.log('🎯 User location detected! Starting spawn system...');
        console.log('📍 Location:', userLocation.latitude, userLocation.longitude);

        const firstSpawn = setTimeout(() => {
            console.log('🚀 Spawning first Pokemon...');
            spawnRandomPokemon();
        }, 1000);

        const spawnTimer = setInterval(() => {
            // ✅ FIXED: Proper template literal
            console.log(`🔄 Spawn check - Current: ${mapPokemon.length}/20`);
            if (mapPokemon.length < 20 && !loadingPokemon) {
                console.log('✨ Triggering spawn...');
                spawnRandomPokemon();
            }
        }, 3000);

        return () => {
            clearTimeout(firstSpawn);
            clearInterval(spawnTimer);
            console.log('🧹 Cleanup: Spawn timers cleared');
        };
    }, [userLocation, spawnRandomPokemon, mapPokemon.length, loadingPokemon]);

    // Real geolocation setup
    useEffect(() => {
        console.log('Setting up geolocation...');
        
        Geolocation.getCurrentPosition(
            pos => {
                const { latitude, longitude } = pos.coords;
                console.log('✅ Got current position:', latitude, longitude);
                const newRegion: Location = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setUserLocation({ latitude, longitude });
                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 1000);
            },
            err => {
                console.error('GPS ERROR (getCurrentPosition):', err);
                // Fallback to Cebu City
                const fallbackLocation = { latitude: 10.3157, longitude: 123.8854 };
                console.log('⚠️ Using fallback location');
                const newRegion: Location = {
                    ...fallbackLocation,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setUserLocation(fallbackLocation);
                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 1000);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
        );

        watchId.current = Geolocation.watchPosition(
            pos => {
                const { latitude, longitude } = pos.coords;
                const newRegion: Location = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setUserLocation({ latitude, longitude });
                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 800);
            },
            err => console.error('GPS ERROR (watchPosition):', err),
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
                region={region || undefined}
            >
                {/* User location */}
                {userLocation && (
                    <>
                        <Marker
                            coordinate={userLocation}
                            title="You"
                            pinColor="blue"
                        />
                        <Circle
                            center={userLocation}
                            radius={50}
                            strokeColor="rgba(0, 150, 255, 0.8)"
                            fillColor="rgba(0, 150, 255, 0.2)"
                        />
                    </>
                )}

                {/* ✅ FIXED: Proper Pokemon markers */}
                {mapPokemon.map((p, index) => (
                <Marker
                    key={`${p.id}-${index}`}
                    coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                    title={p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                    description={`Type: ${p.types[0]?.type.name || 'Unknown'}`}
                    tracksViewChanges={!imageLoaded[p.id]}  // ✅ Dynamic: true until loaded
                >
                    <View style={styles.markerContainer}>
                        <View style={styles.pokemonContainer}>
                            <Image
                                source={{ uri: p.sprite }}
                                style={styles.pokemonImage}
                                resizeMode="contain"
                                onLoad={() => handleImageLoad(p.id)}  // ✅ Triggers re-render
                                onError={(e) => console.log('Image load error:', p.name, e.nativeEvent.error)}
                            />
                        </View>
                    </View>
                </Marker>
            ))}
            </MapView>

            {/* Debug counter */}
            <View style={styles.debugInfo}>
                <Text style={styles.debugText}>Pokémon: {mapPokemon.length}/20</Text>
                <Text style={styles.debugText}>
                    {loadingPokemon ? '⏳ Loading...' : '✅ Ready'}
                </Text>
            </View>

            {/* Pokeball menu button */}
            <TouchableOpacity style={styles.pokeBallButton} onPress={openModal}>
                <Image source={require('@assets/pokeBall.png')} style={styles.pokeImage}/>
            </TouchableOpacity>

            {/* Menu modal */}
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
                        <Text style={styles.modalTitle}>Pokémon GO</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => console.log('Pokedex opened')}>
                                <Image source={require('@assets/pokedex.png')} style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Pokédex</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={() => console.log('Pokémon opened')}>
                                <Image source={require('@assets/pikachu.png')} style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Pokémon</Text>
                            </TouchableOpacity>
                        </View>
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
    
    // ✅ FIXED: Proper marker styles
    markerContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FF6B6B',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    pokemonContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    pokemonImage: {
        width: 50,
        height: 50,
        backgroundColor: 'yellow',
    },
    
    // Pokeball button
    pokeBallButton: {
        position: 'absolute',
        bottom: 30,
        left: width / 2 - 35,
        width: 70,
        height: 70,
        borderRadius: 35,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pokeImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    
    // Debug info
    debugInfo: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        minWidth: 140,
    },
    debugText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    
    // Modal styling
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
