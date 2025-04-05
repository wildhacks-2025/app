import React, { createContext, useContext, useState, ReactNode } from "react";

type Sex = "male" | "female" | "non-binary" | "other" | "prefer-not-to-say";
type Orientation =
  | "straight"
  | "gay"
  | "lesbian"
  | "bisexual"
  | "pansexual"
  | "asexual"
  | "other"
  | "prefer-not-to-say";

export interface OnboardingData {
  name: string;
  age: number | null;
  sex: Sex | null;
  lastTestedDate: Date | null;
  medications: string[];
  orientation: Orientation | null;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
}

const initialData: OnboardingData = {
  name: "",
  age: null,
  sex: null,
  lastTestedDate: null,
  medications: [],
  orientation: null,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
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
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
