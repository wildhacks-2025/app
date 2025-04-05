import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import OnboardingScreen from "./onboarding-screen";
import { useOnboarding } from "../context/onboarding-context";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

type DateTimePickerEvent = {
  type: string;
  nativeEvent: {
    timestamp?: number;
    utcOffset?: number;
  };
};

export default function LastTestScreen() {
  const { data, updateData } = useOnboarding();
  const [date, setDate] = useState<Date | null>(data.lastTestedDate || null);
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    // Handle the date picker events based on platform and event type
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        setDate(selectedDate);
      }
      setShowDatePicker(false);
    } else if (Platform.OS === "ios") {
      if (selectedDate) {
        setDate(selectedDate);
      }
    }
  };

  const validateAndProceed = () => {
    // Allow proceeding without a date - it's okay if they've never been tested
    updateData({ lastTestedDate: date });
    return true;
  };

  // Format date with more readable display
  const formatDate = (date: Date | null): string => {
    if (!date) return "Select a date";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
  };

  return (
    <OnboardingScreen
      title="When were you last tested for STIs/STDs?"
      description="It's okay if you've never been tested. This helps us provide relevant reminders."
      nextScreen="/onboarding/medications"
      onNext={validateAndProceed}
    >
      <View style={styles.container}>
        {/* Date Button - Shown for both platforms but used mainly for Android */}
        <TouchableOpacity
          style={[styles.dateButton, date && styles.dateButtonSelected]}
          onPress={() => setShowDatePicker(true)}
          accessibilityLabel="Select date of last STI/STD test"
          accessibilityHint="Opens a calendar to select when you were last tested"
        >
          <ThemedText style={styles.dateButtonText}>
            {formatDate(date)}
          </ThemedText>
        </TouchableOpacity>

        {/* Never tested button */}
        <TouchableOpacity
          style={styles.neverTestedButton}
          onPress={() => setDate(null)}
          accessibilityLabel="I've never been tested"
          accessibilityHint="Select this if you have never been tested for STIs/STDs"
        >
          <ThemedText
            style={[
              styles.neverTestedText,
              !date && styles.neverTestedTextSelected,
            ]}
          >
            I've never been tested
          </ThemedText>
        </TouchableOpacity>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            maximumDate={new Date()}
            // Adding appropriate styling for iOS
            style={Platform.OS === "ios" ? styles.iOSPicker : undefined}
            // Adding themeVariant for iOS dark mode support
            themeVariant={Platform.OS === "ios" ? "light" : undefined}
          />
        )}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: "center",
    width: "100%",
  },
  dateButton: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 20,
  },
  dateButtonSelected: {
    borderColor: Colors.light.tint,
    borderWidth: 2,
  },
  dateButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  neverTestedButton: {
    padding: 10,
  },
  neverTestedText: {
    fontSize: 16,
    color: Colors.light.tint,
  },
  neverTestedTextSelected: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  iOSPicker: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
});
