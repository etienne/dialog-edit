# dialog-edit

A rudimentary tool to create and edit branching dialogs.

## Installation

```
npm install
```
## Usage

```
npm run dev
php -S localhost:5000 -t api/
```
## Tests

```
npm run test:watch
```

## Todo

- **Bug:** des fois on peut pas créer un choix d'options
- Gérer le cas où on efface un node ayant plusieurs parents (i.e. je veux juste l'enlever à une place)
- Permettre de naviguer avec les flèches haut/bas? pis Enter?
- Faire que le focus switch automatiquement au nouveau node quand il est créé
- Jump vers le prochain label au lieu de l'inclure inline?
- Tweaker les couleurs pour éviter les couleurs très pâles
- Flow conditionnel?? Stats??
- Éviter de sauvegarder des versions identiques??
