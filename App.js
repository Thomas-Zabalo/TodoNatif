import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getToken } from './src/utils/LocalStorage';
import { TodoProvider } from './src/context/TodosContext';
import { Ionicons } from 'react-native-vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import FinishedTasksScreen from './src/screens/FinishTaskScreen';
import ConnexionScreen from './src/screens/ConnexionScreen';
import TaskDetailScreen from './src/screens/DetailsScreen';
import { useTranslation } from 'react-i18next';
import './src/i18n/i18n';  // Importing the i18n configuration

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  const { t } = useTranslation(); // Calling useTranslation hook here to access 't'

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={t('home')} // Dynamically set the name using translation
        component={HomeScreen}
        options={{
          headerLeft: null,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={t('taskDetail')} // Dynamically set the name for task details screen
        component={TaskDetailScreen}
        options={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { t } = useTranslation(); // Calling useTranslation hook here to access 't'

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: t('home'), // Dynamically set the tab label using translation
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="CompletedTasks"
        component={FinishedTasksScreen}
        options={{
          title: t('finish'), // Dynamically set the tab label using translation
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-done" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifier le token lors du démarrage
  useEffect(() => {
    getToken().then((token) => {
      setIsLoggedIn(token);
    });
  }, []);

  return (
    <TodoProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <AppNavigator />
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Connexion"
              component={ConnexionScreen}
              options={{ title: 'Connexion', headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="Accueil"
              component={AppNavigator} // Votre navigation principale
              options={{ headerShown: false, gestureEnabled: false }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </TodoProvider>
  );
}
