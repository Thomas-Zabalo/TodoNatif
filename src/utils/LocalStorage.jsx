import AsyncStorage from '@react-native-async-storage/async-storage';

// Fonction pour stocker un token
export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Erreur lors du stockage du token utilisateur :', error);
  }
};

export const setId = async (id) => {
  try {
    await AsyncStorage.setItem('id', id.toString());
  } catch (error) {
    console.error('Erreur lors du stockage de id utilisateur :', error);
  }
};

export const setPref = async (pref) => {
  try {
    await AsyncStorage.setItem('pref', pref);
  }
  catch (error) {
    console.error('Erreur lors du stockage de la préférence :', error);
  }
};

export const setLang = async (lang) => {
  try {
    await AsyncStorage.setItem('lang', lang);
  }
  catch (error) {
    console.error('Erreur lors du stockage de la préférence de la langue :', error);
  }
};

// Fonction pour récupérer un token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      return token;
    }
  } catch (e) {
    console.error('Erreur lors de la récupération du token', e);
  }
};

export const getId = async () => {
  try {
    const id = await AsyncStorage.getItem('id');
    if (id !== null) {
      return id;
    }
  } catch (e) {
    console.error('Erreur lors de la récupération de id', e);
  }
};

export const getPref = async () => {
  try {
    const pref = await AsyncStorage.getItem('pref');
    if (pref !== null) {
      return pref;
    }
  }
  catch (error) {
    console.error('Erreur lors de la récupération de la préférence :', error);
  }
};

export const getLang = async () => {
  try {
    const lang = await AsyncStorage.getItem('lang');
    if (lang !== null) {
      return lang;
    }
  }
  catch (error) {
    console.error('Erreur lors de la récupération de la préférence de la langue:', error);
  }
};

