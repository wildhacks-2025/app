import React, { useState } from "react";
import { StyleSheet, View, Text, Platform, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import OnboardingScreen from "./onboarding-screen";
import { useOnboarding } from "../context/onboarding-context";

export default function AgeScreen() {
  const { data, updateData } = useOnboarding();

  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 18);

  const [birthdate, setBirthdate] = useState(
    data.birthdate ? new Date(data.birthdate) : defaultDate,
  );
  const [age, setAge] = useState(data.age || calculateAge(defaultDate));
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");

  function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  const onChange = (event, selectedDate) => {
    if (event.type === "set" || Platform.OS === "ios") {
      const currentDate = selectedDate || birthdate;
      setBirthdate(currentDate);
      setAge(calculateAge(currentDate));

      if (Platform.OS === "android") {
        setShowPicker(false);
      }
    } else if (Platform.OS === "android" && event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  const validateAndProceed = () => {
    if (age < 13) {
      alert("You must be 13 or older to use this app");
      return false;
    }

    if (age > 120) {
      alert("Please enter a valid birth date");
      return false;
    }

    updateData({
      age: age,
      birthdate: birthdate.toISOString(),
    });

    return true;
  };

  return (
    <OnboardingScreen
      title="How old are you?"
      description="Your age helps us provide age-appropriate content and resources."
      nextScreen="/onboarding/sex"
      onNext={validateAndProceed}
    >
      <View style={styles.container}>
        <Text style={styles.ageDisplay}>{age} years old</Text>

        {Platform.OS === "android" && (
          <Pressable style={styles.dateButton} onPress={showDatepicker}>
            <Text style={styles.dateButtonText}>
              Select Birth Date: {birthdate.toLocaleDateString()}
            </Text>
          </Pressable>
        )}

        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={birthdate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
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
  },
  ageDisplay: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dateButton: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 16,
  },
});
