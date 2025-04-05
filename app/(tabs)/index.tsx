import { useEffect } from "react";
import { Redirect } from "expo-router";
// We'll use the onboarding context instead of AsyncStorage for this example
import { useOnboarding } from "@/app/context/onboarding-context";

export default function Index() {
  const { data } = useOnboarding();

  // Check if onboarding is completed
  const hasCompletedOnboarding = data.name !== "" && data.age !== null;

  // For development, you can force onboarding by setting this to false
  const forceOnboarding = true;

  // If onboarding is completed, redirect to main app
  // Otherwise, redirect to onboarding flow
  if (hasCompletedOnboarding && !forceOnboarding) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/onboarding/welcome" />;
  }
}
