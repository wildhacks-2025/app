import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { cream, slate } from '../../constants/Colors';

interface CalendarHeaderProps {
  showingMonth: boolean;
  setShowingMonth: (show: boolean) => void;
  onBack: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  showingMonth,
  setShowingMonth,
  onBack,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name='close' size={28} color={slate} />
      </TouchableOpacity>

      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, showingMonth && styles.activeToggle]}
          onPress={() => setShowingMonth(true)}
        >
          <Text
            style={[styles.toggleText, showingMonth && styles.activeToggleText]}
          >
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !showingMonth && styles.activeToggle]}
          onPress={() => setShowingMonth(false)}
        >
          <Text
            style={[
              styles.toggleText,
              !showingMonth && styles.activeToggleText,
            ]}
          >
            Year
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRight}>
        <View style={{ width: 40 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: cream,
  },
  backButton: {
    padding: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
  },
  activeToggle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  toggleText: {
    color: '#888888',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#000000',
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
});

export default CalendarHeader;
