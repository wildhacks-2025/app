import React, { ReactNode, createContext, useContext, useState } from 'react';

type Sex = 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';
type Orientation =
  | 'straight'
  | 'gay'
  | 'lesbian'
  | 'bisexual'
  | 'pansexual'
  | 'asexual'
  | 'other'
  | 'prefer-not-to-say';

export type TestHistory = {
  [testName: string]: {
    date: Date;
    result: string;
  };
};

export interface OnboardingData {
  name: string;
  age: number | null;
  sex: Sex | null;
  lastTestedDate: Date | null;
  medications: string[];
  orientation: Orientation | null;
  testHistory?: TestHistory;
  stiTestsReceived?: string[];
  chronicConditions?: string[];
  otherConditionDetails?: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
}

const initialData: OnboardingData = {
  name: '',
  age: null,
  sex: null,
  lastTestedDate: null,
  medications: [],
  orientation: null,
  testHistory: {},
  stiTestsReceived: [],
  chronicConditions: [],
  otherConditionDetails: '',
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prevData) => ({ ...prevData, ...updates }));
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
