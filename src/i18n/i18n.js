import i18n from "i18next";
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    home: "Home",
                    details: "Details",
                    finish: "Finish Tasks",
                    nonetask: "No complete task",
                    task: "My tasks",
                    more: "See more",
                    less: "See less",
                    nametask: "Name of the task",
                    deletetask: "Delete selected tasks",
                    addtask: "Add task",
                    add: "Add",
                    cancel: "Cancel",
                },
            },
            fr: {
                translation: {
                    home: "Accueil",
                    details: "Détails",
                    finish: "Tâches terminées",
                    nonetask: "Aucune tâche complète",
                    task: "Mes tâches",
                    more: "Voir plus",
                    less: "Voir moins",
                    nametask: "Nom de la tâche",
                    deletetask: "Supprimer les tâches sélectionnées",
                    addtask: "Ajouter une tâche",
                    add: "Ajouter",
                    cancel: "Annuler",
                },
            },
        },
        lng: "fr", // Langue par défaut
        fallbackLng: "en", // Langue de secours si une traduction est manquante
        interpolation: {
            escapeValue: false, // Pas nécessaire pour React Native
        },
    });

export default i18n;
