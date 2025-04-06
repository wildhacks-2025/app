import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const cream = '#DDD5D0'; // Light cream
const dustyRose = '#CFC0BD'; // Dusty rose
const sage = '#B8B8AA'; // Sage green
const forest = '#7F9183'; // Forest green
const slate = '#586F6B'; // Slate gray

const { width } = Dimensions.get('window');
const DAY_WIDTH = width / 7;

const MonthlyCalendar = ({ onDateSelect }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [monthDays, setMonthDays] = useState([]);

  useEffect(() => {
    setMonthDays(generateMonthDays(viewDate));
  }, [viewDate, selectedDate]);

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

  const generateMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startingDay + daysInMonth) / 7) * 7;
    const daysArray = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDay + 1;
      if (dayNumber > 0 && dayNumber <= daysInMonth) {
        const currentDate = new Date(year, month, dayNumber);
        daysArray.push({
          day: dayNumber,
          date: currentDate,
          isToday: isToday(currentDate),
          isSelected: isSameDay(currentDate, selectedDate),
        });
      } else {
        daysArray.push(null); // Empty cell for alignment
      }
    }

    return daysArray;
  };

  // Update the selected date so that only one date is highlighted.
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const goToPrevMonth = () => {
    const prevMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    setViewDate(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    setViewDate(nextMonth);
  };

  const goToToday = () => {
    setSelectedDate(today);
    setViewDate(today);
    if (onDateSelect) {
      onDateSelect(today);
    }
  };

  const monthText = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      {/* Header with navigation arrows and month text */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={slate} />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToToday}>
          <Text style={styles.monthText}>{monthText()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={slate} />
        </TouchableOpacity>
      </View>

      {/* Days of Week Row */}
      <View style={styles.daysOfWeek}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text
            key={index}
            style={[styles.dayName, { width: DAY_WIDTH, textAlign: 'center' }]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Month Grid */}
      <View style={styles.monthGrid}>
        {monthDays.map((item, index) =>
          item ? (
            <TouchableOpacity
              key={index}
              style={[styles.dayContainer, { width: DAY_WIDTH }]}
              onPress={() => handleDateSelect(item.date)}
            >
              <View
                style={[
                  styles.dateCircle,
                  // Only apply a highlight if this date is the selected date.
                  item.isSelected
                    ? item.isToday
                      ? styles.todayCircle
                      : styles.selectedCircle
                    : null,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    item.isSelected
                      ? item.isToday
                        ? styles.todayText
                        : styles.selectedText
                      : null,
                  ]}
                >
                  {item.day}
                </Text>
              </View>
              {/* Only show the today dot if this cell represents today and it is selected */}
              {(item.isToday && item.isSelected) && <View style={styles.todayDot} />}
            </TouchableOpacity>
          ) : (
            <View key={index} style={[styles.dayContainer, { width: DAY_WIDTH }]} />
          )
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: slate,
  },
  navButton: {
    padding: 8,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  dayName: {
    fontSize: 14,
    marginBottom: 5,
    color: slate,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  todayCircle: {
    backgroundColor: forest, // Green for today
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedCircle: {
    backgroundColor: sage, // Highlight for selected (non-today)
    borderWidth: 2,
    borderColor: forest,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    color: slate,
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedText: {
    color: slate,
    fontWeight: 'bold',
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: forest,
    marginTop: 2,
  },
});

export default MonthlyCalendar;
