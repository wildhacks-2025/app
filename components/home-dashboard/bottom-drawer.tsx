import React, { ReactNode, useEffect, useRef } from 'react';

import { Animated, StyleSheet, View } from 'react-native';

type BottomDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number;
  backgroundColor?: string;
};

/**
 * A reusable bottom drawer component that slides up from the bottom of the screen
 */
export default function BottomDrawer({
  isOpen,
  onClose,
  children,
  height = height * 0.9,
  backgroundColor = '#fff',
}: BottomDrawerProps) {
  const drawerAnim = useRef(new Animated.Value(height)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(drawerAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(drawerAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, drawerAnim, overlayAnim, height]);

  if (!isOpen) return null;

  return (
    <>
      <Animated.View
        style={[styles.overlay, { opacity: overlayAnim }]}
        onTouchStart={onClose}
      />
      <Animated.View
        style={[
          styles.drawer,
          {
            height,
            backgroundColor,
            transform: [{ translateY: drawerAnim }],
          },
        ]}
      >
        <View style={styles.drawerHandle} />
        {children}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  drawerHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#999',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
