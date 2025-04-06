import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useOnboarding } from "@/app/context/onboarding-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardItem from "@/components/home-dashboard/dashboard-item";

const cream = "#DDD5D0"; // Light cream
const dustyRose = "#CFC0BD"; // Dusty rose
const sage = "#B8B8AA"; // Sage green
const forest = "#7F9183"; // Forest green
const slate = "#586F6B"; // Slate gray

const { height } = Dimensions.get("window");
const DRAWER_HEIGHT = height * 0.8;

export default function Index() {
  const { data, updateData } = useOnboarding();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const [logData] = useState([
    {
      id: "1",
      date: "2025-04-01",
      symptoms: ["Headache", "Fever"],
      notes: "Rested all day",
    },
    {
      id: "2",
      date: "2025-04-03",
      symptoms: ["Sore throat"],
      notes: "Taking medication",
    },
  ]);

  const [nextTestDate] = useState(() => {
    if (data.lastTestedDate) {
      const lastTest = new Date(data.lastTestedDate);
      const nextTest = new Date(lastTest);
      nextTest.setMonth(lastTest.getMonth() + 3);
      return nextTest;
    }
    return new Date();
  });
  const [riskLevel] = useState("Low");

  useEffect(() => {
    const loadData = async () => {
      try {
        const onboardingComplete = await AsyncStorage.getItem(
          "@safespace_onboarding_complete",
        );

        if (onboardingComplete === "true") {
          const jsonValue = await AsyncStorage.getItem("@safespace_user_data");

          if (jsonValue) {
            const savedData = JSON.parse(jsonValue);

            updateData(savedData);
            setIsOnboardingComplete(true);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [updateData]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={forest} />
      </View>
    );
  }

  if (!isOnboardingComplete && (data.name === "" || data.age === null)) {
    return <Redirect href="/onboarding/welcome" />;
  }

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: DRAWER_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDrawerOpen(false);
    });
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatSex = (sex) => {
    if (!sex) return "Not specified";

    const formatted = {
      male: "Male",
      female: "Female",
      "non-binary": "Non-Binary",
      other: "Other",
      "prefer-not-to-say": "Prefer not to say",
    };

    return formatted[sex] || sex;
  };

  const formatOrientation = (orientation) => {
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
  };

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={cream} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
            <Ionicons name="person-circle-outline" size={28} color={slate} />
          </TouchableOpacity>
          <ThemedText style={styles.welcomeText}>Hello, {data.name}</ThemedText>
        </View>

        <ScrollView style={styles.scrollContainer}>
          <DashboardItem
            title="week calendar"
            style={[styles.dashboardItem, styles.weekCalendar]}
          />
          <DashboardItem
            title="log"
            style={[styles.dashboardItem, styles.logButton]}
          />
          <DashboardItem
            title="past 7 days log"
            style={[styles.dashboardItem, styles.pastDaysLog]}
          />

          {/* Risk & Next Test Recommendations */}
          <View style={styles.infoRow}>
            <View style={[styles.infoItem, styles.riskItem]}>
              <ThemedText style={styles.itemText}>current risk</ThemedText>
              <ThemedText style={styles.riskText}>{riskLevel}</ThemedText>
            </View>

            <View style={[styles.infoItem, styles.nextTestItem]}>
              <ThemedText style={styles.itemText}>
                recommended{"\n"}day for{"\n"}next test
              </ThemedText>
              <ThemedText style={styles.dateText}>
                {formatDate(nextTestDate)}
              </ThemedText>
            </View>
          </View>
          <DashboardItem
            title="symptom tracker"
            style={[styles.dashboardItem, styles.symptomTracker]}
          />
        </ScrollView>
      </View>
      {drawerOpen && (
        <Animated.View
          style={[styles.overlay, { opacity: overlayAnim }]}
          onTouchStart={closeDrawer}
        />
      )}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateY: drawerAnim }] }]}
      >
        <View style={styles.drawerHandle} />
        <View style={styles.drawerHeader}>
          <ThemedText style={styles.drawerTitle}>Your Profile</ThemedText>
          <TouchableOpacity onPress={closeDrawer}>
            <Ionicons name="close" size={24} color={slate} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.drawerContent}>
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Personal Info</ThemedText>

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
              <ThemedText style={styles.value}>
                {formatSex(data.sex)}
              </ThemedText>
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
              <ThemedText style={styles.cardTitle}>
                Chronic Conditions
              </ThemedText>
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
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cream,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: cream,
  },
  container: {
    flex: 1,
    backgroundColor: cream,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  menuButton: {
    padding: 8,
    marginRight: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: slate,
  },
  scrollContainer: {
    padding: 16,
  },
  dashboardItem: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  weekCalendar: {
    backgroundColor: sage,
    height: 100,
  },
  logButton: {
    backgroundColor: dustyRose,
    height: 200,
    width: "100%",
    borderRadius: 100,
  },
  pastDaysLog: {
    backgroundColor: forest,
    height: 100,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    borderRadius: 20,
    padding: 20,
    width: "48%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  riskItem: {
    backgroundColor: sage,
  },
  nextTestItem: {
    backgroundColor: sage,
  },
  symptomTracker: {
    backgroundColor: forest,
    height: 100,
  },
  itemText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },
  riskText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    color: "black",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    color: "black",
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
  },
  drawer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: DRAWER_HEIGHT,
    backgroundColor: cream,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  drawerHandle: {
    width: 40,
    height: 5,
    backgroundColor: slate,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: dustyRose,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: forest,
  },
  drawerContent: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
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
    color: forest,
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
    color: slate,
  },
  value: {
    fontSize: 16,
    flex: 1,
    color: slate,
  },
  listItem: {
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 16,
    color: slate,
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
    color: slate,
  },
  otherDetailsText: {
    fontSize: 14,
    color: slate,
  },
  testItem: {
    backgroundColor: sage + "33", // Adding transparency
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
    color: slate,
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
    color: slate,
  },
});
