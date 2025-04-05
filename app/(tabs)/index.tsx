import { Redirect } from "expo-router";
// We'll use the onboarding context instead of AsyncStorage for this example
import { useOnboarding } from "@/app/context/onboarding-context";

export default function Index() {
  const { data } = useOnboarding();

  // Check if onboarding is completed
  const hasCompletedOnboarding = data.name !== "" && data.age !== null;

  // Setting forceOnboarding to false to allow navigation to main app after completing onboarding
  const forceOnboarding = false;

  console.log("hasCompletedOnboarding", hasCompletedOnboarding);
  if (hasCompletedOnboarding && !forceOnboarding) {
    console.log("here1");
    // No need to redirect if we're already in the tabs
    return null;
  } else {
    console.log("here2");
    return <Redirect href="/onboarding/welcome" />;
  }
}
