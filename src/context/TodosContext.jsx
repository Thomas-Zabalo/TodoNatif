import React, { createContext, useState, useEffect } from 'react';
import { Alert, ActivityIndicator, View, StyleSheet } from 'react-native';
import { getId } from '../utils/LocalStorage';
import axios from 'axios';

export const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [loader, setLoader] = useState(false);
  const [todo, setTodo] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [userId, setUserId] = useState(null);

  // Charger l'ID utilisateur
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getId();
        setUserId(id);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
      }
    };
    fetchUserId();
  }, []);

  // Charger les tâches pour l'utilisateur
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  // Charger les catégories et priorités
  useEffect(() => {
    fetchCategories();
    fetchPriorities();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoader(true)
      const response = await axios.get(`https://zabalo.alwaysdata.net/todoapp/index.php/tasks/${userId}`)
      setTimeout(() => {
        setTodo(response.data); // Mettre à jour les tâches
        setLoader(false); // Désactiver le loader après le délai
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches :', error);
      setLoader(false); // Désactiver le loader en cas d'erreur
      Alert.alert('Erreur', 'Impossible de charger les tâches.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://zabalo.alwaysdata.net/todoapp/index.php/categorie');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      Alert.alert('Erreur', 'Impossible de charger les catégories.');
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await axios.get('https://zabalo.alwaysdata.net/todoapp/index.php/importance');
      setPriorities(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des priorités :', error);
      Alert.alert('Erreur', 'Impossible de charger les priorités.');
    }
  };

  const handleAddTodo = async (newName, newCategory, newPriority) => {
    if (!newName || !newCategory || !newPriority) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    try {
      await axios.post('https://zabalo.alwaysdata.net/todoapp/index.php/tasks', {
        titre: newName,
        complete: false,
        user_id: userId,
        importance_id: newPriority,
        categorie_id: newCategory,
      });
      fetchTasks();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la tâche.');
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const reponse = await axios.put(`https://zabalo.alwaysdata.net/todoapp/index.php/taskscomplete/${taskId}`)
      const updatedTask = reponse.data
      setTodo((prevTodo) =>
        prevTodo.map((task) =>
          task.id === taskId ? { ...task, complete: updatedTask.complete } : task
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la tâche.');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`https://zabalo.alwaysdata.net/todoapp/index.php/tasks/${taskId}`)
      fetchTasks();
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      Alert.alert('Erreur', 'Impossible de supprimer la tâche.');
    }
  }

  if (loader) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <TodoContext.Provider
      value={{
        todo,
        categories,
        priorities,
        fetchTasks,
        handleAddTodo,
        toggleTaskCompletion,
        deleteTask,
        updateTasks: setTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});