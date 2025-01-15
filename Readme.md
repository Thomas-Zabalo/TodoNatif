```markdown
# Todo App

## Description
Cette application permet de gérer des tâches (ou "todos") avec des filtres basés sur des catégories et des priorités. Les utilisateurs peuvent se connecter, ajouter des tâches, marquer des tâches comme complètes et filtrer les tâches par catégorie et priorité. De plus, l'application permet de visualiser les détails des tâches et de modifier ou supprimer les tâches terminées.

L'application est construite avec React Native et communique avec une API pour récupérer, ajouter et gérer les tâches ainsi que les catégories et priorités associées.

## Utilisation
L'application fonctionne en utilisant un contexte (`TodoContext`) pour gérer l'état global des tâches. Voici les principales interactions dans l'application :

### Se connecter
- Utilisez les identifiants de connexion suivants pour accéder à l'application :
  - Email : `thomas.zabalo@etu.iut-tlse3.fr`
  - Mot de passe : `userpassword`

### Tâches en cours
- Dès que vous ouvrez l'application, vous êtes redirigé vers l'écran principal où vous pouvez voir toutes vos tâches à faire.
- Vous pouvez trier les tâches par catégorie et priorité.

### Ajouter une tâche
- Pour ajouter une nouvelle tâche, appuyez sur le bouton "+" situé en bas à droite de l'écran.
- Entrez un nom, sélectionnez une catégorie et une priorité, puis appuyez sur "Ajouter".

### Marquer une tâche comme complète
- En cochant une tâche, celle-ci sera déplacée vers la page "Tâches Terminées".

### Page "Tâches Terminées"
- Affiche les tâches terminées.
- Vous pouvez modifier ou supprimer ces tâches en appuyant sur le bouton "Modifier".


Il se peut que quelque bug survienne à cause du picker
```