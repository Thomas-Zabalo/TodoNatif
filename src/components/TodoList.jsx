import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TodoItem } from './TodoItems';
import { Ionicons } from 'react-native-vector-icons';
import { useTranslation } from 'react-i18next';

export function TodoList({ todo, onEdit, onDelete, onComplete, navigation, sortOnName, setModalVisible }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sort}>
          <Text style={styles.title}>{t('task')}</Text>
          <TouchableOpacity onPress={sortOnName} style={{ marginLeft: 15 }}>
            <Ionicons name="funnel" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name={"add-circle-outline"} size={32} color="#6EC5E9" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {todo.map((task, index) => {
          // Détermine les styles conditionnels
          const isFirst = index === 0; // Si c'est le premier élément
          const isLast = index === todo.length - 1; // Si c'est le dernier élément
          const singleItem = todo.length === 1; // Si c'est l'unique élément

          return (
            <TodoItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onComplete={onComplete}
              navigation={navigation}
              isFirst={isFirst}
              isLast={isLast}
              singleItem={singleItem}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  sort: {
    display: 'flex',
    flexDirection: 'row',
  }
});
