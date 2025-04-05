import { Redirect } from "expo-router";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import { useOnboarding } from "@/app/context/onboarding-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

export default function Index() {
  const { data } = useOnboarding();

  // Check if onboarding is completed
  const hasCompletedOnboarding = data.name !== "" && data.age !== null;
  // Setting forceOnboarding to false to allow navigation to main app after completing onboarding
  const forceOnboarding = false;

  console.log("hasCompletedOnboarding", hasCompletedOnboarding);

  if (hasCompletedOnboarding && !forceOnboarding) {
    console.log("here1");
    // Display the user's data
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.welcomeText}>
            Welcome, {data.name}!
          </ThemedText>
        </View>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Your Profile</ThemedText>

          <View style={styles.profileItem}>
            <ThemedText style={styles.label}>Name:</ThemedText>
            <ThemedText style={styles.value}>{data.name}</ThemedText>
          </View>

          <View style={styles.profileItem}>
            <ThemedText style={styles.label}>Age:</ThemedText>
            <ThemedText style={styles.value}>{data.age} years old</ThemedText>
          </View>

          <View style={styles.profileItem}>
            <ThemedText style={styles.label}>Sex:</ThemedText>
            <ThemedText style={styles.value}>{formatSex(data.sex)}</ThemedText>
          </View>

          <View style={styles.profileItem}>
            <ThemedText style={styles.label}>Sexual Orientation:</ThemedText>
            <ThemedText style={styles.value}>
              {formatOrientation(data.orientation)}
            </ThemedText>
          </View>

          <View style={styles.profileItem}>
            <ThemedText style={styles.label}>Last Tested:</ThemedText>
            <ThemedText style={styles.value}>
              {data.lastTestedDate
                ? formatDate(new Date(data.lastTestedDate))
                : "Never tested"}
            </ThemedText>
          </View>
        </ThemedView>

        {data.chronicConditions && data.chronicConditions.length > 0 && (
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Chronic Conditions</ThemedText>
            {data.chronicConditions.map((condition, index) => (
              <View key={index} style={styles.listItem}>
                <ThemedText style={styles.listItemText}>
                  • {condition}
                </ThemedText>
              </View>
            ))}
            {data.otherConditionDetails && (
              <View style={styles.otherDetails}>
                <ThemedText style={styles.otherDetailsLabel}>
                  Other details:
                </ThemedText>
                <ThemedText style={styles.otherDetailsText}>
                  {data.otherConditionDetails}
                </ThemedText>
              </View>
            )}
          </ThemedView>
        )}

        {data.medications && data.medications.length > 0 && (
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>
              Current Medications
            </ThemedText>
            {data.medications.map((medication, index) => (
              <View key={index} style={styles.listItem}>
                <ThemedText style={styles.listItemText}>
                  • {medication}
                </ThemedText>
              </View>
            ))}
          </ThemedView>
        )}

        {data.testHistory && Object.keys(data.testHistory).length > 0 && (
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Testing History</ThemedText>
            {Object.entries(data.testHistory).map(([test, info], index) => (
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
            ))}
          </ThemedView>
        )}

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Your data is stored only on your device.
          </ThemedText>
        </View>
      </ScrollView>
    );
  } else {
    console.log("here2");
    return <Redirect href="/onboarding/welcome" />;
  }
}

// Helper functions for formatting data
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

function formatSex(sex) {
  if (!sex) return "Not specified";

  const formatted = {
    male: "Male",
    female: "Female",
    "non-binary": "Non-Binary",
    other: "Other",
    "prefer-not-to-say": "Prefer not to say",
  };

  return formatted[sex] || sex;
}

function formatOrientation(orientation) {
  if (!orientation) return "Not specified";

  const formatted = {
    straight: "Straight",
    gay: "Gay",
    lesbian: "Lesbian",
    bisexual: "Bisexual",
    pansexual: "Pansexual",
    asexual: "Asexual",
    other: "Other",
    "prefer-not-to-say": "Prefer not to say",
  };

  return formatted[orientation] || orientation;
}

function getResultBadgeStyle(result) {
  switch (result) {
    case "Positive":
      return { backgroundColor: "#d32f2f" }; // Red
    case "Negative":
      return { backgroundColor: "#388e3c" }; // Green
    default:
      return { backgroundColor: "#757575" }; // Gray
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingVertical: 24,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.light.tint,
  },
  profileItem: {
    flexDirection: "row",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    width: 150,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  listItem: {
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 16,
  },
  otherDetails: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  otherDetailsLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  otherDetailsText: {
    fontSize: 14,
  },
  testItem: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  testHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  testName: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  testDate: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
