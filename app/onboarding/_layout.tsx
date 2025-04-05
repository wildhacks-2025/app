import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name='welcome' />
      <Stack.Screen name='name' />
      <Stack.Screen name='age' />
      <Stack.Screen name='sex' />
      <Stack.Screen name='last-test' />
      <Stack.Screen name='chronic-condition-screen' />
      <Stack.Screen name='medications' />
      <Stack.Screen name='orientation' />
      <Stack.Screen name='complete' />
    </Stack>
  );
}
