/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// New color palette
export const cream = '#DDD5D0'; // Light cream
export const dustyRose = '#CFC0BD'; // Dusty rose
export const sage = '#B8B8AA'; // Sage green
export const forest = '#7F9183'; // Forest green
export const slate = '#586F6B'; // Slate gray

const tintColorLight = forest;
const tintColorDark = cream;

export const Colors = {
  light: {
    text: slate,
    background: cream,
    tint: tintColorLight,
    icon: dustyRose,
    tabIconDefault: sage,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: cream,
    background: slate,
    tint: tintColorDark,
    icon: dustyRose,
    tabIconDefault: sage,
    tabIconSelected: tintColorDark,
  },
};
