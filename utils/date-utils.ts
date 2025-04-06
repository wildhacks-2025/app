export const monthName = (month: number): string => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[month];
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const isToday = (date: Date, today: Date): boolean => {
  return isSameDay(date, today);
};

export const generateMonthDays = (
  year: number,
  month: number,
  selectedDate: Date,
  markedDates: (string | Date)[]
) => {
  // Previous month days
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDay = firstDayOfMonth.getDay();
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
        isToday: isToday(currentDate, new Date()),
        isSelected: isSameDay(currentDate, selectedDate),
        isMarked: markedDates.some((md) =>
          isSameDay(new Date(md), currentDate)
        ),
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
      isToday: isToday(currentDate, new Date()),
      isSelected: isSameDay(currentDate, selectedDate),
      isMarked: markedDates.some((md) => isSameDay(new Date(md), currentDate)),
    });
  }

  // Next month days to fill the grid
  const totalDaysCounted = prevMonthDays.length + currentMonthDays.length;
  const rowsNeeded = Math.ceil(totalDaysCounted / 7);
  const totalCells = rowsNeeded * 7;
  const daysToAdd = totalCells - totalDaysCounted;
  const nextMonthDays = [];
  for (let i = 1; i <= daysToAdd; i++) {
    const currentDate = new Date(year, month + 1, i);
    nextMonthDays.push({
      day: i,
      date: currentDate,
      isCurrentMonth: false,
      isToday: isToday(currentDate, new Date()),
      isSelected: isSameDay(currentDate, selectedDate),
      isMarked: markedDates.some((md) => isSameDay(new Date(md), currentDate)),
    });
  }
  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};
