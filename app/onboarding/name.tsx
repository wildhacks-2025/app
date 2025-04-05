import React, { useState } from 'react';

import { Alert, StyleSheet, TextInput, View } from 'react-native';

import { useOnboarding } from '../context/onboarding-context';
import OnboardingScreen from './onboarding-screen';

export default function NameScreen() {
  const { data, updateData } = useOnboarding();
  const [name, setName] = useState(data.name);

  const validateAndProceed = () => {
    if (!name || name.trim() === '') {
      Alert.alert('Please enter your name');
      return false;
    }

    updateData({ name: name.trim() });
    return true;
  };

  return (
    <OnboardingScreen
      title="What's your name?"
      description="We'll use this to personalize your experience."
      nextScreen='/onboarding/age'
      onNext={validateAndProceed}
    >
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder='Enter your name'
          value={name}
          onChangeText={setName}
          autoFocus
          maxLength={50}
        />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    marginVertical: 20,
  },
  input: {
    fontSize: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
