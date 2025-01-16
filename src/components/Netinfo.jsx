import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { MotiView } from 'moti'; // Import de MotiView

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('');

  useEffect(() => {
    // Abonnez-vous aux changements de connexion
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Effectuer un nettoyage à la destruction du composant
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: isConnected ? 1.5 : 1 }} // Animation de mise à l'échelle
        transition={{
          type: 'timing', // Type de transition
          duration: 1000, // Durée de l'animation
          repeat: Infinity, // Répéter indéfiniment
          repeatReverse: true, // Inverser l'animation à chaque répétition
        }}
        style={[styles.dot, { backgroundColor: isConnected ? 'green' : 'red' }]} // Changez la couleur du dot selon l'état de la connexion
      >
        {isConnected ? (
          <Text style={styles.text}>{connectionType}</Text>
        ) : (
          <Text style={styles.text}>Déconnecté</Text>
        )}
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'lightgreen',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10, // Cercle
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});

export default NetworkStatus;
