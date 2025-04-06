import React from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Color palette
const cream = '#DDD5D0'; // Light cream
const dustyRose = '#CFC0BD'; // Dusty rose
const sage = '#B8B8AA'; // Sage green
const forest = '#7F9183'; // Forest green
const slate = '#586F6B'; // Slate gray

const { width } = Dimensions.get('window');

const HealthMetrics = ({ daysToEvent, eventType }) => {
  const router = useRouter();
  const goToLogEvent = () => {
    router.push('/log-entry');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[cream, sage + '80', forest + '50']} // Adding transparency to make gradient more subtle
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>{eventType} in</Text>
          <Text style={styles.daysText}>{daysToEvent} days</Text>
          <Text style={styles.infoText}>
            {eventType === 'Ovulation'
              ? 'High chance of getting pregnant'
              : eventType === 'Testing due'
                ? 'Recommended to get tested soon'
                : 'Be prepared with supplies'}
          </Text>
          <TouchableOpacity style={styles.logButton} onPress={goToLogEvent}>
            <Text style={styles.logButtonText}>Log Entry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Curved bottom element */}
      <View style={styles.curveContainer}>
        {/* Using gradient for the circle to match exactly */}
        <LinearGradient
          colors={[cream, cream]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.curve}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 0,
    borderRadius: 0,
    overflow: 'hidden',
    height: 280,
    position: 'relative',
  },
  gradientContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  daysText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  logButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: slate,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: forest,
  },
  curveContainer: {
    position: 'absolute',
    bottom: -710,
    width: '100%',
    height: 750,
    overflow: 'hidden',
  },
  curve: {
    position: 'absolute',
    width: width * 2,
    height: 750,
    borderRadius: width,
    alignSelf: 'center',
    transform: [{ scaleX: 1 }],
    left: -width / 2,
  },
});

export default HealthMetrics;
