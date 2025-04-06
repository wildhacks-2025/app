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

type TestResult = 'positive' | 'negative' | "not-sure'";

type ContraceptiveMethod =
  | 'pill'
  | 'iud'
  | 'implant'
  | 'ring'
  | 'shot'
  | 'condom'
  | 'withdrawal'
  | 'none';

export interface ProfileData {
  name: string;
  age: number | null;
  sex: Sex | null;
  orientation: Orientation | null;
  lastTestedDate: Date | null;
  testResult: TestResult | null;
  knownSTIs: string[];
  contraceptives: ContraceptiveMethod[];
  vaccinatedFor: {
    hpv: boolean;
    hepA: boolean;
    hepB: boolean;
    monkeypox: boolean;
  };
  partnersLast3Months: number | null;
  protectionConsistency: 'always' | 'sometimes' | 'never' | null;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  resetProfile: () => void;
}

const initialProfile: ProfileData = {
  name: '',
  age: null,
  sex: null,
  orientation: null,
  lastTestedDate: null,
  testResult: null,
  knownSTIs: [],
  contraceptives: [],
  vaccinatedFor: {
    hpv: false,
    hepA: false,
    hepB: false,
    monkeypox: false,
  },
  partnersLast3Months: null,
  protectionConsistency: null,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setProfile(initialProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
