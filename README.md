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

## Deploy

```
mina deploy
```

## Todo

- **Bug:** des fois on peut pas créer un choix d'options
- Gérer le cas où on efface un node ayant plusieurs parents (i.e. je veux juste l'enlever à une place) -> peut-être faire une poubelle avec les nodes orphelines, et ne jamais vraiment effacer un node, juste déconnecter de son parent
- Permettre de naviguer avec les flèches haut/bas? pis Enter?
- Faire que le focus switch automatiquement au nouveau node quand il est créé
- Tweaker les couleurs pour éviter les couleurs très pâles
- Flow conditionnel?? Stats??
- Éviter de sauvegarder des versions identiques??
- Est-ce que le fait de ne pas pouvoir sauter vers une branche (ancien label) est un problème?
- Regrouper les versions par jour?
- Créer une composante pour character + text, pour Node et ChoiceSelector pour l'instant, éventuellement pour un affichage en arborescence