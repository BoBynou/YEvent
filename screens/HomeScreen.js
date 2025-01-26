import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet, TextInput, Linking, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DataBase from '../class/DataBase';

const dataBase = new DataBase();

const HomeScreen = ({ navigation }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const fetchedEvents = await dataBase.getConcerts();
            const currentDate = new Date();
            const upcomingEvents = fetchedEvents.filter(event => new Date(event.date) >= currentDate);
            setEvents(upcomingEvents);
            setFilteredEvents(upcomingEvents);
            setLoading(false);
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const results = events.filter(event =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEvents(results);
    }, [searchQuery, events]);

    if (loading) {
        return <Text>Chargement...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>LOCTIN Jeffrey 👋</Text>
                <MaterialIcons name="explore" size={18} color="#888" style={styles.MapIcon} onPress={() => navigation.navigate('Carte', { events: filteredEvents })} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    style={[styles.searchBar, { flex: 1 }]}
                    placeholder="Rechercher un événement"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
                        <Text style={styles.clearButtonText}>X</Text>
                    </TouchableOpacity>
                )}
            </View>
            {filteredEvents.length === 0 ? (
                <Text>Aucun événement trouvé !</Text>
            ) : (
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[styles.eventItem, styles.eventItemBorder]}>
                            <Text style={styles.eventTitle}>{item.title}</Text>
                            <Image source={{ uri: item.image }} style={styles.eventImage} />
                            <View style={styles.eventDetailsContainer}>
                                <View style={styles.eventDetails}>
                                    <Text style={styles.eventDate}>{item.date}</Text>
                                    <Text style={styles.eventLocation} numberOfLines={3} onPress={() => {
                                        const url = Platform.select({
                                            ios: `maps:0,0?q=${item.location}`,
                                            android: `geo:0,0?q=${item.location}`
                                        });
                                        Linking.openURL(url);
                                    }}>
                                        {item.location}
                                    </Text>
                                    <Text style={[styles.eventStatus, item.reservedseats >= item.maxseats ? styles.full : styles.available]}>
                                        {item.reservedseats >= item.maxseats ? 'Complet' : 'Places disponibles'}
                                    </Text>
                                </View>
                            </View>
                            <Button title="Voir Détails" onPress={() => navigation.navigate('Infos', { event: item })} />
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    MapIcon: {
        marginLeft: 16,
        fontSize: 32,
        color: 'Black',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'Grey', // Couleur de fond de l'écran
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'space-between', // Ajouté pour aligner les éléments à droite
    },
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 60,
        backgroundColor: '#D9D9D9',
        opacity: 0.5,
    },
    clearButton: {
        marginLeft: 8,
        padding: 8,
        backgroundColor: 'red',
        borderRadius: 50,
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    eventItem: {
        marginBottom: 16,
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Couleur de fond des éléments d'événement
    },
    eventItemBorder: {
        borderRadius: 32,
    },
    eventImage: {
        width: '100%',
        height: 400,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D2AC47',
        textAlign: 'center',
        marginBottom: 8,
    },
    eventDetailsContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: 16,
    },
    eventDetails: {
        alignItems: 'flex-start',
    },
    eventDate: {
        fontSize: 16,
        color: 'gray',
    },
    eventLocation: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 4,
    },
    eventStatus: {
        fontSize: 16,
        marginTop: 4,
    },
    full: {
        color: 'red',
    },
    available: {
        color: 'green',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
    },
});

export default HomeScreen;
