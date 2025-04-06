import React, { useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

// Define the types for our encounter log entry
type STIStatus = 'Clean' | 'Not sure' | 'Positive';
type YesNoNotSure = 'Yes' | 'No' | 'Not sure';
type ReminderOption = 'Monthly' | 'Quarterly' | 'No';

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
}

const EncounterLogScreen: React.FC = () => {
  // Basic Information
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [partnerName, setPartnerName] = useState<string>('');
  const [partnerStiStatus, setPartnerStiStatus] = useState<STIStatus>('Clean');
  const [partnerStiDetails, setPartnerStiDetails] = useState<string>('');

  // Protection used (multi-select)
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
    useState<YesNoNotSure>('No');

  // Sex Type: which sexual activities occurred
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
  const [ejaculation, setEjaculation] = useState<YesNoNotSure>('No');
  const [barrierExchange, setBarrierExchange] = useState<YesNoNotSure>('No');

  // Reminders and preferences
  const [testingReminder, setTestingReminder] = useState<ReminderOption>('No');
  const [discreetIcon, setDiscreetIcon] = useState<boolean>(false);
  const [setPasscode, setSetPasscode] = useState<boolean>(false);

  // Function to save the encounter log entry using AsyncStorage
  const handleSave = async () => {
    const newEntry: EncounterLogEntry = {
      id: Date.now().toString(),
      date,
      time,
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
    };

    try {
      const storedLogs = await AsyncStorage.getItem('encounterLogs');
      const logs: EncounterLogEntry[] = storedLogs
        ? JSON.parse(storedLogs)
        : [];
      logs.push(newEntry);
      await AsyncStorage.setItem('encounterLogs', JSON.stringify(logs));
      Alert.alert('Success', 'Encounter logged successfully!');
      // Optionally, reset form fields here.
    } catch (error) {
      Alert.alert('Error', 'Failed to save the encounter log.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Encounter Log Entry</Text>

      {/* Basic Information */}
      <Text style={styles.subheader}>Basic Information</Text>
      <Text>Date:</Text>
      <TextInput
        style={styles.input}
        placeholder='YYYY-MM-DD'
        value={date}
        onChangeText={setDate}
      />
      <Text>Time:</Text>
      <TextInput
        style={styles.input}
        placeholder='HH:MM'
        value={time}
        onChangeText={setTime}
      />
      <Text>Partner Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Partner's name"
        value={partnerName}
        onChangeText={setPartnerName}
      />
      <Text>Partner STI Status:</Text>
      {/* For simplicity, using TextInput. Replace with Picker as needed */}
      <TextInput
        style={styles.input}
        placeholder='Clean | Not sure | Positive'
        value={partnerStiStatus}
        onChangeText={(text) => {
          // basic type check – in a full app you might use a proper picker component
          if (text === 'Clean' || text === 'Not sure' || text === 'Positive') {
            setPartnerStiStatus(text);
          }
        }}
      />
      {partnerStiStatus === 'Positive' && (
        <>
          <Text>STI Details:</Text>
          <TextInput
            style={styles.input}
            placeholder='Optional details'
            value={partnerStiDetails}
            onChangeText={setPartnerStiDetails}
          />
        </>
      )}

      {/* Protection */}
      <Text style={styles.subheader}>Protection Used</Text>
      <View style={styles.row}>
        <Text>Condom</Text>
        <Switch value={condom} onValueChange={setCondom} />
      </View>
      <View style={styles.row}>
        <Text>PrEP</Text>
        <Switch value={preP} onValueChange={setPreP} />
      </View>
      <View style={styles.row}>
        <Text>PEP</Text>
        <Switch value={pep} onValueChange={setPep} />
      </View>
      <View style={styles.row}>
        <Text>Birth Control</Text>
        <Switch value={birthControl} onValueChange={setBirthControl} />
      </View>
      <View style={styles.row}>
        <Text>Pill</Text>
        <Switch value={pill} onValueChange={setPill} />
      </View>
      <View style={styles.row}>
        <Text>IUD</Text>
        <Switch value={iud} onValueChange={setIud} />
      </View>
      <View style={styles.row}>
        <Text>Implant</Text>
        <Switch value={implant} onValueChange={setImplant} />
      </View>
      <View style={styles.row}>
        <Text>Doxy PEP</Text>
        <Switch value={doxyPep} onValueChange={setDoxyPep} />
      </View>
      <View style={styles.row}>
        <Text>Withdrawal/Pull-out</Text>
        <Switch value={withdrawal} onValueChange={setWithdrawal} />
      </View>
      <View style={styles.row}>
        <Text>None</Text>
        <Switch value={none} onValueChange={setNone} />
      </View>
      <Text>Did any protection fail or break? (Yes / No / Not sure)</Text>
      <TextInput
        style={styles.input}
        placeholder='Yes | No | Not sure'
        value={protectionFailure}
        onChangeText={(text) => {
          if (text === 'Yes' || text === 'No' || text === 'Not sure') {
            setProtectionFailure(text);
          }
        }}
      />

      {/* Sex Type */}
      <Text style={styles.subheader}>Sex Types</Text>
      <View style={styles.row}>
        <Text>Kissing</Text>
        <Switch value={kissing} onValueChange={setKissing} />
      </View>
      <Text>Oral Sex - Giving:</Text>
      <Switch value={oralSexGiving} onValueChange={setOralSexGiving} />
      <Text>Oral Sex - Receiving:</Text>
      <Switch value={oralSexReceiving} onValueChange={setOralSexReceiving} />
      <Text>Vaginal Sex - Giving:</Text>
      <Switch value={vaginalSexGiving} onValueChange={setVaginalSexGiving} />
      <Text>Vaginal Sex - Receiving:</Text>
      <Switch
        value={vaginalSexReceiving}
        onValueChange={setVaginalSexReceiving}
      />
      <Text>Anal Sex - Giving:</Text>
      <Switch value={analSexGiving} onValueChange={setAnalSexGiving} />
      <Text>Anal Sex - Receiving:</Text>
      <Switch value={analSexReceiving} onValueChange={setAnalSexReceiving} />
      <View style={styles.row}>
        <Text>Mutual Masturbation</Text>
        <Switch
          value={mutualMasturbation}
          onValueChange={setMutualMasturbation}
        />
      </View>
      <View style={styles.row}>
        <Text>Toy Use</Text>
        <Switch value={toyUse} onValueChange={setToyUse} />
      </View>
      <Text>Other (describe):</Text>
      <TextInput
        style={styles.input}
        placeholder='Other sexual activity'
        value={otherSex}
        onChangeText={setOtherSex}
      />

      {/* Fluids Exchanged */}
      <Text style={styles.subheader}>Fluids Exchanged</Text>
      <Text>
        Was there ejaculation inside you or your partner? (Yes / No / Not sure)
      </Text>
      <TextInput
        style={styles.input}
        placeholder='Yes | No | Not sure'
        value={ejaculation}
        onChangeText={(text) => {
          if (text === 'Yes' || text === 'No' || text === 'Not sure') {
            setEjaculation(text);
          }
        }}
      />
      <Text>
        Were fluids exchanged without a barrier? (Yes / No / Not sure)
      </Text>
      <TextInput
        style={styles.input}
        placeholder='Yes | No | Not sure'
        value={barrierExchange}
        onChangeText={(text) => {
          if (text === 'Yes' || text === 'No' || text === 'Not sure') {
            setBarrierExchange(text);
          }
        }}
      />

      {/* Reminders and Preferences */}
      <Text style={styles.subheader}>Preferences</Text>
      <Text>
        Would you like personalized testing reminders? (Monthly, Quarterly, No)
      </Text>
      <TextInput
        style={styles.input}
        placeholder='Monthly | Quarterly | No'
        value={testingReminder}
        onChangeText={(text) => {
          if (text === 'Monthly' || text === 'Quarterly' || text === 'No') {
            setTestingReminder(text);
          }
        }}
      />
      <View style={styles.row}>
        <Text>Discreet App Icon?</Text>
        <Switch value={discreetIcon} onValueChange={setDiscreetIcon} />
      </View>
      <View style={styles.row}>
        <Text>Set a passcode to protect your data?</Text>
        <Switch value={setPasscode} onValueChange={setSetPasscode} />
      </View>

      <Button title='Save Encounter' onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: '600',
  },
  subheader: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 6,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
});

export default EncounterLogScreen;
