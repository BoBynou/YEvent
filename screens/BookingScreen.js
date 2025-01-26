import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, Button, Linking, Platform, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DataBase from '../class/DataBase';

const dataBase = new DataBase();

const BookingScreen = ({ route, navigation }) => {
    const event = route.params && route.params.event ? route.params.event : { id: '', image: '', title: '', date: '', location: '', maxseats: 0, reservedseats: 0 };

    const [email, setEmail] = useState('');
    const [numTickets, setNumTickets] = useState('');

    const handleBooking = async () => {
        try {
            const userId = await dataBase.getUserIdByEmail(email);
            if (!userId) {
                alert('Cet utilisateur n\'existe pas !');
                return;
            }
            const newReservation = {
                reservationid: '#' + Math.floor(10000000 + Math.random() * 90000000),
                concertid: event.id,
                userid: userId,
                tikets: Number(numTickets)
            };
            const data = await dataBase.insertData('reservations', newReservation);
            console.log(event.id);
            const toto = await dataBase.updateData('concerts', event.id, { reservedseats: Number(event.reservedseats) + Number(numTickets) });
            console.log('Reservation successful:', data);
            // Navigate to home screen
            navigation.navigate('Acceuil');
        } catch (error) {
            console.error('Error making reservation:', error);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.contentContainer}
            scrollEnabled={true}
        >
            <View style={styles.content}>
                <Image source={{ uri: event.image }} style={styles.image} />
                <Text style={styles.title}>{event.title}</Text>
                <View style={styles.dateContainer}>
                    <MaterialIcons name="calendar-month" size={18} color="#888" style={styles.dateicon} />
                    <Text style={styles.date}>{event.date}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <MaterialIcons name="location-pin" size={18} color="#888" style={styles.dateicon} />
                    <Text style={styles.location} onPress={() => {
                        const url = Platform.select({
                            ios: `maps:0,0?q=${event.location}`,
                            android: `geo:0,0?q=${event.location}`
                        });
                        Linking.openURL(url);
                    }}>{event.location}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <MaterialIcons name="chair-alt" size={18} color="#888" style={styles.dateicon} />
                    <Text style={[styles.location, { color: event.reservedseats < event.maxseats ? 'green' : 'red', fontSize: 28 }]}>
                        Places disponibles : {Number(event.maxseats) - Number(event.reservedseats)}
                    </Text>
                </View>
                {event.reservedseats < event.maxseats ? (
                    <View>
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <View style={styles.dateContainer}>
                                <Text style={{ fontSize: 20 }}>Nombre de billets :</Text>
                                <TextInput
                                    style={[styles.input, { flex: 1 }, { marginLeft: 10 }]}
                                    placeholder="Nombre de billets"
                                    keyboardType="numeric"
                                    value={numTickets}
                                    onChangeText={setNumTickets}
                                    autoCorrect={false} // Disable keyboard suggestions
                                />
                            </View>
                            <Button title="Réserver" onPress={() => {
                                if (!email || !numTickets) {
                                    alert('Veuillez remplir le formulaire !');
                                    return;
                                }
                                handleBooking();
                            }} />
                        </View>
                    </View>
                ) : (
                    <Button style={[{ borderColor: "gray" }, { borderWidth: 32 }]} title="Reservations non disponible" disabled />
                )}
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 400,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    title: {
        color: '#D2AC47',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    date: {
        fontSize: 24,
        color: 'black',
    },
    dateicon: {
        color: 'black',
        fontSize: 40,
    },
    location: {
        fontSize: 24,
        color: 'Black',
        maxWidth: '90%',
    },
    full: {
        fontSize: 46,
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    input: {
        backgroundColor: 'gray',
        height: 35,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        color: 'black', // Added to set the text color to black
    },
});

export default BookingScreen;