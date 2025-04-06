import React from "react";

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HealthMetrics = ({ daysToEvent, eventType }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#E0F7FA", "#80DEEA", "#4DD0E1"]}
        style={styles.gradientContainer}
      >
        <Text style={styles.titleText}>{eventType} in</Text>
        <Text style={styles.daysText}>{daysToEvent} days</Text>

        <Text style={styles.infoText}>
          {eventType === "Ovulation"
            ? "High chance of getting pregnant"
            : "Be prepared with supplies"}
        </Text>

        <TouchableOpacity style={styles.logButton}>
          <Text style={styles.logButtonText}>Log period</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    height: 240,
  },
  gradientContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    paddingVertical: 30,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#333",
  },
  daysText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  infoText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  logButton: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
  },
  logButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4DD0E1",
  },
});

export default HealthMetrics;
