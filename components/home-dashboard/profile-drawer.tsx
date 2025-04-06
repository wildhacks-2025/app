import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { formatDate, formatOrientation, formatSex } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const cream = '#DDD5D0'; // Light cream
const dustyRose = '#CFC0BD'; // Dusty rose
const forest = '#7F9183'; // Forest green
const slate = '#586F6B'; // Slate gray
const sage = '#B8B8AA'; // Sage green

const { height } = Dimensions.get('window');
const DRAWER_HEIGHT = height * 0.9;

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  drawerAnim: Animated.Value;
};

export default function ProfileDrawer({
  isOpen,
  onClose,
  userData,
  drawerAnim,
}: ProfileDrawerProps) {
  function getResultBadgeStyle(result) {
    switch (result) {
      case 'Positive':
        return { backgroundColor: '#d32f2f' }; // Red
      case 'Negative':
        return { backgroundColor: '#388e3c' }; // Green
      default:
        return { backgroundColor: '#757575' }; // Gray
    }
  }

  return (
    <Animated.View
      style={[styles.drawer, { transform: [{ translateY: drawerAnim }] }]}
    >
      <View style={styles.drawerHandle} />
      <View style={styles.drawerHeader}>
        <ThemedText style={styles.drawerTitle}>Your Profile</ThemedText>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name='close' size={24} color={slate} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.drawerContent}>
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Personal Info</ThemedText>

          <View style={styles.profileItem}>
            <ThemedText style={styles.label}>Name:</ThemedText>
            <ThemedText style={styles.value}>{userData.name}</ThemedText>
          </View>

          <View style={styles.profileItem}>
            <ThemedText style={styles.label}>Age:</ThemedText>
            <ThemedText style={styles.value}>
              {userData.age} years old
            </ThemedText>
          </View>

          <View style={styles.profileItem}>
            <ThemedText style={styles.label}>Sex:</ThemedText>
            <ThemedText style={styles.value}>
              {formatSex(userData.sex)}
            </ThemedText>
          </View>

          <View style={styles.profileItem}>
            <ThemedText style={styles.label}>Sexual Orientation:</ThemedText>
            <ThemedText style={styles.value}>
              {formatOrientation(userData.orientation)}
            </ThemedText>
          </View>

          <View style={styles.profileItem}>
            <ThemedText style={styles.label}>Last Tested:</ThemedText>
            <ThemedText style={styles.value}>
              {userData.lastTestedDate
                ? formatDate(new Date(userData.lastTestedDate))
                : 'Never tested'}
            </ThemedText>
          </View>
        </ThemedView>

        {userData.chronicConditions &&
          userData.chronicConditions.length > 0 && (
            <ThemedView style={styles.card}>
              <ThemedText style={styles.cardTitle}>
                Chronic Conditions
              </ThemedText>
              {userData.chronicConditions.map((condition, index) => (
                <View key={index} style={styles.listItem}>
                  <ThemedText style={styles.listItemText}>
                    • {condition}
                  </ThemedText>
                </View>
              ))}
              {userData.otherConditionDetails && (
                <View style={styles.otherDetails}>
                  <ThemedText style={styles.otherDetailsLabel}>
                    Other details:
                  </ThemedText>
                  <ThemedText style={styles.otherDetailsText}>
                    {userData.otherConditionDetails}
                  </ThemedText>
                </View>
              )}
            </ThemedView>
          )}

        {userData.medications && userData.medications.length > 0 && (
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>
              Current Medications
            </ThemedText>
            {userData.medications.map((medication, index) => (
              <View key={index} style={styles.listItem}>
                <ThemedText style={styles.listItemText}>
                  • {medication}
                </ThemedText>
              </View>
            ))}
          </ThemedView>
        )}

        {userData.testHistory &&
          Object.keys(userData.testHistory).length > 0 && (
            <ThemedView style={styles.card}>
              <ThemedText style={styles.cardTitle}>Testing History</ThemedText>
              {Object.entries(userData.testHistory).map(
                ([test, info], index) => (
                  <View key={index} style={styles.testItem}>
                    <View style={styles.testHeader}>
                      <ThemedText style={styles.testName}>{test}</ThemedText>
                      <View
                        style={[
                          styles.resultBadge,
                          getResultBadgeStyle(info.result),
                        ]}
                      >
                        <ThemedText style={styles.resultText}>
                          {info.result}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.testDate}>
                      {formatDate(new Date(info.date))}
                    </ThemedText>
                  </View>
                )
              )}
            </ThemedView>
          )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: DRAWER_HEIGHT,
    backgroundColor: cream,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  drawerHandle: {
    width: 40,
    height: 5,
    backgroundColor: slate,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: dustyRose,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: forest,
  },
  drawerContent: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: forest,
  },
  profileItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    width: 150,
    color: slate,
  },
  value: {
    fontSize: 16,
    flex: 1,
    color: slate,
  },
  listItem: {
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 16,
    color: slate,
  },
  otherDetails: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  otherDetailsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: slate,
  },
  otherDetailsText: {
    fontSize: 14,
    color: slate,
  },
  testItem: {
    backgroundColor: sage + '33',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: slate,
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  testDate: {
    fontSize: 14,
    color: slate,
  },
});
