import React from 'react';

import { generateMonthDays, monthName } from '@/utils/date-utils';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { dustyRose, forest, sage, slate } from '../../constants/Colors';

const { width } = Dimensions.get('window');
const DAY_WIDTH = width / 7;

interface MonthViewProps {
  year: number;
  month: number;
  selectedDate: Date;
  markedDates: (string | Date)[];
  onDateSelect: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  year,
  month,
  selectedDate,
  markedDates,
  onDateSelect,
}) => {
  const monthDays = generateMonthDays(year, month, selectedDate, markedDates);

  return (
    <View style={styles.monthContainer}>
      <Text style={styles.monthText}>
        {monthName(month)} {year}
      </Text>
      <View style={styles.daysOfWeek}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text key={index} style={styles.dayName}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.monthGrid}>
        {monthDays.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayContainer,
              !item.isCurrentMonth && styles.otherMonthDay,
            ]}
            onPress={() => onDateSelect(item.date)}
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

const styles = StyleSheet.create({
  monthContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: slate,
    textAlign: 'center',
    marginBottom: 15,
  },
  daysOfWeek: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: slate,
    fontWeight: '500',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10,
  },
  dayContainer: {
    width: DAY_WIDTH,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderStyle: 'dotted',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: slate,
  },
  otherMonthText: {
    color: '#BBBBBB',
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedText: {
    color: slate,
    fontWeight: 'bold',
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
});

export default MonthView;
