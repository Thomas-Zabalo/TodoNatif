import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, TextInput, Button, View, Modal, Text, StatusBar } from 'react-native';
import { TodoList } from '../components/TodoList';
import { Picker } from '@react-native-picker/picker';
import { TodoContext } from '../context/TodosContext';
import { getId, setPref } from '../utils/LocalStorage';

export default function HomeScreen({ navigation }) {
  const {
    todo,
    categories,
    priorities,
    fetchTasks,
    handleAddTodo,
    toggleTaskCompletion,
    updateTasks
  } = useContext(TodoContext);

  const [newName, setNewName] = useState(''); // Nouveau nom de tâche
  const [modalVisible, setModalVisible] = useState(false); // État de la modal
  const [newCategory, setNewCategory] = useState(null); // Nouvelle catégorie
  const [newPriority, setNewPriority] = useState(null); // Nouvelle priorité
  const [categoryFilter, setCategoryFilter] = useState('All'); // Filtre de catégorie
  const [priorityFilter, setPriorityFilter] = useState('All'); // Filtre de priorité
  const [userId, setUserId] = useState(null); // ID de l'utilisateur
  const [ascendingSort, setAscendingSort] = useState(true); // État de tri ascendant
  const [pref, setPrefState] = useState(null); // État de préférence de tri

  // Filtrage des tâches par catégorie et priorité
  const filteredTasks = todo.filter((task) => {
    const matchesCategory = categoryFilter === 'All' || task.categorie_id === categoryFilter; // Vérifie si la catégorie correspond
    const matchesPriority = priorityFilter === 'All' || task.importance_id === priorityFilter; // Vérifie si la priorité correspond
    return matchesCategory && matchesPriority; // Retourne les tâches qui correspondent aux filtres
  });

  const sortOnName = async () => {
    const newPref = pref === "asc" ? "desc" : "asc"; // Détermine la préférence de tri
    await setPref(newPref); // Enregistre la préférence de tri
    setPrefState(newPref); // Met à jour l'état de préférence
    setAscendingSort((prevState) => !prevState);  // Inverse l'état de tri
  };

  const sortedTasks = [...todo].sort((a, b) => {
    if (pref === "asc") {
      return a.titre.localeCompare(b.titre);  // Tri ascendant
    } else {
      return b.titre.localeCompare(a.titre);  // Tri descendant
    }
  });

  const handleAdd = async () => {
    // Vérifie si newPriority et newCategory sont bien définis
    if (!newPriority || !newCategory) {
      alert("Catégorie et priorité sont nécessaires.");
      return;
    }

    // Appel à handleAddTodo en envoyant les IDs appropriés
    const success = await handleAddTodo(newName, newCategory, newPriority);
    if (success) {
      fetchTasks(); // Rafraîchir la liste des tâches
      setModalVisible(false);
      setNewName('');
      setNewCategory(null);
      setNewPriority(null);
    }
  };

  // Charger l'ID utilisateur
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Charger les préférences de tri
  useEffect(() => {
    let url = `https://zabalo.alwaysdata.net/todoapp/index.php/tasks/${userId}?`;
    if (categoryFilter !== 'All') {
      url += `category_id=${categoryFilter}&`;
    }
    if (priorityFilter !== 'All') {
      url += `importance_id=${priorityFilter}&`;
    }
    if (url.endsWith('&')) {
      url = url.slice(0, -1);
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        updateTasks(data);  // Met à jour les tâches dans le contexte
      })
      .catch((error) => {
        console.error('Erreur de chargement des tâches:', error);
      });
  }, [categoryFilter, priorityFilter, userId, updateTasks]);


  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle="dark-content"
        showHideTransition="slide"
        hidden="visible"
      />
      <TodoList
        todo={sortedTasks}
        onComplete={toggleTaskCompletion}
        navigation={navigation}
        sortOnName={sortOnName}
        setModalVisible={setModalVisible}
        ascendingSort={ascendingSort}
      />

      <View style={styles.filterContainer}>
        <Picker
          selectedValue={categoryFilter}
          style={styles.picker}
          onValueChange={(value) => {
            setCategoryFilter(value);

          }}
        >
          <Picker.Item label="Catégories" value="All" />
          {categories.map((category) => (
            <Picker.Item key={category.id} label={category.nom} value={category.id} />
          ))}
        </Picker>

        <Picker
          selectedValue={priorityFilter}
          style={styles.picker}
          onValueChange={(value) => {
            setPriorityFilter(value);

          }}
        >
          <Picker.Item label="Priorités" value="All" />
          {priorities.map((priority) => (
            <Picker.Item key={priority.id} label={priority.nom} value={priority.id} />
          ))}
        </Picker>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.modalTitle}>Ajouter une tâche</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de la tâche"
              value={newName}
              onChangeText={setNewName}
            />
            <Picker
              selectedValue={newCategory || ''}
              style={styles.pickermodal}
              onValueChange={(value) => setNewCategory(value)}
            >
              <Picker.Item label="Sélectionner une catégorie" value="" />
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.nom} value={category.id} />
              ))}
            </Picker>

            <Picker
              selectedValue={newPriority || ''}
              style={styles.pickermodal}
              onValueChange={(value) => setNewPriority(value)}
            >
              <Picker.Item label="Sélectionner une priorité" value="" />
              {priorities.map((priority) => (
                <Picker.Item key={priority.id} label={priority.nom} value={priority.id} />
              ))}
            </Picker>

            <View style={styles.modalButtons}>
              <Button title="Annuler" color="red" onPress={() => setModalVisible(false)} />
              <Button title="Ajouter" onPress={handleAdd} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: "15%",
  },
  filterContainer: {
    flexDirection: 'row', // Pour disposer les pickers horizontalement
    justifyContent: 'space-between', // Espacer les pickers
    padding: "5%",
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    width: '50%',  // Ajuste la largeur de chaque picker
  },
  pickermodal: {
    width: '100%',  // Ajuste la largeur de chaque picker
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#EBC450',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalTitle: {
    // fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    color: '#000',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
