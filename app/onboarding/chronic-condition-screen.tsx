import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useOnboarding } from "../context/onboarding-context";
import OnboardingScreen from "./onboarding-screen";

const chronicConditions = [
  "HIV",
  "Herpes (HSV-1)",
  "Herpes (HSV-2)",
  "HPV",
  "Hepatitis B",
  "Hepatitis C",
  "Other",
];

export default function ChronicConditionsScreen() {
  const { data, updateData } = useOnboarding();
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    data.chronicConditions || [],
  );
  const [noConditions, setNoConditions] = useState<boolean>(false);
  const [otherConditionDetails, setOtherConditionDetails] = useState<string>(
    data.otherConditionDetails || "",
  );
  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
      if (noConditions) {
        setNoConditions(false);
      }
    }
  };
  const toggleNoConditions = () => {
    setNoConditions(!noConditions);
    if (!noConditions) {
      setSelectedConditions([]);
    }
  };

  const validateAndProceed = () => {
    updateData({
      chronicConditions: noConditions ? [] : selectedConditions,
      otherConditionDetails: selectedConditions.includes("Other")
        ? otherConditionDetails
        : "",
    });

    return true;
  };

  return (
    <OnboardingScreen
      title="Chronic STIs/Conditions"
      description="Do you have any chronic STIs or related health conditions? This helps us provide relevant resources."
      nextScreen="/onboarding/medications"
      onNext={validateAndProceed}
    >
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.noConditionsButton}
          onPress={toggleNoConditions}
          accessibilityLabel="I don't have any chronic conditions"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: noConditions }}
        >
          <View style={styles.checkboxContainer}>
            <View
              style={[styles.checkbox, noConditions && styles.checkboxSelected]}
            >
              {noConditions && <View style={styles.checkboxInner} />}
            </View>
            <ThemedText style={styles.noConditionsText}>
              I don't have any chronic STIs/conditions
            </ThemedText>
          </View>
        </TouchableOpacity>
        {!noConditions && (
          <View style={styles.conditionsContainer}>
            <ThemedText style={styles.sectionTitle}>
              Select all that apply:
            </ThemedText>
            {chronicConditions.map((condition) => (
              <TouchableOpacity
                key={condition}
                style={styles.conditionItem}
                onPress={() => toggleCondition(condition)}
                accessibilityLabel={condition}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: selectedConditions.includes(condition),
                }}
              >
                <View style={styles.checkboxContainer}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedConditions.includes(condition) &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {selectedConditions.includes(condition) && (
                      <View style={styles.checkboxInner} />
                    )}
                  </View>
                  <ThemedText style={styles.conditionText}>
                    {condition}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
            {selectedConditions.includes("Other") && (
              <View style={styles.otherContainer}>
                <ThemedText style={styles.otherLabel}>
                  Please specify:
                </ThemedText>
              </View>
            )}
          </View>
        )}
        <View style={styles.privacyNote}>
          <ThemedText style={styles.privacyText}>
            This information is stored only on your device and helps us provide
            relevant resources and reminders.
          </ThemedText>
        </View>
      </ScrollView>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  noConditionsButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.light.tint,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.light.tint,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "white",
    borderRadius: 2,
  },
  noConditionsText: {
    fontSize: 16,
  },
  conditionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  conditionItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  conditionText: {
    fontSize: 16,
  },
  otherContainer: {
    padding: 15,
    marginTop: 5,
    marginBottom: 15,
  },
  otherLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  privacyNote: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  privacyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
