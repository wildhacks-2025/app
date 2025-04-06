import React, { useEffect, useRef, useState } from 'react';
import { useOnboarding } from '@/app/context/onboarding-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DashboardItem from '@/components/home-dashboard/dashboard-item';
import WeeklyCalendar from '@/components/home-dashboard/weekly-calendar';
import MonthlyCalendar from '@/app/(tabs)/monthly-calendar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native";

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
  // New state to toggle between weekly and monthly calendar views.
  const [calendarView, setCalendarView] = useState('weekly');
  // Determine which health metric to show based on data
  const [healthMetricType, setHealthMetricType] = useState("Testing due");
  const [daysToEvent, setDaysToEvent] = useState(3);

  useEffect(() => {
    // Calculate days to next test based on last tested date
    if (data.lastTestedDate) {
      const lastTest = new Date(data.lastTestedDate);
      const nextTest = new Date(lastTest);
      nextTest.setMonth(lastTest.getMonth() + 3); // Assuming 3-month testing cycle

      const today = new Date();
      const diffTime = nextTest - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setDaysToEvent(diffDays);

      // Set appropriate metric type
      if (diffDays <= 7) {
        setHealthMetricType("Testing due");
      } else {
        // For demo purposes, showing the "Ovulation" metric if testing is not due soon
        // In a real app, you would determine this based on menstrual cycle data
        setHealthMetricType("Ovulation");
      }
    }
  }, [data.lastTestedDate]);
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
      <StatusBar barStyle='dark-content' backgroundColor={cream} />
      <View style={styles.container}>
        {/* Header with drawer menu, welcome text, and calendar toggle button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
            <Ionicons name='person-circle-outline' size={28} color={slate} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <ThemedText style={styles.welcomeText}>
              Hello, {data.name}
            </ThemedText>
            <TouchableOpacity
              onPress={() =>
                setCalendarView((prev) =>
                  prev === 'weekly' ? 'monthly' : 'weekly'
                )
              }
              style={styles.calendarToggleButton}
            >
              {/* Change icon based on current view */}
              <Ionicons
                name={calendarView === 'weekly' ? 'calendar' : 'calendar-outline'}
                size={28}
                color={slate}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {/* Conditionally render WeeklyCalendar or MonthlyCalendar */}
          {calendarView === 'weekly' ? (
            <WeeklyCalendar
              onDateSelect={(date) => console.log('Selected date:', date)}
            />
          ) : (
            <MonthlyCalendar
              onDateSelect={(date) => console.log('Selected date:', date)}
            />
          )}
      <StatusBar barStyle="dark-content" backgroundColor={cream} />

      {/* Using a single ScrollView for the whole content */}
      <ScrollView style={styles.scrollContainer}>
        {/* Header Area */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
              <Ionicons name="person-circle-outline" size={28} color={slate} />
            </TouchableOpacity>
            <ThemedText style={styles.welcomeText}>
              Hello, {data.name}
            </ThemedText>
          </View>

          {/* Calendar below the header row */}
          <View style={styles.calendarContainer}>
            <WeeklyCalendar
              onDateSelect={(date) => console.log("Selected date:", date)}
            />
          </View>
        </View>

        {/* Health Metrics Card */}
        <HealthMetrics daysToEvent={daysToEvent} eventType={healthMetricType} />

        {/* Dashboard Content */}
        <View style={styles.dashboardContent}>
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
        </View>
      </ScrollView>

      {/* Drawer and overlay remain unchanged */}
      {drawerOpen && (
        <Animated.View
          style={[styles.overlay, { opacity: overlayAnim }]}
          onTouchStart={closeDrawer}
        />
      )}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateY: drawerAnim }] }]}
      >
        {/* Drawer content remains unchanged */}
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
  // Main scroll container that contains everything
  scrollContainer: {
    flex: 1,
    backgroundColor: cream,
  },
  // Header area
  header: {
    backgroundColor: cream,
    paddingBottom: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
  },
  menuButton: {
    padding: 6,
  },
  // New style for the center header row containing welcome text and calendar toggle
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: slate,
    marginLeft: 8,
  },
  calendarToggleButton: {
    padding: 8,
  },
  scrollContainer: {
  calendarContainer: {
    width: "100%",
    marginTop: -8,
  },
  // Dashboard content
  dashboardContent: {
    padding: 16,
    marginTop: 5, // Small margin after the HealthMetrics card
  },
  dashboardItem: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
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
    flexWrap: "wrap", // Allow wrapping if needed
  },
  infoItem: {
    borderRadius: 20,
    padding: 20,
    width: "48%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8, // Add space between items if they wrap
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
    backgroundColor: sage + "33",
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
