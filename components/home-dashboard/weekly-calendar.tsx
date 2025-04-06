import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

const cream = "#DDD5D0"; // Light cream
const dustyRose = "#CFC0BD"; // Dusty rose
const sage = "#B8B8AA"; // Sage green
const forest = "#7F9183"; // Forest green
const slate = "#586F6B"; // Slate gray

const { width } = Dimensions.get("window");
const DAY_WIDTH = width / 7;

const WeeklyCalendar = ({ onDateSelect }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [slideAnim] = useState(new Animated.Value(0));
  const [slidingDirection, setSlidingDirection] = useState(null);

  const generateWeekDays = (date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + i);
      days.push({
        day: newDate.getDate(),
        dayName: ["S", "M", "T", "W", "T", "F", "S"][i],
        date: newDate,
        isToday: isToday(newDate),
        isSelected: isSameDay(newDate, selectedDate),
      });
    }

    return days;
  };

  const isToday = (date) => {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const [weekDays, setWeekDays] = useState(generateWeekDays(viewDate));
  const [prevWeekDays, setPrevWeekDays] = useState([]);
  const [nextWeekDays, setNextWeekDays] = useState([]);

  useEffect(() => {
    setWeekDays(generateWeekDays(viewDate));
    const prevWeekDate = new Date(viewDate);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);
    setPrevWeekDays(generateWeekDays(prevWeekDate));
    const nextWeekDate = new Date(viewDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    setNextWeekDays(generateWeekDays(nextWeekDate));
  }, [viewDate, selectedDate]);

  const getMonthText = () => {
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
    return `${monthNames[viewDate.getMonth()]} ${viewDate.getDate()}`;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setViewDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const goToPrevWeek = () => {
    setSlidingDirection("right");
    slideAnim.setValue(width);

    const newViewDate = new Date(viewDate);
    newViewDate.setDate(newViewDate.getDate() - 7);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setViewDate(newViewDate);
      setSlidingDirection(null);
    });
  };

  const goToNextWeek = () => {
    setSlidingDirection("left");
    slideAnim.setValue(-width);

    const newViewDate = new Date(viewDate);
    newViewDate.setDate(newViewDate.getDate() + 7);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setViewDate(newViewDate);
      setSlidingDirection(null);
    });
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setViewDate(today);
    if (onDateSelect) {
      onDateSelect(today);
    }
  };

  // Render a single day
  const renderDay = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.dayContainer}
      onPress={() => handleDateSelect(item.date)}
    >
      <Text style={[styles.dayName, item.isToday ? styles.todayDayName : null]}>
        {item.dayName}
      </Text>
      <View
        style={[
          styles.dateCircle,
          item.isToday ? styles.todayCircle : null,
          item.isSelected && !item.isToday ? styles.selectedCircle : null,
        ]}
      >
        <Text
          style={[
            styles.dateText,
            item.isToday ? styles.todayText : null,
            item.isSelected && !item.isToday ? styles.selectedText : null,
          ]}
        >
          {item.day}
        </Text>
      </View>
      {item.isToday && <View style={styles.todayDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToToday}>
          <Text style={styles.monthText}>{getMonthText()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={goToPrevWeek} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={slate} />
        </TouchableOpacity>

        <View style={styles.weekContainerWrapper}>
          {slidingDirection === "right" && (
            <Animated.View
              style={[
                styles.weekContainer,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              {prevWeekDays.map((item, index) => renderDay(item, index))}
            </Animated.View>
          )}

          {slidingDirection === "left" && (
            <Animated.View
              style={[
                styles.weekContainer,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              {nextWeekDays.map((item, index) => renderDay(item, index))}
            </Animated.View>
          )}

          {slidingDirection === null && (
            <View style={styles.weekContainer}>
              {weekDays.map((item, index) => renderDay(item, index))}
            </View>
          )}
        </View>

        <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={slate} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: cream,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  profileContainer: {
    position: "relative",
  },
  profileButton: {
    padding: 5,
  },
  notificationDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: dustyRose,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    color: slate,
  },
  calendarButton: {
    padding: 5,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  weekContainerWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  navButton: {
    padding: 8,
  },
  dayContainer: {
    flex: 1,
    alignItems: "center",
  },
  dayName: {
    fontSize: 14,
    marginBottom: 5,
    color: slate,
  },
  todayDayName: {
    fontWeight: "bold",
    color: forest,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  todayCircle: {
    backgroundColor: forest,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedCircle: {
    backgroundColor: sage,
    borderWidth: 2,
    borderColor: forest,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "500",
    color: slate,
  },
  todayText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedText: {
    color: slate,
    fontWeight: "bold",
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: forest,
    marginTop: 2,
  },
});

export default WeeklyCalendar;
