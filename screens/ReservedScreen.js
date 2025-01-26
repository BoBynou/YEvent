import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import DataBase from '../class/DataBase';

const dataBase = new DataBase();

const ReservedScreen = ({ route }) => {
    const event = route.params && route.params.event ? route.params.event : { id: '', image: '', title: '', date: '', location: '', reservationId: '', tickets: 0 };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Image source={{ uri: event.image }} style={styles.image} />
                    <Text style={styles.title}>{event.title}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <MaterialIcons name="confirmation-number" size={18} color="#888" style={styles.icon} />
                    <Text style={styles.infoText}>Nombre de billets : {event.tickets}</Text>

                </View>
                <View style={styles.infoContainer}>
                    <MaterialIcons name="calendar-month" size={18} color="#888" style={styles.icon} />
                    <Text style={styles.infoText}>{event.date}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <MaterialIcons name="location-pin" size={18} color="#888" style={styles.icon} />
                    <Text style={styles.infoText} onPress={() => {
                        const url = Platform.select({
                            ios: `maps:0,0?q=${event.location}`,
                            android: `geo:0,0?q=${event.location}`
                        });
                        Linking.openURL(url);
                    }}>{event.location}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <MaterialIcons name="confirmation-number" size={18} color="#888" style={styles.icon} />
                    <Text style={styles.infoText}>Numéro de reservation : {event.reservationId}</Text>

                </View>
            </View>
            <View style={styles.qrContainer}>
                <Text style={styles.qrText}>Votre billet :</Text>
                <QRCode
                    value={`reservationId:${event.reservationId}, concertId:${event.id}, nombre de ticket:${event.tickets}`}
                    size={200}
                />
            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    qrContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    qrText: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    image: {
        width: 100,
        height: 200,
        marginRight: 16,
        resizeMode: 'contain',
    },
    title: {
        color: '#D2AC47',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        color: 'black',
        fontSize: 40,
    },
    infoText: {
        fontSize: 24,
        color: 'Black',
        maxWidth: '90%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    }
});

export default ReservedScreen;
