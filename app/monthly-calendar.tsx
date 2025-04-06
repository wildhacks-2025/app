import React, { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { router, useRouter } from "expo-router";

const cream = "#DDD5D0"; // Light cream
const dustyRose = "#CFC0BD"; // Dusty rose
const sage = "#B8B8AA"; // Sage green
const forest = "#7F9183"; // Forest green
const slate = "#586F6B"; // Slate gray

const { width } = Dimensions.get("window");
const DAY_WIDTH = width / 7;

// Number of months to render before and after the current month
const MONTHS_TO_RENDER = 12;

const FullPageCalendar = ({ onDateSelect, markedDates = [] }) => {
  // Define the monthName function first before using it
  const monthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  };

  // Explicitly set the date to April 2025 since we know that's the current date
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(today);
  const [showingMonth, setShowingMonth] = useState(true); // Toggle between month/year view
  const scrollViewRef = useRef(null);
  const router = useRouter();
  const initialScrollExecuted = useRef(false);

  // This tracks which month is currently most visible in the scroll view
  const [currentVisibleMonth, setCurrentVisibleMonth] = useState(
    today.getMonth(),
  );
  const [currentVisibleYear, setCurrentVisibleYear] = useState(
    today.getFullYear(),
  );

  // Generate an array of months to display with past months, current month, and future months
  const getMonthsArray = () => {
    const months = [];
    const currentMonth = today.getMonth(); // Should be 3 for April
    const currentYear = today.getFullYear(); // Should be 2025

    console.log(
      "Building calendar with current month/year:",
      currentMonth,
      currentYear,
      "Month name:",
      monthName(currentMonth),
    );

    // Add past months in reverse chronological order (most recent past month first)
    for (let i = MONTHS_TO_RENDER; i > 0; i--) {
      let monthIndex = currentMonth - i;
      let yearOffset = Math.floor(monthIndex / 12);
      if (monthIndex < 0) {
        yearOffset = -1 + Math.floor((monthIndex + 12) / 12);
        monthIndex = (monthIndex + 12 * Math.abs(yearOffset)) % 12;
      }

      months.push({
        month: monthIndex,
        year: currentYear + yearOffset,
      });
    }

    // Add the current month
    months.push({
      month: currentMonth,
      year: currentYear,
    });

    // Add future months
    for (let i = 1; i <= MONTHS_TO_RENDER; i++) {
      let monthIndex = currentMonth + i;
      let yearOffset = Math.floor(monthIndex / 12);
      monthIndex = monthIndex % 12;

      months.push({
        month: monthIndex,
        year: currentYear + yearOffset,
      });
    }

    return months;
  };

  const monthsToDisplay = getMonthsArray();

  // Debug the months array
  useEffect(() => {
    console.log(
      "Months to display:",
      monthsToDisplay.map((item) => `${monthName(item.month)} ${item.year}`),
    );

    // Log the current month's position in the array
    const currentMonthIndex = monthsToDisplay.findIndex(
      (item) =>
        item.month === today.getMonth() && item.year === today.getFullYear(),
    );

    console.log("Current month index in array:", currentMonthIndex);
  }, []);

  const isToday = (date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Check if date is marked (like a period date)
  const isMarked = (date) => {
    return markedDates.some((markedDate) =>
      isSameDay(new Date(markedDate), date),
    );
  };

  const generateMonthDays = (year, month) => {
    // Get days from previous month
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const prevMonthDays = [];
    if (startingDay > 0) {
      const daysInPrevMonth = new Date(year, month, 0).getDate();
      for (let i = startingDay - 1; i >= 0; i--) {
        const dayNumber = daysInPrevMonth - i;
        const currentDate = new Date(year, month - 1, dayNumber);
        prevMonthDays.push({
          day: dayNumber,
          date: currentDate,
          isCurrentMonth: false,
          isToday: isToday(currentDate),
          isSelected: isSameDay(currentDate, selectedDate),
          isMarked: isMarked(currentDate),
        });
      }
    }

    // Current month days
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      currentMonthDays.push({
        day: i,
        date: currentDate,
        isCurrentMonth: true,
        isToday: isToday(currentDate),
        isSelected: isSameDay(currentDate, selectedDate),
        isMarked: isMarked(currentDate),
      });
    }

    // Next month days to fill the grid
    const totalDaysCounted = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays = [];
    const rowsNeeded = Math.ceil(totalDaysCounted / 7);
    const totalCells = rowsNeeded * 7;
    const daysToAdd = totalCells - totalDaysCounted;

    for (let i = 1; i <= daysToAdd; i++) {
      const currentDate = new Date(year, month + 1, i);
      nextMonthDays.push({
        day: i,
        date: currentDate,
        isCurrentMonth: false,
        isToday: isToday(currentDate),
        isSelected: isSameDay(currentDate, selectedDate),
        isMarked: isMarked(currentDate),
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Update the selected date
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Handle scroll events to update the current visible month
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const monthHeight = 380; // Approximate height of a month view
    const visibleMonthIndex = Math.floor(scrollY / monthHeight);

    if (visibleMonthIndex >= 0 && visibleMonthIndex < monthsToDisplay.length) {
      const visibleMonth = monthsToDisplay[visibleMonthIndex];
      setCurrentVisibleMonth(visibleMonth.month);
      setCurrentVisibleYear(visibleMonth.year);
    }
  };

  const goBackToHome = () => {
    // Logic to go back to the home screen or close the calendar
    router.back();
  };

  const renderCalendarHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBackToHome}>
          <Ionicons name="close" size={28} color={slate} />
        </TouchableOpacity>

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              showingMonth ? styles.activeToggle : null,
            ]}
            onPress={() => setShowingMonth(true)}
          >
            <Text
              style={[
                styles.toggleText,
                showingMonth ? styles.activeToggleText : null,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !showingMonth ? styles.activeToggle : null,
            ]}
            onPress={() => setShowingMonth(false)}
          >
            <Text
              style={[
                styles.toggleText,
                !showingMonth ? styles.activeToggleText : null,
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          {/* Empty space for symmetry */}
          <View style={{ width: 40 }} />
        </View>
      </View>
    );
  };

  const renderMonth = (year, month) => {
    const monthDays = generateMonthDays(year, month);

    return (
      <View style={styles.monthContainer} key={`${year}-${month}`}>
        <Text style={styles.monthText}>
          {monthName(month)} {year}
        </Text>

        {/* Days of Week Row */}
        <View style={styles.daysOfWeek}>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <Text key={index} style={styles.dayName}>
              {day}
            </Text>
          ))}
        </View>

        {/* Month Grid */}
        <View style={styles.monthGrid}>
          {monthDays.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                !item.isCurrentMonth && styles.otherMonthDay,
              ]}
              onPress={() => handleDateSelect(item.date)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.dateCircle,
                  item.isToday && styles.todayCircle,
                  item.isSelected && styles.selectedCircle,
                  item.isMarked && styles.markedCircle,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    !item.isCurrentMonth && styles.otherMonthText,
                    item.isToday && styles.todayText,
                    item.isSelected && styles.selectedText,
                    item.isMarked && styles.markedText,
                  ]}
                >
                  {item.day}
                </Text>
              </View>

              {item.isToday && <View style={styles.todayDot} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderCalendarHeader()}

      {showingMonth ? (
        <View style={styles.calendarContainer}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
            contentOffset={{ x: 0, y: 15 * 380 }}
          >
            {monthsToDisplay.map((item) => renderMonth(item.year, item.month))}
          </ScrollView>
          {/* Bottom action button */}
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Enter a Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.yearView}>
          {/* Year view would go here */}
          <Text style={styles.yearViewText}>Year view placeholder</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: cream,
  },
  backButton: {
    padding: 8,
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
  },
  activeToggle: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  toggleText: {
    color: "#888888",
    fontWeight: "500",
  },
  activeToggleText: {
    color: "#000000",
    fontWeight: "600",
  },
  headerRight: {
    width: 40,
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 80, // Add padding for the action button
  },
  monthContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    color: slate,
    textAlign: "center",
    marginBottom: 15,
  },
  daysOfWeek: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  dayName: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: slate,
    fontWeight: "500",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 10,
  },
  dayContainer: {
    width: DAY_WIDTH,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  todayCircle: {
    backgroundColor: forest,
  },
  selectedCircle: {
    backgroundColor: sage,
    borderWidth: 2,
    borderColor: forest,
  },
  markedCircle: {
    borderWidth: 2,
    borderColor: dustyRose,
    borderStyle: "dotted",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: slate,
  },
  otherMonthText: {
    color: "#BBBBBB",
  },
  todayText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedText: {
    color: slate,
    fontWeight: "bold",
  },
  markedText: {
    color: dustyRose,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: forest,
    marginTop: 2,
  },
  todayButtonContainer: {
    position: "absolute",
    right: 15,
    top: 10,
    zIndex: 10,
  },
  todayButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  todayButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: forest,
  },
  actionButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  actionButton: {
    backgroundColor: dustyRose,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 250,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  yearView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  yearViewText: {
    fontSize: 18,
    color: slate,
  },
});

export default FullPageCalendar;
