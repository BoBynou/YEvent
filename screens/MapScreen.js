import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import DataBase from '../class/DataBase';

const dataBase = new DataBase();

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                setLoading(false);
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            const fetchEvents = async () => {
                const concerts = await dataBase.getConcerts();
                setEvents(concerts || []);
            };

            await fetchEvents();
            setLoading(false);
        })();
    }, []);

    const centerMapOnUser = () => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.container}>
                <Text>Vous n'avez pas accès à votre position !</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}
            >
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        }}
                        title="Moi"
                        pinColor="Red"
                    />
                )}
                {events.map(event => (
                    <Marker
                        key={event.id}
                        coordinate={{
                            latitude: event.latitude,
                            longitude: event.longitude
                        }}
                        title={event.title}
                        description={`${event.location} - ${event.date}`}
                    >
                        <Image source={{ uri: event.image }} style={styles.markerImage} />
                    </Marker>
                ))}
            </MapView>
            <View style={styles.buttonContainer}>
                <MaterialIcons.Button
                    name="my-location"
                    backgroundColor="transparent"
                    underlayColor="transparent"
                    color="red"
                    size={30}
                    onPress={centerMapOnUser}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    map: {
        width: '100%',
        height: '100%'
    },
    markerImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    buttonContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MapScreen;