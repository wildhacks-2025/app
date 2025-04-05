import React, { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useOnboarding } from '../context/onboarding-context';
import OnboardingScreen from './onboarding-screen';

type Orientation =
  | 'straight'
  | 'gay'
  | 'lesbian'
  | 'bisexual'
  | 'pansexual'
  | 'asexual'
  | 'other'
  | 'prefer-not-to-say';

const orientationOptions: { label: string; value: Orientation }[] = [
  { label: 'Straight', value: 'straight' },
  { label: 'Gay', value: 'gay' },
  { label: 'Lesbian', value: 'lesbian' },
  { label: 'Bisexual', value: 'bisexual' },
  { label: 'Pansexual', value: 'pansexual' },
  { label: 'Asexual', value: 'asexual' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
];

export default function OrientationScreen() {
  const { data, updateData } = useOnboarding();
  const [selectedOrientation, setSelectedOrientation] =
    useState<Orientation | null>(data.orientation);

  const validateAndProceed = () => {
    if (!selectedOrientation) {
      Alert.alert('Please select an option');
      return false;
    }

    updateData({ orientation: selectedOrientation });
    return true;
  };

  return (
    <OnboardingScreen
      title="What's your sexual orientation?"
      description='This helps us provide relevant resources and information.'
      nextScreen='/onboarding/complete'
      onNext={validateAndProceed}
    >
      <View style={styles.optionsContainer}>
        {orientationOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              selectedOrientation === option.value && styles.selectedOption,
            ]}
            onPress={() => setSelectedOrientation(option.value)}
          >
            <ThemedText
              style={[
                styles.optionText,
                selectedOrientation === option.value &&
                  styles.selectedOptionText,
              ]}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    marginVertical: 20,
  },
  option: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  selectedOption: {
    borderColor: Colors.light.tint,
    backgroundColor: `${Colors.light.tint}15`,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: '600',
    color: Colors.light.tint,
  },
});
