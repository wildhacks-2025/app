import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useOnboarding } from '@/app/context/onboarding-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DashboardItem from '@/components/home-dashboard/dashboard-item';
import HealthMetrics from '@/components/home-dashboard/health-metrics';
import WeeklyCalendar from '@/components/home-dashboard/weekly-calendar';
import { cream, dustyRose, forest, sage, slate } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router } from 'expo-router';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native';

const { height } = Dimensions.get('window');
const DRAWER_HEIGHT = height * 0.8;

export default function Index() {
  // Hook declarations - All hooks must be called unconditionally at the top level
  const { data, updateData } = useOnboarding();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Logs and insights states
  const [encounterLogs, setEncounterLogs] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [riskLevel, setRiskLevel] = useState('Low');
  const [riskFactors, setRiskFactors] = useState([]);
  const [nextTestDate, setNextTestDate] = useState(new Date());

  // Determine which health metric to show based on data
  const [healthMetricType, setHealthMetricType] = useState('Testing due');
  const [daysToEvent, setDaysToEvent] = useState(3);

  // Helper functions - define these outside of useEffect for reuse
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatSex = (sex) => {
    if (!sex) return 'Not specified';

    const formatted = {
      male: 'Male',
      female: 'Female',
      'non-binary': 'Non-Binary',
      other: 'Other',
      'prefer-not-to-say': 'Prefer not to say',
    };

    return formatted[sex] || sex;
  };

  const formatOrientation = (orientation) => {
    if (!orientation) return 'Not specified';

    const formatted = {
      straight: 'Straight',
      gay: 'Gay',
      lesbian: 'Lesbian',
      bisexual: 'Bisexual',
      pansexual: 'Pansexual',
      asexual: 'Asexual',
      other: 'Other',
      'prefer-not-to-say': 'Prefer not to say',
    };

    return formatted[orientation] || orientation;
  };

  function getResultBadgeStyle(result) {
    switch (result) {
      case 'Positive':
        return { backgroundColor: '#d32f2f' }; // Red
      case 'Negative':
        return { backgroundColor: '#388e3c' }; // Green
      default:
        return { backgroundColor: '#757575' }; // Gray
    }
  }

  // Risk calculation functions
  const calculateRiskScore = (logs) => {
    // Starting with a base risk score
    let riskScore = 0;

    // Only consider logs from the last 3 months for risk calculation
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const recentLogs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= threeMonthsAgo;
    });

    if (recentLogs.length === 0) {
      return 0; // No recent activity = baseline risk
    }

    // Count different partners
    const uniquePartners = new Set(
      recentLogs.map((log) => log.partnerName || 'Unknown')
    );

    // Point system for risk factors
    riskScore += uniquePartners.size * 5; // 5 points per unique partner

    // Add points for high-risk activities
    recentLogs.forEach((log) => {
      // Unprotected sex is a major risk factor
      if (log.protectionUsed?.none || log.protectionFailure === 'Yes') {
        riskScore += 15;
      }

      // High-risk activities
      if (log.sexTypes?.vaginalSexGiving || log.sexTypes?.vaginalSexReceiving) {
        riskScore += log.protectionUsed?.condom ? 3 : 10;
      }

      if (log.sexTypes?.analSexGiving || log.sexTypes?.analSexReceiving) {
        riskScore += log.protectionUsed?.condom ? 5 : 15;
      }

      // Fluid exchange risk
      if (log.fluidsExchanged?.ejaculation === 'Yes') {
        riskScore += 10;
      }

      if (log.fluidsExchanged?.barrierExchange === 'Yes') {
        riskScore += 10;
      }

      // Partner with known positive status
      if (log.partnerStiStatus?.status === 'Positive') {
        riskScore += 30;
      }
    });

    return riskScore;
  };

  // Identify specific risk factors to explain the risk level
  const identifyRiskFactors = (logs) => {
    const factors = [];
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const recentLogs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= threeMonthsAgo;
    });

    if (recentLogs.length === 0) {
      return ['No recent activity recorded'];
    }

    // Count unique partners
    const uniquePartners = new Set(
      recentLogs.map((log) => log.partnerName || 'Anonymous')
    );
    if (uniquePartners.size > 1) {
      factors.push(
        `${uniquePartners.size} different partners in the last 3 months`
      );
    }

    // Count unprotected encounters
    const unprotectedCount = recentLogs.filter(
      (log) => log.protectionUsed?.none || log.protectionFailure === 'Yes'
    ).length;
    if (unprotectedCount > 0) {
      factors.push(
        `${unprotectedCount} unprotected encounter${unprotectedCount > 1 ? 's' : ''}`
      );
    }

    // Check for high-risk activities
    const highRiskCount = recentLogs.filter(
      (log) =>
        (log.sexTypes?.analSexGiving || log.sexTypes?.analSexReceiving) &&
        !log.protectionUsed?.condom
    ).length;

    if (highRiskCount > 0) {
      factors.push(
        `${highRiskCount} high-risk encounter${highRiskCount > 1 ? 's' : ''}`
      );
    }

    // Check for known positive status partners
    const positivePartnerCount = recentLogs.filter(
      (log) => log.partnerStiStatus?.status === 'Positive'
    ).length;
    if (positivePartnerCount > 0) {
      factors.push(
        `${positivePartnerCount} encounter${positivePartnerCount > 1 ? 's' : ''} with partner(s) with known positive status`
      );
    }

    if (factors.length === 0) {
      factors.push('Consistent use of protection');
    }

    return factors;
  };

  // Determine risk level based on score
  const determineRiskLevel = (riskScore) => {
    if (riskScore === 0) return 'Baseline';
    if (riskScore < 10) return 'Low';
    if (riskScore < 30) return 'Moderate';
    if (riskScore < 50) return 'High';
    return 'Very High';
  };

  // Calculate next recommended test date
  const calculateNextTestDate = (logs, riskLevel) => {
    // Find the most recent encounter
    const today = new Date();

    // Sort logs by date, most recent first
    const sortedLogs = [...logs].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const lastEncounter =
      sortedLogs.length > 0 ? new Date(sortedLogs[0].date) : null;

    // Find the most recent test
    const lastTestedDate = data.lastTestedDate
      ? new Date(data.lastTestedDate)
      : null;

    // Default test schedule based on risk level
    let monthsToNextTest = 3; // Default is 3 months

    switch (riskLevel) {
      case 'Very High':
        monthsToNextTest = 1; // Test monthly
        break;
      case 'High':
        monthsToNextTest = 2; // Test every 2 months
        break;
      case 'Moderate':
        monthsToNextTest = 3; // Test every 3 months
        break;
      case 'Low':
      case 'Baseline':
        monthsToNextTest = 6; // Test every 6 months
        break;
    }

    // If there's no last test, calculate from the most recent encounter or today
    const baseDate = lastTestedDate || lastEncounter || today;
    const nextTest = new Date(baseDate);
    nextTest.setMonth(nextTest.getMonth() + monthsToNextTest);

    // If next test date is in the past, recommend testing ASAP (within a week)
    if (nextTest < today) {
      const oneWeekFromNow = new Date(today);
      oneWeekFromNow.setDate(today.getDate() + 7);
      return oneWeekFromNow;
    }

    return nextTest;
  };

  // Create a memoized function for calculating insights
  // This will only re-run when encounterLogs changes, not on every render
  const calculateInsights = useMemo(() => {
    if (encounterLogs.length === 0) {
      return {
        recentLogs: [],
        riskLevel: 'Low',
        riskFactors: ['No recent activity recorded'],
        nextTestDate: new Date(),
      };
    }

    // Filter logs from the past 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const filteredRecentLogs = encounterLogs.filter((log) => {
      // Make sure we're comparing dates properly
      const logDate = new Date(log.date);

      // Normalize the dates to remove time component for comparison
      const logDateNormalized = new Date(logDate);
      logDateNormalized.setHours(0, 0, 0, 0);

      const sevenDaysAgoNormalized = new Date(sevenDaysAgo);
      sevenDaysAgoNormalized.setHours(0, 0, 0, 0);

      const todayNormalized = new Date(today);
      todayNormalized.setHours(0, 0, 0, 0);

      return (
        logDateNormalized >= sevenDaysAgoNormalized &&
        logDateNormalized <= todayNormalized
      );
    });

    // Calculate risk level based on recent activity
    const riskScore = calculateRiskScore(encounterLogs);
    const factors = identifyRiskFactors(encounterLogs);
    const risk = determineRiskLevel(riskScore);

    // Calculate recommended next test date
    const testDate = calculateNextTestDate(encounterLogs, risk);

    return {
      recentLogs: filteredRecentLogs,
      riskLevel: risk,
      riskFactors: factors,
      nextTestDate: testDate,
    };
  }, [encounterLogs, data.lastTestedDate]);

  // Get a summary of recent logs for display
  const getRecentLogsSummary = () => {
    if (recentLogs.length === 0) {
      return 'No encounters in the past week';
    }
    return `${recentLogs.length} encounter${recentLogs.length > 1 ? 's' : ''} in the past week`;
  };

  // Function to handle calendar button press and navigate to the monthly calendar screen
  const handleCalendarPress = () => {
    console.log('Calendar button pressed');
    router.push('/monthly-calendar');
  };

  // Function to handle log button press
  const handleLogPress = () => {
    console.log('Log button pressed');
    router.push('/log-entry');
  };

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

  // Effect to handle initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        const onboardingComplete = await AsyncStorage.getItem(
          '@safespace_onboarding_complete'
        );

        if (onboardingComplete === 'true') {
          const jsonValue = await AsyncStorage.getItem('@safespace_user_data');

          if (jsonValue) {
            const savedData = JSON.parse(jsonValue);
            updateData(savedData);
            setIsOnboardingComplete(true);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [updateData]);

  // Effect to calculate days to next test
  useEffect(() => {
    if (data.lastTestedDate) {
      const lastTest = new Date(data.lastTestedDate);
      const nextTest = new Date(lastTest);
      nextTest.setMonth(lastTest.getMonth() + 3); // Assuming 3-month testing cycle

      const today = new Date();
      const diffTime = nextTest - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Only update if we haven't calculated a more accurate date from logs
      if (encounterLogs.length === 0) {
        setDaysToEvent(diffDays);

        // Set appropriate metric type
        if (diffDays <= 7) {
          setHealthMetricType('Testing due');
        } else {
          // For demo purposes, showing the "Ovulation" metric if testing is not due soon
          // In a real app, you would determine this based on menstrual cycle data
          setHealthMetricType('Ovulation');
        }
      }
    }
  }, [data.lastTestedDate, encounterLogs]);

  // Effect to fetch encounter logs and calculate insights
  useEffect(() => {
    const fetchEncounterLogs = async () => {
      try {
        const storedLogsString = await AsyncStorage.getItem(
          '@cocoon_encounter_logs'
        );
        if (storedLogsString) {
          const logs = JSON.parse(storedLogsString);
          setEncounterLogs(logs);
        }
      } catch (error) {
        console.error('Error fetching encounter logs:', error);
      }
    };

    fetchEncounterLogs();
  }, []);

  // Update state values from the calculated insights
  useEffect(() => {
    const insights = calculateInsights;
    setRecentLogs(insights.recentLogs);
    setRiskLevel(insights.riskLevel);
    setRiskFactors(insights.riskFactors);

    const newNextTestDate = new Date(insights.nextTestDate);
    setNextTestDate(newNextTestDate);

    // Calculate days to next test
    const today = new Date();
    const diffTime = newNextTestDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysToEvent(diffDays);

    // Update health metric type based on the calculated test date
    if (diffDays <= 7) {
      setHealthMetricType('Testing due');
    } else {
      // Default to another metric if testing is not due soon
      setHealthMetricType('Testing due');
    }
  }, [calculateInsights]);

  // Early returns - these are after all hook declarations to avoid the React Hooks error
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={forest} />
      </View>
    );
  }

  if (!isOnboardingComplete && (data.name === '' || data.age === null)) {
    return <Redirect href='/onboarding/welcome' />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle='dark-content' backgroundColor={cream} />

      {/* Using a single ScrollView for the whole content */}
      <ScrollView style={styles.scrollContainer}>
        {/* Header Area */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
              <Ionicons name='person-circle-outline' size={28} color={slate} />
            </TouchableOpacity>
            <ThemedText style={styles.welcomeText}>
              Hello, {data.name}
            </ThemedText>
            {/* New Calendar Button */}
            <TouchableOpacity
              onPress={handleCalendarPress}
              style={styles.calendarButton}
            >
              <Ionicons name='calendar' size={28} color={slate} />
            </TouchableOpacity>
          </View>

          {/* Calendar below the header row */}
          <View style={styles.calendarContainer}>
            <WeeklyCalendar
              onDateSelect={(date) => console.log('Selected date:', date)}
            />
          </View>
        </View>

        {/* Health Metrics Card */}
        <HealthMetrics daysToEvent={daysToEvent} eventType={healthMetricType} />

        {/* Dashboard Content */}
        <View style={styles.dashboardContent}>
          {/* Past 7 Days Log */}
          <TouchableOpacity style={[styles.dashboardItem, styles.pastDaysLog]}>
            <ThemedText style={styles.recentActivityText}>
              {getRecentLogsSummary()}
            </ThemedText>
          </TouchableOpacity>

          {/* Risk & Next Test Recommendations */}
          <View style={styles.infoRow}>
            <View style={[styles.infoItem, styles.riskItem]}>
              <ThemedText style={styles.itemText}>current risk</ThemedText>
              <ThemedText style={styles.riskText}>{riskLevel}</ThemedText>
              {riskFactors.length > 0 && (
                <ThemedText style={styles.riskFactorText}>
                  {riskFactors[0]}
                </ThemedText>
              )}
            </View>

            <View style={[styles.infoItem, styles.nextTestItem]}>
              <ThemedText style={styles.itemText}>
                recommended{'\n'}day for{'\n'}next test
              </ThemedText>
              <ThemedText style={styles.dateText}>
                {formatDate(nextTestDate)}
              </ThemedText>
            </View>
          </View>
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
            <Ionicons name='close' size={24} color={slate} />
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
                  : 'Never tested'}
              </ThemedText>
            </View>
          </ThemedView>

          {/* Risk Factors */}
          <ThemedView style={styles.card}>
            <ThemedText style={styles.cardTitle}>Risk Assessment</ThemedText>
            <View style={styles.profileItem}>
              <ThemedText style={styles.label}>Current Risk Level:</ThemedText>
              <ThemedText style={styles.value}>{riskLevel}</ThemedText>
            </View>

            {riskFactors.length > 0 && (
              <View>
                <ThemedText style={styles.riskFactorsTitle}>
                  Factors:
                </ThemedText>
                {riskFactors.map((factor, index) => (
                  <View key={index} style={styles.listItem}>
                    <ThemedText style={styles.listItemText}>
                      • {factor}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.profileItem}>
              <ThemedText style={styles.label}>Next Test:</ThemedText>
              <ThemedText style={styles.value}>
                {formatDate(nextTestDate)}
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
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
    justifyContent: 'space-between', // Space out items in the header row
  },
  menuButton: {
    padding: 6,
  },
  // New calendar button style
  calendarButton: {
    padding: 6,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: slate,
    flex: 1,
    marginLeft: 8,
  },
  calendarContainer: {
    width: '100%',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logButton: {
    backgroundColor: dustyRose,
    height: 200,
    width: '100%',
    borderRadius: 100,
  },
  pastDaysLog: {
    backgroundColor: forest,
    height: 100,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap', // Allow wrapping if needed
  },
  infoItem: {
    borderRadius: 20,
    padding: 20,
    width: '48%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  riskText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    color: 'black',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    color: 'black',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  drawer: {
    position: 'absolute',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  drawerHandle: {
    width: 40,
    height: 5,
    backgroundColor: slate,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: dustyRose,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: forest,
  },
  drawerContent: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: forest,
  },
  profileItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  otherDetailsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: slate,
  },
  otherDetailsText: {
    fontSize: 14,
    color: slate,
  },
  testItem: {
    backgroundColor: sage + '33',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: slate,
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  testDate: {
    fontSize: 14,
    color: slate,
  },
});
