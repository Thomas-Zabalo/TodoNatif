import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import * as Progress from 'react-native-progress';

export default function TaskDetailScreen({ route }) {
  const { task } = route.params;
  const [progress, setProgress] = useState(0); // Initialisation à 0

  useEffect(() => {
    // Réinitialise la progression à 0 à chaque changement de tâche
    setProgress(0);

    // Détermine la progression cible (1 pour complet, 0.6 sinon)
    const targetProgress = task.complete ? 1 : 0.6;
    const step = 0.02; // Incrément pour chaque étape
    const intervalTime = 16; // Fréquence de mise à jour (16 ms pour une fluidité à ~60 fps)

    // Animation incrémentielle
    let animation = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= targetProgress) {
          clearInterval(animation); // Arrête l'animation à la cible
          return targetProgress;
        }
        return prev + step;
      });
    }, intervalTime);

    // Nettoyage de l'intervalle si la tâche change ou si le composant se démonte
    return () => clearInterval(animation);
  }, [task.id]); // Déclenche l'effet à chaque changement de tâche

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle="dark-content"
        showHideTransition="slide"
      />
      <View style={styles.detail}>
        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.Titre}>{task.titre}</Text>
            <Progress.Pie
              animated={false} // Désactivation de l'animation native car nous la gérons manuellement
              progress={progress} // Progression contrôlée localement
              size={20}
              color={task.complete ? "#008000" : "#FFA500"} // Couleur dynamique
            />
          </View>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Catégorie:</Text> {task.categorie_nom}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Priorité:</Text> {task.importance_nom}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: '5%',
    paddingHorizontal: 20,
  },
  detail: {
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  Titre: {
    fontSize: 24,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
});
