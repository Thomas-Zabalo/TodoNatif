import AsyncStorage from '@react-native-async-storage/async-storage';

class NetworkQueue {
    static QUEUE_KEY = '@networkQueue';

    // Ajout d'une action dans la file
    static async addAction(action) {
        const queue = await NetworkQueue.getQueue();
        queue.push(action);
        await AsyncStorage.setItem(NetworkQueue.QUEUE_KEY, JSON.stringify(queue));
    }

    // Récupération de la file
    static async getQueue() {
        const queue = await AsyncStorage.getItem(NetworkQueue.QUEUE_KEY);
        return queue ? JSON.parse(queue) : [];
    }

    // Exécution des actions quand la connexion est rétablie
    static async executeActions() {
        const queue = await NetworkQueue.getQueue();

        if (queue.length > 0) {
            for (let action of queue) {
                await NetworkQueue.executeAction(action); // Exécute l'action
            }

            // Une fois toutes les actions exécutées, on vide la file
            await AsyncStorage.removeItem(NetworkQueue.QUEUE_KEY);
        }
    }

    // Simule l'exécution de l'action (par exemple, ajout/modification/suppression d'une tâche)
    static async executeAction(action) {
        try {
            // Vous pouvez remplacer cette partie par un appel à l'API pour effectuer l'opération
            console.log('Exécution de l\'action:', action);
            // Par exemple, pour une action d'ajout de tâche
            if (action.type === 'ADD') {
                // Exemple : await api.addTask(action.payload);
            } else if (action.type === 'UPDATE') {
                // Exemple : await api.updateTask(action.payload);
            } else if (action.type === 'DELETE') {
                // Exemple : await api.deleteTask(action.payload);
            }

            // Si l'action réussie, vous pouvez supprimer cette action de la file
            const queue = await NetworkQueue.getQueue();
            const filteredQueue = queue.filter(item => item !== action);
            await AsyncStorage.setItem(NetworkQueue.QUEUE_KEY, JSON.stringify(filteredQueue));

        } catch (error) {
            console.error('Erreur lors de l\'exécution de l\'action:', error);
        }
    }
}

export default NetworkQueue;
