import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from 'axios';

export function TodoItem({ task, onEdit, onDelete, onComplete, navigation, isFirst, isLast, singleItem }) {
  const [isSelected, setIsSelected] = useState(task.complete === 1); // Initialiser l'état avec la valeur de 'task.complete'
  // Utiliser useEffect pour écouter les changements de la tâche complète et mettre à jour l'état
  useEffect(() => {
    setIsSelected(task.complete === 1); // Mettre à jour isSelected quand 'task.complete' change
  }, [task.complete]); // Cette dépendance garantit que la checkbox se met à jour quand 'task.complete' change

  const handleSelect = async () => {
    try {
      // Appel de l'API pour mettre à jour le statut de la tâche
      const response = await axios.put(`https://zabalo.alwaysdata.net/todoapp/index.php/taskscomplete/${task.id}`);
      const data = response.data;
      if (response.status === 200) {
        setIsSelected(!isSelected);
        task.complete = data.complete;
      } else {
        console.error("Erreur lors de la mise à jour de la tâche:", data.error);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour la tâche.");
    }

    // Changer l'état local après la mise à jour
    setIsSelected(!isSelected); // Inverser la sélection après le clic
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Details', { task, onDelete, onEdit });
      }}
    >
      <View
        style={[
          styles.itemContainer,
          singleItem && styles.singleItem, // Bordures arrondies si un seul élément
          isFirst && !singleItem && styles.firstItem, // Bordures arrondies en haut si premier élément
          isLast && !singleItem && styles.lastItem, // Bordures arrondies en bas si dernier élément
          isSelected && styles.selectedItem, // Changement de couleur si sélectionné
        ]}
      >
        <View style={styles.leftSection}>
          <Checkbox
            value={isSelected} // Utiliser l'état local pour le checkbox
            onValueChange={handleSelect} // Déclenche la mise à jour de la tâche
            style={styles.checkbox}
            color="#6EC5E9"
          />
          <Text style={[styles.taskText, isSelected && styles.completedText]}>
            {task.titre}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#fff', // Couleur de fond par défaut
  },
  singleItem: {
    borderRadius: 10,
    borderColor: 'white',
  },
  firstItem: {
    borderTopLeftRadius: 10, // Bordure arrondie en haut à gauche
    borderTopRightRadius: 10, // Bordure arrondie en haut à droite
    borderColor: 'white',
  },
  lastItem: {
    borderBottomLeftRadius: 10, // Bordure arrondie en bas à gauche
    borderBottomRightRadius: 10, // Bordure arrondie en bas à droite
    borderColor: 'white',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
    height: 20,
    width: 20,
    borderColor: '#6EC5E9',
    borderWidth: 1,
    borderRadius: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  detailsButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
