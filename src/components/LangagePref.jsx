import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import i18n from '../i18n/i18n';

export default function LangagePref() {
    const [lang, setLang] = useState(i18n.language); // Langue initiale provenant de i18n
   
    function toggleLanguage() {
        const newLang = lang === "fr" ? "en" : "fr";
        setLang(newLang);
        i18n.changeLanguage(newLang); // Met à jour la langue de i18n
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleLanguage}>
                <Text style={{ fontSize: 24 }}>{lang === "fr" ? '🇫🇷' : '🇬🇧'}</Text>
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
