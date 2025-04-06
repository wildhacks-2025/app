import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface DateTimePickerProps {
  onChange: (date: Date) => void;
  currentDate: Date;
}

export default function DateTimePicker(props: DateTimePickerProps) {
  if (Platform.OS === 'ios') {
    return <IOSDateTimePicker {...props} />;
  }
  return null;
}

export const IOSDateTimePicker = ({
  onChange,
  currentDate,
}: DateTimePickerProps) => {
  return (
    <RNDateTimePicker
      style={{ alignSelf: 'flex-start' }}
      accentColor='black'
      minimumDate={new Date()}
      value={currentDate}
      mode='date'
      display='default'
      onChange={(_, date?: Date) => onChange(date || new Date())}
    />
  );
};