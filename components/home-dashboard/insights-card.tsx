import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const InsightCard = ({ title, backgroundColor, icon, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

const InsightsCards = ({ onCardPress }) => {
  const cards = [
    {
      id: 'symptoms',
      title: 'Log your symptoms',
      backgroundColor: '#FFFFFF',
      icon: <Ionicons name='add-circle' size={40} color='#FF6B8B' />,
    },
    {
      id: 'sex-info',
      title: 'Peeing after sex: The facts',
      backgroundColor: '#F0E68C',
      icon: (
        <View style={styles.checkXContainer}>
          <Ionicons name='checkmark-circle' size={20} color='green' />
          <Ionicons name='close-circle' size={20} color='red' />
        </View>
      ),
    },
    {
      id: 'pms',
      title: 'PMS or pregnancy?',
      backgroundColor: '#FFB6C1',
      icon: (
        <View style={styles.foodIcon}>
          <Text style={{ fontSize: 24 }}>🍫</Text>
          <Text style={{ fontSize: 24 }}>🍦</Text>
        </View>
      ),
    },
    {
      id: 'sti-info',
      title: 'STI symptoms to watch for',
      backgroundColor: '#ADD8E6',
      icon: <Ionicons name='alert-circle-outline' size={30} color='#333' />,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>My daily insights · Today</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {cards.map((card) => (
          <InsightCard
            key={card.id}
            title={card.title}
            backgroundColor={card.backgroundColor}
            icon={card.icon}
            onPress={() => onCardPress(card.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  cardsContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  card: {
    width: 170,
    height: 220,
    marginRight: 10,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  checkXContainer: {
    flexDirection: 'row',
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodIcon: {
    flexDirection: 'row',
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default InsightsCards;
