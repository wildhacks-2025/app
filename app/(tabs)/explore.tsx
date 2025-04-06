import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, Dimensions, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

type Clinic = {
  id: string;
  name: string;
  address: string;
  coordinate: { latitude: number; longitude: number };
};

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export default function ExploreScreen() {
  const [zipcode, setZipcode] = useState<string>('10001');
  const [region, setRegion] = useState<Region>({
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0221,
  });
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const mapRef = useRef<MapView>(null);

  // padding for dynamic island
  const insets = useSafeAreaInsets();

  const fetchClinics = async () => {
    try {
      // geocoding api
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=AIzaSyDR4t39Yp3SQhzVA338Yqi93h7WZmrZoVw`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.results.length === 0) {
        Alert.alert('Invalid Location', 'Could not find this location.');
        return;
      }

      const { lat, lng } = geocodeData.results[0].geometry.location;

      // places api
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=health&keyword=sexual%20health%20clinic&key=AIzaSyDR4t39Yp3SQhzVA338Yqi93h7WZmrZoVw`;
      const placesResponse = await fetch(placesUrl);
      const placesData = await placesResponse.json();

      if (placesData.results.length === 0) {
        Alert.alert('No Clinics Found', `No clinics found near ZIP code ${zipcode}.`);
        return;
      }

      const fetchedClinics = placesData.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        coordinate: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
      }));

      setClinics(fetchedClinics);

      // update map region based on the first clinic's location
      if (fetchedClinics.length > 0) {
        const firstClinic = fetchedClinics[0];
        const newRegion = {
          latitude: firstClinic.coordinate.latitude,
          longitude: firstClinic.coordinate.longitude,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0221,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching clinics.');
    }
  };

  const handleSearch = () => {
    if (/^\d{5}$/.test(zipcode)) {
      Keyboard.dismiss();
      fetchClinics();
    } else {
      Alert.alert('Invalid ZIP Code', 'Please enter a valid 5-digit ZIP code.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* search input */}
      <View style={[styles.searchContainer, { paddingTop: insets.top + 10 }]}>
        <TextInput
          style={styles.input}
          placeholder="Enter ZIP Code"
          value={zipcode}
          onChangeText={setZipcode}
          keyboardType="numeric"
          maxLength={5}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <ThemedText style={styles.buttonText}>Search</ThemedText>
        </TouchableOpacity>
      </View>

      {/* map */}
      <MapView 
        ref={mapRef}
        style={styles.map} 
        region={region}
      >
        {clinics.map((clinic) => (
          clinic.coordinate && (
            <Marker
              key={clinic.id}
              coordinate={clinic.coordinate}
              title={clinic.name}
              description={clinic.address}
            />
          )
        ))}
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  input: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    borderRadius: 10,
    marginRight: 8,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});
