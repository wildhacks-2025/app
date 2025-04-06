import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, TouchableOpacity } from 'react-native';

type DashboardItemProps = {
  title: string;
  onPress?: () => void;
  style?: any;
  textStyle?: any;
};

export default function DashboardItem({
  title,
  onPress,
  style,
  textStyle,
}: DashboardItemProps) {
  return (
    <TouchableOpacity
      style={[styles.dashboardItem, style]}
      onPress={onPress}
      disabled={!onPress}
    >
      <ThemedText style={[styles.itemText, textStyle]}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dashboardItem: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
});
