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

- Permettre de naviguer avec les flèches haut/bas? pis Enter?
- Faire que le focus switch automatiquement au nouveau node quand il est créé
- Tweaker les couleurs pour éviter les couleurs très pâles
- Flow conditionnel?? Stats??
- Éviter de sauvegarder des versions identiques??
- Est-ce que le fait de ne pas pouvoir sauter vers une branche (ancien label) est un problème?
- Regrouper les versions par jour?
- Créer une composante pour character + text, pour Node et ChoiceSelector pour l'instant, éventuellement pour un affichage en arborescence
- Affichage en arborescence
- Afficher le ID des nodes on hover?
- Bug: pas possible de supprimer le premier node d'une branche
- Ne pas afficher la poubelle quand elle est vide
