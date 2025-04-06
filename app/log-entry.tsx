import React, { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { cream, dustyRose, forest, sage, slate } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Type definitions
export type STIStatus = 'Clean' | 'Not sure' | 'Positive';
export type YesNoNotSure = 'Yes' | 'No' | 'Not sure';
export type ReminderOption = 'Monthly' | 'Quarterly' | 'No';

export interface EncounterLogEntry {
  id: string;
  date: string;
  time: string;
  partnerName: string;
  partnerStiStatus: {
    status: STIStatus;
    details?: string;
  };
  protectionUsed: {
    condom: boolean;
    preP: boolean;
    pep: boolean;
    birthControl: boolean;
    pill: boolean;
    iud: boolean;
    implant: boolean;
    doxyPep: boolean;
    withdrawal: boolean;
    none: boolean;
  };
  protectionFailure: YesNoNotSure;
  sexTypes: {
    kissing: boolean;
    oralSexGiving: boolean;
    oralSexReceiving: boolean;
    vaginalSexGiving: boolean;
    vaginalSexReceiving: boolean;
    analSexGiving: boolean;
    analSexReceiving: boolean;
    mutualMasturbation: boolean;
    toyUse: boolean;
    other: string;
  };
  fluidsExchanged: {
    ejaculation: YesNoNotSure;
    barrierExchange: YesNoNotSure;
  };
  personalizedTestingReminder: ReminderOption;
  discreetIcon: boolean;
  setPasscode: boolean;
  createdAt: string; // ISO date string when the entry was created
}

export default function LogEntry() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios');

  // Basic Information
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [partnerName, setPartnerName] = useState<string>('');
  const [partnerStiStatus, setPartnerStiStatus] =
    useState<STIStatus>('Not sure');
  const [partnerStiDetails, setPartnerStiDetails] = useState<string>('');

  // Protection used
  const [condom, setCondom] = useState<boolean>(false);
  const [preP, setPreP] = useState<boolean>(false);
  const [pep, setPep] = useState<boolean>(false);
  const [birthControl, setBirthControl] = useState<boolean>(false);
  const [pill, setPill] = useState<boolean>(false);
  const [iud, setIud] = useState<boolean>(false);
  const [implant, setImplant] = useState<boolean>(false);
  const [doxyPep, setDoxyPep] = useState<boolean>(false);
  const [withdrawal, setWithdrawal] = useState<boolean>(false);
  const [none, setNone] = useState<boolean>(false);

  const [protectionFailure, setProtectionFailure] =
    useState<YesNoNotSure>('Not sure');

  // Sex Type
  const [kissing, setKissing] = useState<boolean>(false);
  const [oralSexGiving, setOralSexGiving] = useState<boolean>(false);
  const [oralSexReceiving, setOralSexReceiving] = useState<boolean>(false);
  const [vaginalSexGiving, setVaginalSexGiving] = useState<boolean>(false);
  const [vaginalSexReceiving, setVaginalSexReceiving] =
    useState<boolean>(false);
  const [analSexGiving, setAnalSexGiving] = useState<boolean>(false);
  const [analSexReceiving, setAnalSexReceiving] = useState<boolean>(false);
  const [mutualMasturbation, setMutualMasturbation] = useState<boolean>(false);
  const [toyUse, setToyUse] = useState<boolean>(false);
  const [otherSex, setOtherSex] = useState<string>('');

  // Fluids exchanged
  const [ejaculation, setEjaculation] = useState<YesNoNotSure>('Not sure');
  const [barrierExchange, setBarrierExchange] =
    useState<YesNoNotSure>('Not sure');

  // Preferences
  const [testingReminder, setTestingReminder] = useState<ReminderOption>('No');
  const [discreetIcon, setDiscreetIcon] = useState<boolean>(false);
  const [setPasscode, setSetPasscode] = useState<boolean>(false);

  // Handling protection selection
  const handleProtectionChange = (type: string, value: boolean) => {
    if (type === 'none' && value) {
      // If "None" is selected, unselect all other options
      setCondom(false);
      setPreP(false);
      setPep(false);
      setBirthControl(false);
      setPill(false);
      setIud(false);
      setImplant(false);
      setDoxyPep(false);
      setWithdrawal(false);
      setNone(true);
    } else if (value) {
      // If any other option is selected, unselect "None"
      setNone(false);

      // Set the specific value
      switch (type) {
        case 'condom':
          setCondom(true);
          break;
        case 'preP':
          setPreP(true);
          break;
        case 'pep':
          setPep(true);
          break;
        case 'birthControl':
          setBirthControl(true);
          break;
        case 'pill':
          setPill(true);
          break;
        case 'iud':
          setIud(true);
          break;
        case 'implant':
          setImplant(true);
          break;
        case 'doxyPep':
          setDoxyPep(true);
          break;
        case 'withdrawal':
          setWithdrawal(true);
          break;
      }
    } else {
      // Simply toggle the value if turning off
      switch (type) {
        case 'condom':
          setCondom(false);
          break;
        case 'preP':
          setPreP(false);
          break;
        case 'pep':
          setPep(false);
          break;
        case 'birthControl':
          setBirthControl(false);
          break;
        case 'pill':
          setPill(false);
          break;
        case 'iud':
          setIud(false);
          break;
        case 'implant':
          setImplant(false);
          break;
        case 'doxyPep':
          setDoxyPep(false);
          break;
        case 'withdrawal':
          setWithdrawal(false);
          break;
        case 'none':
          setNone(false);
          break;
      }
    }
  };

  // Date and time picker handlers
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;

    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || time;

    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    setTime(currentTime);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (time: Date): string => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Select option for multiple choice
  const SelectOption = ({
    options,
    value,
    onSelect,
    label,
  }: {
    options: string[];
    value: string;
    onSelect: (value: string) => void;
    label: string;
  }) => {
    return (
      <View style={styles.selectContainer}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, value === option && styles.selectedOption]}
              onPress={() => onSelect(option)}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  value === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Validation
  const validateForm = (): boolean => {
    // Check basic validation
    if (!date || !time) {
      Alert.alert(
        'Missing Information',
        'Please select a date and time for this encounter.'
      );
      return false;
    }

    // Ensure at least one sex type is selected
    const sexTypeSelected =
      kissing ||
      oralSexGiving ||
      oralSexReceiving ||
      vaginalSexGiving ||
      vaginalSexReceiving ||
      analSexGiving ||
      analSexReceiving ||
      mutualMasturbation ||
      toyUse ||
      otherSex.trim() !== '';

    if (!sexTypeSelected) {
      Alert.alert(
        'Missing Information',
        'Please select at least one type of sexual activity.'
      );
      return false;
    }

    return true;
  };

  // Save the encounter log entry
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const formattedTime = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

      const newEntry: EncounterLogEntry = {
        id: Date.now().toString(),
        date: formattedDate,
        time: formattedTime,
        partnerName,
        partnerStiStatus: {
          status: partnerStiStatus,
          details:
            partnerStiStatus === 'Positive' ? partnerStiDetails : undefined,
        },
        protectionUsed: {
          condom,
          preP,
          pep,
          birthControl,
          pill,
          iud,
          implant,
          doxyPep,
          withdrawal,
          none,
        },
        protectionFailure,
        sexTypes: {
          kissing,
          oralSexGiving,
          oralSexReceiving,
          vaginalSexGiving,
          vaginalSexReceiving,
          analSexGiving,
          analSexReceiving,
          mutualMasturbation,
          toyUse,
          other: otherSex,
        },
        fluidsExchanged: {
          ejaculation,
          barrierExchange,
        },
        personalizedTestingReminder: testingReminder,
        discreetIcon,
        setPasscode,
        createdAt: new Date().toISOString(),
      };

      // Get existing logs
      const storedLogsString = await AsyncStorage.getItem(
        '@cocoon_encounter_logs'
      );
      let logs: EncounterLogEntry[] = storedLogsString
        ? JSON.parse(storedLogsString)
        : [];

      // Add new log
      logs.push(newEntry);

      // Save logs
      await AsyncStorage.setItem(
        '@cocoon_encounter_logs',
        JSON.stringify(logs)
      );

      // Check for risky behavior and offer additional resources
      checkForRiskyBehavior(newEntry);

      Alert.alert('Success', 'Your encounter has been logged successfully.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error saving encounter log:', error);
      Alert.alert(
        'Error',
        'Failed to save your encounter log. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Check for risky behavior and provide relevant alerts
  const checkForRiskyBehavior = (entry: EncounterLogEntry) => {
    // Check for unprotected sex
    const highRiskActivity =
      (entry.sexTypes.vaginalSexGiving ||
        entry.sexTypes.vaginalSexReceiving ||
        entry.sexTypes.analSexGiving ||
        entry.sexTypes.analSexReceiving) &&
      !entry.protectionUsed.condom &&
      !entry.protectionUsed.preP;

    // Check for broken protection
    const protectionFailure = entry.protectionFailure === 'Yes';

    // Check for ejaculation or fluid exchange
    const fluidExchange =
      entry.fluidsExchanged.ejaculation === 'Yes' ||
      entry.fluidsExchanged.barrierExchange === 'Yes';

    // Partner is positive
    const partnerPositive = entry.partnerStiStatus.status === 'Positive';

    // High risk encounter that might need PEP
    if (
      (highRiskActivity || protectionFailure) &&
      (fluidExchange || partnerPositive)
    ) {
      setTimeout(() => {
        Alert.alert(
          'Important Health Information',
          'This encounter may put you at risk for HIV. Post-exposure prophylaxis (PEP) can prevent HIV if started within 72 hours. Would you like information about PEP?',
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                // In a real app, you would navigate to a PEP information page
                Alert.alert(
                  'PEP Information',
                  'Post-exposure prophylaxis (PEP) is a medication that can prevent HIV infection after potential exposure. It must be started within 72 hours. Contact a healthcare provider or visit an emergency room as soon as possible.'
                );
              },
            },
          ]
        );
      }, 1000);
    }

    // Need for emergency contraception
    const needsEmergencyContraception =
      entry.sexTypes.vaginalSexReceiving &&
      !entry.protectionUsed.pill &&
      !entry.protectionUsed.iud &&
      !entry.protectionUsed.implant &&
      !entry.protectionUsed.birthControl &&
      (entry.protectionFailure === 'Yes' ||
        entry.protectionUsed.none ||
        entry.protectionUsed.withdrawal);

    if (needsEmergencyContraception) {
      setTimeout(() => {
        Alert.alert(
          'Pregnancy Prevention',
          'Based on your encounter, you might want to consider emergency contraception (like Plan B). Emergency contraception is most effective when taken within 72 hours. Would you like more information?',
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                // In a real app, you would navigate to emergency contraception info
                Alert.alert(
                  'Emergency Contraception',
                  'Emergency contraception can prevent pregnancy after unprotected sex. It works best when taken as soon as possible. You can get it at most pharmacies without a prescription.'
                );
              },
            },
          ]
        );
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style='dark' />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ThemedView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <ThemedText style={styles.backButtonText}>←</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.title}>Log Encounter</ThemedText>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size='small' color='white' />
              ) : (
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Basic Information */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                Basic Information
              </ThemedText>

              {/* Date & Time */}
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={showDatepicker}
                >
                  <ThemedText style={styles.dateTimeLabel}>Date</ThemedText>
                  <ThemedText style={styles.dateTimeValue}>
                    {formatDate(date)}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={showTimepicker}
                >
                  <ThemedText style={styles.dateTimeLabel}>Time</ThemedText>
                  <ThemedText style={styles.dateTimeValue}>
                    {formatTime(time)}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Show picker if active */}
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode='date'
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  style={styles.picker}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode='time'
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                  style={styles.picker}
                />
              )}

              {/* Partner Name */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>
                  Partner Name (Optional)
                </ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Enter partner's name"
                  value={partnerName}
                  onChangeText={setPartnerName}
                  placeholderTextColor='#aaa'
                />
              </View>

              {/* Partner STI Status */}
              <SelectOption
                label="Partner's STI Status (if known)"
                options={['Clean', 'Not sure', 'Positive']}
                value={partnerStiStatus}
                onSelect={(value) => setPartnerStiStatus(value as STIStatus)}
              />

              {/* Show details field if positive */}
              {partnerStiStatus === 'Positive' && (
                <View style={styles.inputContainer}>
                  <ThemedText style={styles.label}>STI Details</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder='Enter details (which STIs, etc.)'
                    value={partnerStiDetails}
                    onChangeText={setPartnerStiDetails}
                    placeholderTextColor='#aaa'
                    multiline
                  />
                </View>
              )}
            </View>

            {/* Protection Used */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                Protection Used
              </ThemedText>
              <ThemedText style={styles.sectionDescription}>
                Select all that apply
              </ThemedText>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>Condom</ThemedText>
                <Switch
                  value={condom}
                  onValueChange={(value) =>
                    handleProtectionChange('condom', value)
                  }
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={condom ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>PrEP</ThemedText>
                <Switch
                  value={preP}
                  onValueChange={(value) =>
                    handleProtectionChange('preP', value)
                  }
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={preP ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>PEP</ThemedText>
                <Switch
                  value={pep}
                  onValueChange={(value) =>
                    handleProtectionChange('pep', value)
                  }
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={pep ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Birth Control
                </ThemedText>
                <Switch
                  value={birthControl}
                  onValueChange={(value) =>
                    handleProtectionChange('birthControl', value)
                  }
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={birthControl ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>Pill</ThemedText>
                <Switch
                  value={pill}
                  onValueChange={(value) =>
                    handleProtectionChange('pill', value)
                  }
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={pill ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>IUD</ThemedText>
                <Switch
                  value={iud}
                  onValueChange={(value) =>
                    handleProtectionChange('iud', value)
                  }
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={iud ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>Implant</ThemedText>
                <Switch
                  value={implant}
                  onValueChange={(value) =>
                    handleProtectionChange('implant', value)
                  }
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={implant ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>Doxy PEP</ThemedText>
                <Switch
                  value={doxyPep}
                  onValueChange={(value) =>
                    handleProtectionChange('doxyPep', value)
                  }
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={doxyPep ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Withdrawal/Pull-out
                </ThemedText>
                <Switch
                  value={withdrawal}
                  onValueChange={(value) =>
                    handleProtectionChange('withdrawal', value)
                  }
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={withdrawal ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>None</ThemedText>
                <Switch
                  value={none}
                  onValueChange={(value) =>
                    handleProtectionChange('none', value)
                  }
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={none ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              {/* Protection Failure */}
              <SelectOption
                label='Did any protection fail or break?'
                options={['Yes', 'No', 'Not sure']}
                value={protectionFailure}
                onSelect={(value) =>
                  setProtectionFailure(value as YesNoNotSure)
                }
              />
            </View>

            {/* Sex Types */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Sex Types</ThemedText>
              <ThemedText style={styles.sectionDescription}>
                Select all that apply
              </ThemedText>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>Kissing</ThemedText>
                <Switch
                  value={kissing}
                  onValueChange={setKissing}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={kissing ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Oral Sex - Giving
                </ThemedText>
                <Switch
                  value={oralSexGiving}
                  onValueChange={setOralSexGiving}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={oralSexGiving ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Oral Sex - Receiving
                </ThemedText>
                <Switch
                  value={oralSexReceiving}
                  onValueChange={setOralSexReceiving}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={oralSexReceiving ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Vaginal Sex - Giving
                </ThemedText>
                <Switch
                  value={vaginalSexGiving}
                  onValueChange={setVaginalSexGiving}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={vaginalSexGiving ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Vaginal Sex - Receiving
                </ThemedText>
                <Switch
                  value={vaginalSexReceiving}
                  onValueChange={setVaginalSexReceiving}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={
                    vaginalSexReceiving ? Colors.light.tint : '#f4f3f4'
                  }
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Anal Sex - Giving
                </ThemedText>
                <Switch
                  value={analSexGiving}
                  onValueChange={setAnalSexGiving}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={analSexGiving ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Anal Sex - Receiving
                </ThemedText>
                <Switch
                  value={analSexReceiving}
                  onValueChange={setAnalSexReceiving}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={analSexReceiving ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Mutual Masturbation
                </ThemedText>
                <Switch
                  value={mutualMasturbation}
                  onValueChange={setMutualMasturbation}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={
                    mutualMasturbation ? Colors.light.tint : '#f4f3f4'
                  }
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>Toy Use</ThemedText>
                <Switch
                  value={toyUse}
                  onValueChange={setToyUse}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={toyUse ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              {/* Other Sex Types */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>
                  Other Sexual Activity
                </ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder='Describe other sexual activity (optional)'
                  value={otherSex}
                  onChangeText={setOtherSex}
                  placeholderTextColor='#aaa'
                  multiline
                />
              </View>
            </View>

            {/* Fluids Exchanged */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                Fluids Exchanged
              </ThemedText>

              <SelectOption
                label='Was there ejaculation inside you or your partner?'
                options={['Yes', 'No', 'Not sure']}
                value={ejaculation}
                onSelect={(value) => setEjaculation(value as YesNoNotSure)}
              />

              <SelectOption
                label='Were fluids exchanged without a barrier?'
                options={['Yes', 'No', 'Not sure']}
                value={barrierExchange}
                onSelect={(value) => setBarrierExchange(value as YesNoNotSure)}
              />
            </View>

            {/* Preferences */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

              <SelectOption
                label='Would you like personalized testing reminders?'
                options={['Monthly', 'Quarterly', 'No']}
                value={testingReminder}
                onSelect={(value) =>
                  setTestingReminder(value as ReminderOption)
                }
              />

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Use discreet app icon?
                </ThemedText>
                <Switch
                  value={discreetIcon}
                  onValueChange={setDiscreetIcon}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={discreetIcon ? Colors.light.tint : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Set passcode to protect data?
                </ThemedText>
                <Switch
                  value={setPasscode}
                  onValueChange={setSetPasscode}
                  trackColor={{
                    false: '#d1d1d1',
                    true: `${Colors.light.tint}80`,
                  }}
                  thumbColor={setPasscode ? Colors.light.tint : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Privacy Notice */}
            <View style={styles.privacyNotice}>
              <ThemedText style={styles.privacyText}>
                Your data is stored securely on your device only.
              </ThemedText>
            </View>

            {/* Bottom padding for scrolling */}
            <View style={{ height: 50 }} />
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cream,
  },
  container: {
    flex: 1,
    backgroundColor: cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: cream,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: forest,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: slate,
  },
  saveButton: {
    backgroundColor: dustyRose,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: forest,
  },
  sectionDescription: {
    fontSize: 14,
    color: slate,
    marginBottom: 16,
    opacity: 0.8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: slate,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    color: forest,
    fontWeight: '500',
  },
  picker: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: slate,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#333',
  },
  selectContainer: {
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  option: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: `${dustyRose}20`,
    borderColor: dustyRose,
  },
  optionText: {
    color: slate,
    fontSize: 14,
  },
  selectedOptionText: {
    color: dustyRose,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  switchLabel: {
    fontSize: 16,
    color: slate,
  },
  privacyNotice: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    backgroundColor: `${sage}40`,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: sage,
  },
  privacyText: {
    fontSize: 14,
    color: slate,
    textAlign: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});
