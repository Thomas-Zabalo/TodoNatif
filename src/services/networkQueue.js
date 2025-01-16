import AsyncStorage from '@react-native-async-storage/async-storage';

class NetworkQueue {
    static QUEUE_KEY = '@networkQueue';

    // Ajout d'une action dans la file
    static async addAction(action) {
        const queue = await NetworkQueue.getQueue();
        const isDuplicate = queue.some(
            (queuedAction) =>
                queuedAction.type === action.type &&
                JSON.stringify(queuedAction.payload) === JSON.stringify(action.payload)
        );

        if (!isDuplicate) {
            queue.push(action);
            await AsyncStorage.setItem(NetworkQueue.QUEUE_KEY, JSON.stringify(queue));
        } else {
            console.log('Action déjà présente dans la file:', action);
        }
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
            console.log('Exécution de l\'action:', action);

            if (action.type === 'ADD') {
                // Appel API pour ajouter
                await axios.post('https://zabalo.alwaysdata.net/todoapp/index.php/tasks', action.payload);
            } else if (action.type === 'UPDATE') {
                // Appel API pour mettre à jour
                await axios.put(`https://zabalo.alwaysdata.net/todoapp/index.php/tasks/${action.payload.id}`, action.payload);
            } else if (action.type === 'DELETE') {
                // Appel API pour supprimer
                await axios.delete(`https://zabalo.alwaysdata.net/todoapp/index.php/tasks/${action.payload.id}`);
            }

            // Supprime l'action réussie de la file
            const queue = await NetworkQueue.getQueue();
            const filteredQueue = queue.filter(item => item !== action);
            await AsyncStorage.setItem(NetworkQueue.QUEUE_KEY, JSON.stringify(filteredQueue));
        } catch (error) {
            console.error('Erreur lors de l\'exécution de l\'action:', error);
            // Si une erreur survient, garde l'action dans la file
        }
    }
}

export default NetworkQueue;
