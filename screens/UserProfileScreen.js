import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button, Linking, Platform } from 'react-native';
import DataBase from '../class/DataBase';


const dataBase = new DataBase();

const UserProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await dataBase.getUserById('1');
      setUser(fetchedUser);
    };

    fetchUser();
  }, []);

  const [bookedEvents, setBookedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchBookedEvents = async () => {
        const fetchedEvents = await dataBase.getUserConcerts(user.id);
        setBookedEvents(fetchedEvents);
        setLoading(false);
      };

      fetchBookedEvents();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      {user && (
        <>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.emailContainer}>
            <Image source={{ uri: 'https://www.pngall.com/wp-content/uploads/13/Email-Logo-No-Background.png' }} style={styles.emailIcon} />
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </>
      )}
      <Text style={styles.sectionTitle}>Mes réservations</Text>
      {loading ? (
        <Text>Chargement...</Text>
      ) : bookedEvents.length === 0 ? (
        <Text>Aucun événement réservé</Text>
      ) : (
        <FlatList
          data={bookedEvents.sort((a, b) => new Date(a.date) - new Date(b.date))}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => item ? (
            <View style={[styles.eventItem, styles.eventItemBorder]}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventTickets}>Nombre de billets réservés: {item.tickets}</Text>
              <Text style={styles.eventTickets}>Id : {item.reservationId}</Text>
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
                  <Text style={[styles.eventStatus, item.isFull ? styles.full : styles.available]}>
                    {item.isFull ? 'Complet' : 'Places disponibles'}
                  </Text>
                </View>
              </View>
              <Button title="Voir Détails" onPress={() => navigation.navigate('Reservation', { event: item })} />
            </View>
          ) : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  userEmail: {
    fontSize: 18,
    color: 'gray',
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 16,
    textAlign: 'center',
    color: '#D2AC47',
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
  eventDetailsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 16,
  },
  eventDetails: {
    alignItems: 'flex-start',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#D2AC47',
    marginBottom: 8,
  },
  eventTickets: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 8,
    fontWeight: 'bold',
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
  emailIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
});

export default UserProfileScreen;
