import React, { useEffect, useState } from 'react'; // N'oubliez pas d'ajouter useState
import { StatusBar, StyleSheet, View } from 'react-native';
import {FinishItems} from '../components/FinishItems'; // Importer FinishItems
import { getId } from '../utils/LocalStorage';
import axios from 'axios';

export default function FinishedTasksScreen() {
  // Définir l'état pour les tâches terminées
  const [finishedTasks, setFinishedTasks] = useState([]);

  const [userId, setUserId] = useState(null); // Définir l'état de userId

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchTasks = async () => {
        try {
          const response = await axios.get(`https://zabalo.alwaysdata.net/todoapp/index.php/taskscomplete/${userId}&complete=true`);
          setFinishedTasks(response.data); // Mettre à jour les tâches terminées
        } catch (error) {
          console.error('Erreur lors de la récupération des tâches:', error);
        }
      };

      fetchTasks(); // Appel de la fonction pour récupérer les tâches terminées
    }
  }, );

  const refreshTasks = async () => {
    if (userId) {
      const response = await axios.get(`https://zabalo.alwaysdata.net/todoapp/index.php/taskscomplete/${userId}&complete=true`);
      setFinishedTasks(response.data); // Mettre à jour les tâches
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle="dark-content"
        showHideTransition="slide"
        hidden="visible"
      />
      {/* Passez finishedTasks à FinishItems pour afficher les tâches terminées */}
      <FinishItems finishedTasks={finishedTasks} onTasksUpdated={refreshTasks} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: "15%",
  },
});
