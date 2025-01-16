import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox'; // Pour la case à cocher
import { Ionicons } from 'react-native-vector-icons'; // Icône de modification
import { TodoContext } from '../context/TodosContext';
import { useTranslation } from 'react-i18next';

export function FinishItems({ finishedTasks, onTasksUpdated }) {
    const { t } = useTranslation();

    const [editing, setEditing] = useState(false); // Pour activer/désactiver le mode édition
    const [selectedTasks, setSelectedTasks] = useState([]); // Suivi des tâches sélectionnées pour suppression
    const { deleteTask } = useContext(TodoContext);

    // Toggle de la case à cocher pour la suppression
    const toggleSelection = (taskId) => {
        setSelectedTasks(prevSelected => {
            if (prevSelected.includes(taskId)) {
                return prevSelected.filter(id => id !== taskId); // Supprime de la sélection
            } else {
                return [...prevSelected, taskId]; // Ajoute à la sélection
            }
        });
    };

    // Fonction pour supprimer les tâches sélectionnées
    const deleteSelectedTasks = async () => {
        try {
            for (const taskId of selectedTasks) {
                // Utilisation de deleteTask du contexte
                await deleteTask(taskId);
            }
            onTasksUpdated(); // Met à jour la liste des tâches après la suppression
            setSelectedTasks([]); // Réinitialise les tâches sélectionnées
        } catch (error) {
            console.error("Erreur lors de la suppression des tâches:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('task')}</Text>
                <TouchableOpacity onPress={() => setEditing(!editing)}>
                    <Ionicons name={editing ? "checkmark-circle" : "create"} size={32} color="#6EC5E9" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {finishedTasks.length === 0 ? (
                    // Si aucune tâche n'est présente
                    <Text style={styles.noTasksText}>{t('nonetask')}</Text>
                ) : (
                    finishedTasks.map((task, index) => {
                        const isFirst = index === 0; // Si c'est le premier élément
                        const isLast = index === finishedTasks.length - 1; // Si c'est le dernier élément
                        const singleItem = finishedTasks.length === 1; // Si c'est l'unique élément

                        return (
                            <View
                                key={task.id}
                                style={[
                                    styles.itemContainer,
                                    singleItem && styles.singleItem, // Bordures arrondies si un seul élément
                                    isFirst && !singleItem && styles.firstItem, // Bordures arrondies en haut si premier élément
                                    isLast && !singleItem && styles.lastItem, // Bordures arrondies en bas si dernier élément
                                ]}
                            >
                                {editing ? (
                                    <Checkbox
                                        value={selectedTasks.includes(task.id)} // Vérifie si cette tâche est sélectionnée
                                        onValueChange={() => toggleSelection(task.id)}
                                        color="red"
                                        style={styles.checkbox}
                                    />
                                ) : null}
                                <Text>{task.titre}</Text>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {editing && selectedTasks.length > 0 && (
                <TouchableOpacity style={styles.deleteButton} onPress={deleteSelectedTasks}>
                    <Text style={styles.deleteButtonText}>Supprimer les tâches sélectionnées</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    itemContainer: {
        padding: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    firstItem: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    lastItem: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    singleItem: {
        borderRadius: 10,
    },
    checkbox: {
        marginRight: 10,
        height: 20,
        width: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
    },
    deleteButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    noTasksText: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
});
