import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import OnboardingScreen from "./onboarding-screen";
import { useOnboarding } from "../context/onboarding-context";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

type Sex = "male" | "female" | "non-binary" | "other" | "prefer-not-to-say";

const sexOptions: { label: string; value: Sex }[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Non-Binary", value: "non-binary" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer-not-to-say" },
];

export default function SexScreen() {
  const { data, updateData } = useOnboarding();
  const [selectedSex, setSelectedSex] = useState<Sex | null>(data.sex);

  const validateAndProceed = () => {
    if (!selectedSex) {
      Alert.alert("Please select an option");
      return false;
    }

    updateData({ sex: selectedSex });
    return true;
  };

  return (
    <OnboardingScreen
      title="What's your sex assigned at birth?"
      description="This helps us provide relevant health information."
      nextScreen="/onboarding/last-test"
      onNext={validateAndProceed}
    >
      <View style={styles.optionsContainer}>
        {sexOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              selectedSex === option.value && styles.selectedOption,
            ]}
            onPress={() => setSelectedSex(option.value)}
          >
            <ThemedText
              style={[
                styles.optionText,
                selectedSex === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    marginVertical: 20,
  },
  option: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
  },
  selectedOption: {
    borderColor: Colors.light.tint,
    backgroundColor: `${Colors.light.tint}15`,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  selectedOptionText: {
    fontWeight: "600",
    color: Colors.light.tint,
  },
});
