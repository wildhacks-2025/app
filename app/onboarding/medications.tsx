import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import OnboardingScreen from "./onboarding-screen";
import { useOnboarding } from "../context/onboarding-context";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

// Common medications and contraceptives
const suggestions = [
  "Birth Control Pill",
  "IUD",
  "Condoms",
  "Implant",
  "Patch",
  "Ring",
  "Injection",
  "Emergency Contraception",
  "PrEP",
  "None",
];

export default function MedicationsScreen() {
  const { data, updateData } = useOnboarding();
  const [medications, setMedications] = useState<string[]>(
    data.medications || [],
  );
  const [currentInput, setCurrentInput] = useState("");

  const addMedication = (med: string) => {
    if (med.trim() !== "" && !medications.includes(med.trim())) {
      const updatedMeds = [...medications, med.trim()];
      setMedications(updatedMeds);
      setCurrentInput("");
    }
  };

  const removeMedication = (index: number) => {
    const updatedMeds = [...medications];
    updatedMeds.splice(index, 1);
    setMedications(updatedMeds);
  };

  const validateAndProceed = () => {
    updateData({ medications });
    return true;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <OnboardingScreen
        title="Current Medications or Contraceptives"
        description="Add any medications or contraceptives you're currently using."
        nextScreen="/onboarding/orientation"
        onNext={validateAndProceed}
      >
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add medication or contraceptive"
              value={currentInput}
              onChangeText={setCurrentInput}
              onSubmitEditing={() => addMedication(currentInput)}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addMedication(currentInput)}
            >
              <ThemedText style={styles.addButtonText}>+</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.suggestionsContainer}>
            <ThemedText style={styles.suggestionsTitle}>
              Suggestions:
            </ThemedText>
            <View style={styles.suggestions}>
              {suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  style={styles.suggestionItem}
                  onPress={() => addMedication(suggestion)}
                >
                  <ThemedText style={styles.suggestionText}>
                    {suggestion}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.listContainer}>
            <ThemedText style={styles.listTitle}>
              {medications.length > 0 ? "Your list:" : "No items added yet"}
            </ThemedText>
            <FlatList
              data={medications}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item, index }) => (
                <View style={styles.medicationItem}>
                  <ThemedText style={styles.medicationText}>{item}</ThemedText>
                  <TouchableOpacity
                    onPress={() => removeMedication(index)}
                    style={styles.removeButton}
                  >
                    <ThemedText style={styles.removeButtonText}>×</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      </OnboardingScreen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
  },
  addButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.tint,
    borderRadius: 22,
    marginLeft: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  suggestionItem: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 4,
  },
  suggestionText: {
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  medicationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  medicationText: {
    fontSize: 16,
  },
  removeButton: {
    padding: 5,
  },
  removeButtonText: {
    fontSize: 22,
    color: "#ff6b6b",
  },
});
