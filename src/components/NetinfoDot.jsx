import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { MotiView } from 'moti'; // Import de MotiView
import { Easing } from 'react-native-reanimated'; // Import de Easing

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
    <View>
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 1, scale: 0.2 }}
          animate={{ opacity: 0.5, scale: isConnected ? 2.5 : 1 }}
          transition={{
            type: 'timing',
            duration: 2000,
            easing: Easing.out(Easing.ease),
            repeat: Infinity,
            repeatReverse: true,
          }}
          style={[styles.dot, { backgroundColor: isConnected ? 'lightgreen' : 'red' }]} // Correction du style
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10, // Cercle
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});

export default NetworkStatus;
