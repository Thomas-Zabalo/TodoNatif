import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import i18n from '../i18n/i18n';
import { getLang, setLang } from '../utils/LocalStorage';

export default function LangagePref() {
    const [lang, setLangState] = useState(i18n.language); // Default language set to the initial value from i18n

    useEffect(() => {
        // Fetch the saved language from AsyncStorage on component mount
        const fetchLang = async () => {
            const storedLang = await getLang();
            if (storedLang) {
                i18n.changeLanguage(storedLang); // Change the language if there's a saved preference
                setLangState(storedLang); // Update the state
            }
        };

        fetchLang(); // Fetch and set language when the component mounts
    }, []);

    // Function to toggle the language
    const toggleLanguage = async () => {
        const newLang = lang === "fr" ? "en" : "fr"; // Toggle between French and English
        setLangState(newLang); // Update state
        i18n.changeLanguage(newLang); // Change language in i18n
        await setLang(newLang); // Save the new language in AsyncStorage
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleLanguage}>
                <Text style={{ fontSize: 24 }}>
                    {lang === "fr" ? '🇫🇷' : '🇬🇧'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
    }
});
