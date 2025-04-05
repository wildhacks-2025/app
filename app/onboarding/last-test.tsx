import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useOnboarding } from "../context/onboarding-context";
import OnboardingScreen from "./onboarding-screen";

type DateTimePickerEvent = {
  type: string;
  nativeEvent: {
    timestamp?: number;
    utcOffset?: number;
  };
};

// Define the STI/STD test types
const testTypes = [
  "HIV",
  "Chlamydia",
  "Gonorrhea",
  "Syphilis",
  "Herpes",
  "HPV",
  "Hepatitis B",
  "Hepatitis C",
  "Trichomoniasis",
  "Full Panel",
];

// Define test result options
const resultOptions = ["Positive", "Negative", "Don't know"];

// Type for test history with dates and results
type TestHistory = {
  [testName: string]: {
    date: Date;
    result: string;
  };
};

export default function LastTestScreen() {
  const { data, updateData } = useOnboarding();
  const router = useRouter();
  // More robust initialization of neverTested state
  const [neverTested, setNeverTested] = useState<boolean>(() => {
    // Check if there's any test history data
    if (data.testHistory && Object.keys(data.testHistory).length > 0) {
      return false;
    }
    // Check if there's a last tested date
    if (data.lastTestedDate) {
      return false;
    }
    // Default to true if no history information exists
    return true;
  });

  // Initialize testHistory with a proper empty object if undefined
  const [testHistory, setTestHistory] = useState<TestHistory>(
    data.testHistory || {},
  );

  // Add useEffect to synchronize component state with context
  useEffect(() => {
    // If data changes and includes test history, update local state
    if (data.testHistory && Object.keys(data.testHistory).length > 0) {
      setTestHistory(data.testHistory);
      setNeverTested(false);
    }

    // If data includes lastTestedDate, update neverTested state
    if (data.lastTestedDate) {
      setNeverTested(false);
    }
  }, [data]);

  // State for add/edit modal
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedResult, setSelectedResult] = useState<string>("Don't know");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isEditing, setIsEditing] = useState(false);

  // Handle date change in the modal
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      if (event.type !== "set" || !selectedDate) return;
    }

    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  // Save test, date and result from modal
  const saveTest = () => {
    if (!selectedTest) return;

    const updatedHistory = { ...testHistory };
    updatedHistory[selectedTest] = {
      date: selectedDate,
      result: selectedResult,
    };
    setTestHistory(updatedHistory);

    // Since we now have a test, ensure neverTested is false
    if (neverTested) {
      setNeverTested(false);
    }

    // Reset and close modal
    setShowModal(false);
    setSelectedTest("");
    setCurrentStep(1);
  };

  // Open modal to add a new test
  const openAddTestModal = () => {
    setSelectedTest("");
    setSelectedDate(new Date());
    setSelectedResult("Don't know");
    setCurrentStep(1);
    setIsEditing(false);
    setShowModal(true);
  };

  // Open modal to edit an existing test
  const openEditTestModal = (test: string) => {
    setSelectedTest(test);
    setSelectedDate(testHistory[test].date);
    setSelectedResult(testHistory[test].result);
    setIsEditing(true);
    setCurrentStep(2); // Start at date selection when editing
    setShowModal(true);
  };

  // Remove a test from history
  const removeTest = (test: string) => {
    const updatedHistory = { ...testHistory };
    delete updatedHistory[test];
    setTestHistory(updatedHistory);

    // If we removed the last test, check if we should set neverTested
    if (Object.keys(updatedHistory).length === 0) {
      setNeverTested(true);
    }
  };

  // Handle "Never Tested" selection
  const handleNeverTested = () => {
    // Update local state
    setNeverTested(true);
    setTestHistory({});

    // Save the "never tested" state to context
    updateData({
      lastTestedDate: null,
      testHistory: {},
      stiTestsReceived: [],
    });

    // Navigate directly to the next screen using router
    router.push("/onboarding/medications");
  };

  // Handle test selection in the modal
  const handleTestSelection = (test: string) => {
    setSelectedTest(test);
    setCurrentStep(2); // Move to date selection
  };

  // Move to next step in the flow
  const moveToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Move to previous step in the flow
  const moveToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Select test result
  const handleResultSelection = (result: string) => {
    setSelectedResult(result);
  };

  // Validate and save data before proceeding
  const validateAndProceed = () => {
    // Get most recent test date (if any)
    let lastTestedDate = null;
    if (Object.keys(testHistory).length > 0) {
      const dates = Object.values(testHistory).map((item) => item.date);
      lastTestedDate = new Date(Math.max(...dates.map((d) => d.getTime())));
    }

    // Update data
    updateData({
      lastTestedDate: neverTested ? null : lastTestedDate,
      testHistory: neverTested ? {} : testHistory,
      stiTestsReceived: neverTested ? [] : Object.keys(testHistory),
    });

    return true;
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  // Get result display color
  const getResultColor = (result: string): string => {
    switch (result) {
      case "Positive":
        return "#d32f2f"; // Red
      case "Negative":
        return "#388e3c"; // Green
      default:
        return "#757575"; // Gray
    }
  };

  return (
    <OnboardingScreen
      title="Your STI/STD Testing History"
      description="Tell us which tests you've received and when. This helps us provide relevant reminders."
      nextScreen="/onboarding/medications"
      onNext={validateAndProceed}
    >
      <View style={styles.container}>
        {/* Never tested option */}
        <TouchableOpacity
          style={styles.neverTestedButton}
          onPress={handleNeverTested}
          accessibilityLabel="I've never been tested"
          accessibilityHint="Select this if you have never been tested for STIs/STDs"
        >
          <ThemedText
            style={[
              styles.neverTestedText,
              neverTested && styles.neverTestedTextSelected,
            ]}
          >
            I've never been tested
          </ThemedText>
        </TouchableOpacity>

        {/* ALWAYS show the Test History Container */}
        <View style={styles.testHistoryContainer}>
          <View style={styles.headerRow}>
            <ThemedText style={styles.sectionTitle}>
              Your Testing History
            </ThemedText>

            <TouchableOpacity
              style={styles.addButton}
              onPress={openAddTestModal}
              accessibilityLabel="Add a test"
              accessibilityHint="Add a new test to your history"
            >
              <ThemedText style={styles.addButtonText}>+ Add Test</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Only conditionally show either the empty state or the test list */}
          {Object.keys(testHistory).length === 0 ? (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                {neverTested
                  ? "Click 'Add Test' to record your first test"
                  : "Tap 'Add Test' to record tests you've received"}
              </ThemedText>
            </View>
          ) : (
            <ScrollView style={styles.testsList}>
              {Object.entries(testHistory).map(([test, info]) => (
                <View key={test} style={styles.testItem}>
                  <View style={styles.testInfo}>
                    <View style={styles.testHeader}>
                      <ThemedText style={styles.testName}>{test}</ThemedText>
                      <View
                        style={[
                          styles.resultBadge,
                          { backgroundColor: getResultColor(info.result) },
                        ]}
                      >
                        <ThemedText style={styles.resultBadgeText}>
                          {info.result}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.testDate}>
                      {formatDate(info.date)}
                    </ThemedText>
                  </View>

                  <View style={styles.testActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => openEditTestModal(test)}
                      accessibilityLabel={`Edit ${test} test`}
                      accessibilityHint="Edit this test in your history"
                    >
                      <ThemedText style={styles.editButtonText}>
                        Edit
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeTest(test)}
                      accessibilityLabel={`Remove ${test} test`}
                      accessibilityHint="Remove this test from your history"
                    >
                      <ThemedText style={styles.removeButtonText}>
                        Remove
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Add/Edit Test Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>
                  {isEditing ? "Edit Test" : "Add New Test"}
                </ThemedText>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowModal(false)}
                >
                  <ThemedText style={styles.closeButtonText}>Cancel</ThemedText>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScrollContent}>
                {/* Step indicator */}
                {!isEditing && (
                  <View style={styles.stepIndicator}>
                    <View style={styles.stepContainer}>
                      <View
                        style={[
                          styles.stepCircle,
                          currentStep === 1 && styles.activeStep,
                        ]}
                      >
                        <ThemedText style={styles.stepNumber}>1</ThemedText>
                      </View>
                      <ThemedText style={styles.stepText}>Test</ThemedText>
                    </View>
                    <View style={styles.stepConnector} />
                    <View style={styles.stepContainer}>
                      <View
                        style={[
                          styles.stepCircle,
                          currentStep === 2 && styles.activeStep,
                        ]}
                      >
                        <ThemedText style={styles.stepNumber}>2</ThemedText>
                      </View>
                      <ThemedText style={styles.stepText}>Date</ThemedText>
                    </View>
                    <View style={styles.stepConnector} />
                    <View style={styles.stepContainer}>
                      <View
                        style={[
                          styles.stepCircle,
                          currentStep === 3 && styles.activeStep,
                        ]}
                      >
                        <ThemedText style={styles.stepNumber}>3</ThemedText>
                      </View>
                      <ThemedText style={styles.stepText}>Result</ThemedText>
                    </View>
                  </View>
                )}

                {/* Test selection - Step 1 */}
                {currentStep === 1 && !isEditing && (
                  <>
                    <ThemedText style={styles.instructionText}>
                      Select which test you received:
                    </ThemedText>

                    <View style={styles.testButtonsGrid}>
                      {testTypes
                        .filter((test) => !(test in testHistory))
                        .map((test) => (
                          <TouchableOpacity
                            key={test}
                            style={styles.testSelectButton}
                            onPress={() => handleTestSelection(test)}
                            accessibilityLabel={`Add ${test} test`}
                            accessibilityHint="Select this test to add to your history"
                          >
                            <ThemedText style={styles.testSelectButtonText}>
                              {test}
                            </ThemedText>
                          </TouchableOpacity>
                        ))}
                    </View>

                    {/* Show message if no tests are available */}
                    {testTypes.filter((test) => !(test in testHistory))
                      .length === 0 && (
                      <ThemedText style={styles.allTestsAddedText}>
                        You've added all available test types.
                      </ThemedText>
                    )}
                  </>
                )}

                {/* Date selection - Step 2 */}
                {currentStep === 2 && (
                  <>
                    <View style={styles.selectedTestDisplay}>
                      <ThemedText style={styles.selectedTestLabel}>
                        Test Type:
                      </ThemedText>
                      <ThemedText style={styles.selectedTestValue}>
                        {selectedTest}
                      </ThemedText>
                    </View>

                    <ThemedText style={styles.instructionText}>
                      When did you receive this test?
                    </ThemedText>

                    <View style={styles.datePickerContainer}>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={selectedDate}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                        style={styles.datePicker}
                        themeVariant="light"
                      />
                    </View>

                    {/* Navigation buttons */}
                    <View style={styles.navigationButtons}>
                      {!isEditing && (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={moveToPreviousStep}
                        >
                          <ThemedText style={styles.backButtonText}>
                            Back
                          </ThemedText>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={styles.nextButton}
                        onPress={moveToNextStep}
                      >
                        <ThemedText style={styles.nextButtonText}>
                          Next
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {/* Result selection - Step 3 */}
                {currentStep === 3 && (
                  <>
                    <View style={styles.selectedInfoDisplay}>
                      <View style={styles.selectedTestDisplay}>
                        <ThemedText style={styles.selectedTestLabel}>
                          Test:
                        </ThemedText>
                        <ThemedText style={styles.selectedTestValue}>
                          {selectedTest}
                        </ThemedText>
                      </View>
                      <View style={styles.selectedDateDisplay}>
                        <ThemedText style={styles.selectedTestLabel}>
                          Date:
                        </ThemedText>
                        <ThemedText style={styles.selectedDateValue}>
                          {formatDate(selectedDate)}
                        </ThemedText>
                      </View>
                    </View>

                    <ThemedText style={styles.instructionText}>
                      What was the result of this test?
                    </ThemedText>

                    <View style={styles.resultButtonsContainer}>
                      {resultOptions.map((result) => (
                        <TouchableOpacity
                          key={result}
                          style={[
                            styles.resultButton,
                            selectedResult === result &&
                              styles.resultButtonSelected,
                            selectedResult === result && {
                              borderColor: getResultColor(result),
                              backgroundColor: `${getResultColor(result)}15`, // 15% opacity
                            },
                          ]}
                          onPress={() => handleResultSelection(result)}
                          accessibilityLabel={`${result} result`}
                          accessibilityRole="radio"
                          accessibilityState={{
                            checked: selectedResult === result,
                          }}
                        >
                          <ThemedText
                            style={[
                              styles.resultButtonText,
                              selectedResult === result &&
                                styles.resultButtonTextSelected,
                              selectedResult === result && {
                                color: getResultColor(result),
                              },
                            ]}
                          >
                            {result}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Navigation buttons */}
                    <View style={styles.navigationButtons}>
                      <TouchableOpacity
                        style={styles.backButton}
                        onPress={moveToPreviousStep}
                      >
                        <ThemedText style={styles.backButtonText}>
                          Back
                        </ThemedText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={saveTest}
                      >
                        <ThemedText style={styles.saveButtonText}>
                          Save
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  neverTestedButton: {
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  neverTestedText: {
    fontSize: 16,
    color: Colors.light.tint,
  },
  neverTestedTextSelected: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  testHistoryContainer: {
    flex: 1,
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginVertical: 20,
  },
  emptyStateText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
  testsList: {
    flex: 1,
  },
  testItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testInfo: {
    marginBottom: 10,
  },
  testHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  testName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  testDate: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  testActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    marginRight: 10,
  },
  editButtonText: {
    fontSize: 14,
    color: "#444",
  },
  removeButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: "#ffeeee",
    borderRadius: 15,
  },
  removeButtonText: {
    fontSize: 14,
    color: "#d32f2f",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: "600",
  },
  modalScrollContent: {
    padding: 15,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  stepContainer: {
    alignItems: "center",
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  activeStep: {
    backgroundColor: Colors.light.tint,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  stepText: {
    fontSize: 12,
    color: "#555",
  },
  stepConnector: {
    height: 2,
    backgroundColor: "#ddd",
    width: 40,
    marginHorizontal: 5,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  testButtonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  testSelectButton: {
    width: "48%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  testSelectButtonText: {
    fontSize: 15,
    textAlign: "center",
  },
  allTestsAddedText: {
    textAlign: "center",
    padding: 20,
    color: "#666",
    fontStyle: "italic",
  },
  selectedInfoDisplay: {
    marginBottom: 20,
  },
  selectedTestDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedDateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
  },
  selectedTestLabel: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 10,
  },
  selectedTestValue: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: "500",
  },
  selectedDateValue: {
    fontSize: 16,
    color: "#555",
  },
  datePickerContainer: {
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  datePicker: {
    width: Platform.OS === "ios" ? "100%" : undefined,
    height: Platform.OS === "ios" ? 180 : undefined,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
  },
  backButtonText: {
    fontSize: 16,
    color: "#666",
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: Colors.light.tint,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: Colors.light.tint,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  resultButtonsContainer: {
    marginBottom: 20,
  },
  resultButton: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
  },
  resultButtonSelected: {
    borderWidth: 2,
  },
  resultButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  resultButtonTextSelected: {
    fontWeight: "bold",
  },
});
