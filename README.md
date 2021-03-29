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

### Ça gosse
- Implanter un login
- Bug: pas possible de supprimer le premier node d'un dialogue

### Serait cool
- Permettre de naviguer avec les flèches haut/bas? pis Enter?
- Faire que le focus switch automatiquement au nouveau node quand il est créé
- Tweaker les couleurs pour éviter les couleurs très pâles
- Éviter de sauvegarder des versions identiques??
- Regrouper les versions par jour?
- Affichage en arborescence
- Créer une composante pour character + text, pour Node et BranchSelector pour l'instant, éventuellement pour un affichage en arborescence
- Afficher le ID des nodes on hover?
- Ne pas afficher la poubelle quand elle est vide

### Un mendné
- Flow conditionnel?? Stats??

### Pas clair
- Est-ce que le fait de ne pas pouvoir sauter vers un dialogue (ancien label) est un problème?
