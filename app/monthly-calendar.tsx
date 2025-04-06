import React, { useRef, useState } from "react";

import CalendarHeader from "@/components/calendar/calendar-header";
import MonthView from "@/components/calendar/month-view";
import { dustyRose, slate } from "@/constants/Colors";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MONTHS_TO_RENDER = 12;

const FullPageCalendar = ({ onDateSelect, markedDates = [] }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [showingMonth, setShowingMonth] = useState(true);
  const scrollViewRef = useRef(null);
  const router = useRouter();

  const getMonthsArray = () => {
    const months = [];
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    for (let i = MONTHS_TO_RENDER; i > 0; i--) {
      let monthIndex = currentMonth - i;
      let yearOffset = Math.floor(monthIndex / 12);
      if (monthIndex < 0) {
        yearOffset = -1 + Math.floor((monthIndex + 12) / 12);
        monthIndex = (monthIndex + 12 * Math.abs(yearOffset)) % 12;
      }
      months.push({ month: monthIndex, year: currentYear + yearOffset });
    }

    months.push({ month: currentMonth, year: currentYear });
    for (let i = 1; i <= MONTHS_TO_RENDER; i++) {
      let monthIndex = currentMonth + i;
      let yearOffset = Math.floor(monthIndex / 12);
      monthIndex = monthIndex % 12;
      months.push({ month: monthIndex, year: currentYear + yearOffset });
    }
    return months;
  };

  const monthsToDisplay = getMonthsArray();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const goBackToHome = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <CalendarHeader
        showingMonth={showingMonth}
        setShowingMonth={setShowingMonth}
        onBack={goBackToHome}
      />

      {showingMonth ? (
        <View style={styles.calendarContainer}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            contentOffset={{ x: 0, y: 15 * 380 }}
          >
            {monthsToDisplay.map((item, index) => (
              <MonthView
                key={`${item.year}-${item.month}-${index}`}
                year={item.year}
                month={item.month}
                selectedDate={selectedDate}
                markedDates={markedDates}
                onDateSelect={handleDateSelect}
              />
            ))}
          </ScrollView>
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Enter a log</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.yearView}>
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
  calendarContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 80,
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
