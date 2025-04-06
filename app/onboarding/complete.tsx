import React, { useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useOnboarding } from "../context/onboarding-context";

export default function CompleteScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const [saving, setSaving] = useState(false);

  const saveDataToStorage = async () => {
    try {
      setSaving(true);

      // Convert data to a string
      const jsonValue = JSON.stringify(data);

      // Save to AsyncStorage
      await AsyncStorage.setItem("@safespace_user_data", jsonValue);

      // Also save a flag indicating onboarding is complete
      await AsyncStorage.setItem("@safespace_onboarding_complete", "true");

      console.log("Data saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert(
        "Storage Error",
        "There was a problem saving your data. Please try again.",
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const finishOnboarding = async () => {
    const success = await saveDataToStorage();
    if (success) {
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentContainer}>
          <ThemedText style={styles.title}>All Set, {data.name}!</ThemedText>
          <ThemedText style={styles.description}>
            Thank you for sharing your information. Your data is securely stored
            on your device.
          </ThemedText>
          <ThemedText style={styles.privacyNote}>
            Your health. Your privacy. Your journey.
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={finishOnboarding}
            activeOpacity={0.8}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText style={styles.buttonText}>
                Start Using cocoon
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  icon: {
    width: 100,
    height: 100,
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  privacyNote: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: Colors.light.tint,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: Colors.light.tint,
    width: "80%",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
