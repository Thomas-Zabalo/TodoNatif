import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Text, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { setToken, setId } from '../utils/LocalStorage';
import axios from 'axios';

function ConnexionScreen({ navigation }) {
  // États pour l'email, le mot de passe et les erreurs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour envoyer la requête de connexion
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs !");
      return;
    }

    setIsLoading(true);
    axios.post('https://zabalo.alwaysdata.net/todoapp/index.php/login', {
      email: email,
      password: password,
    })
      .then((response) => {
        if (response.data.error) {
          Alert.alert('Erreur', response.data.error);
        } else {
          setToken(response.data.user_token);
          setId(response.data.user_id);
          navigation.replace('Accueil');
        }
      })
      .catch((error) => {
        Alert.alert('Erreur', 'Problème de connexion au serveur');
      })
      .finally(() => {
        setIsLoading(false);
      });
    // Vider les champs après la connexion
    setEmail('');
    setPassword('');
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
      <Text style={styles.title}>Se connecter</Text>

      {/* Champ Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none" // Pour éviter la mise en majuscule automatique de l'email
      />

      {/* Champ Mot de passe */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {/* Bouton pour soumettre le formulaire */}
      <Button
        title={isLoading ? 'Chargement...' : 'Se connecter'}
        onPress={handleLogin}
        disabled={isLoading} // Désactive le bouton pendant le chargement
      />

      {/* Affichage de l'indicateur de chargement */}
      {isLoading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loadingIndicator: {
    marginTop: 15,
  },
});

export default ConnexionScreen;
