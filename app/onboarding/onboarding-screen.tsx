import React, { ReactNode } from "react";
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

interface OnboardingScreenProps {
  title: string;
  description: string;
  children: ReactNode;
  nextScreen: string;
  isLastScreen?: boolean;
  onNext?: () => boolean; // Return true to proceed, false to prevent navigation
}

export default function OnboardingScreen({
  title,
  description,
  children,
  nextScreen,
  isLastScreen = false,
  onNext,
}: OnboardingScreenProps) {
  const router = useRouter();

  const handleNext = () => {
    if (onNext) {
      const canProceed = onNext();
      if (!canProceed) return;
    }

    router.push(nextScreen);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            {/* You could implement a progress indicator here */}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.description}>{description}</ThemedText>

          <View style={styles.inputContainer}>{children}</View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>
              {isLastScreen ? "Complete" : "Continue"}
            </ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.privacyStatement}>
            Your data stays on your device.
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
  },
  progressContainer: {
    flex: 1,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    opacity: 0.8,
  },
  inputContainer: {
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.light.tint,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  privacyStatement: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
});
