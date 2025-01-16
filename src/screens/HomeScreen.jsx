import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, TextInput, Button, View, Modal, Text, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { TodoList } from '../components/TodoList';
import { Picker } from '@react-native-picker/picker';
import { TodoContext } from '../context/TodosContext';
import { getId, setPref } from '../utils/LocalStorage';
import NetworkStatus from '../components/NetinfoDot';
import LangagePref from '../components/LangagePref';
import { useTranslation } from 'react-i18next';


export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();


  const {
    fetchLimit,
    setFetchLimit,
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

  const tasksToDisplay = fetchLimit ? todo.slice(0, 5) : todo;

  // Filtrage des tâches par catégorie et priorité
  const filteredTasks = tasksToDisplay.filter((task) => {
    const matchesCategory = categoryFilter === 'All' || task.categorie_id === categoryFilter; // Vérifie si la catégorie correspond
    const matchesPriority = priorityFilter === 'All' || task.importance_id === priorityFilter; // Vérifie si la priorité correspond
    return matchesCategory && matchesPriority; // Retourne les tâches qui correspondent aux filtres
  });


  // Tri des tâches après filtrage et limitation
  const sortedTasks = [...tasksToDisplay].sort((a, b) => {
    if (pref === "asc") {
      return a.titre.localeCompare(b.titre);  // Tri ascendant (par titre)
    } else {
      return b.titre.localeCompare(a.titre);  // Tri descendant (par titre)
    }
  });

  const sortOnName = async () => {
    const newPref = pref === "asc" ? "desc" : "asc"; // Détermine la préférence de tri
    await setPref(newPref); // Enregistre la préférence de tri
    setPrefState(newPref); // Met à jour l'état de préférence
    setAscendingSort((prevState) => !prevState);  // Inverse l'état de tri
  };

  const handleAdd = async () => {
    // Vérifie si newPriority et newCategory sont bien définis
    if (!newPriority || !newCategory) {
      alert("Catégorie et priorité sont nécessaires.");
      return;
    }

    // Appel à handleAddTodo en envoyant les IDs appropriés
    const success = await handleAddTodo(newName, newCategory, newPriority);
    if (success) {
      fetchTasks();
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

  function OnChangeLimit() {
    setFetchLimit((prevState) => !prevState); // Alterner l'état fetchLimit
  }

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle="dark-content"
        showHideTransition="slide"
        hidden="visible"
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <LangagePref />
        <NetworkStatus />
      </View>

      <TodoList
        todo={sortedTasks}
        onComplete={toggleTaskCompletion}
        navigation={navigation}
        sortOnName={sortOnName}
        setModalVisible={setModalVisible}
        ascendingSort={ascendingSort}
      />

      {todo.length > 5 && (
        <View style={styles.alltasks}>
          <TouchableOpacity onPress={OnChangeLimit}>
            <Text style={{ color: 'blue' }}>
              {fetchLimit ? t('more') : t('less')}
            </Text>
          </TouchableOpacity>
        </View>
      )}


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
        backdropColor="transparent"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, {
          backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.8)'
        }]}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{t('addtask')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('nametask')}
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
              <Button title={t('cancel')} color="red" onPress={() => setModalVisible(false)} />
              <Button title={t('add')} onPress={handleAdd} />
            </View>
          </View>
        </View>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: "15%",
  },
  alltasks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    padding: 20,
    backgroundColor: '#000000',
    borderRadius: 10,
    elevation: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
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
