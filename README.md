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

## Todo

- Permettre de naviguer avec les flèches haut/bas? pis Enter?
- Faire que le focus switch automatiquement au nouveau node quand il est créé
- Tweaker les couleurs pour éviter les couleurs très pâles
- Jump vers le prochain label au lieu de l'inclure inline?
- Permettre de browser les versions??
  -> api pour obtenir la liste des versions
  -> api pour loader une version précise (mais ça va overwrite whatever qui est actuellement là, p-ê un problème)
- Remplacer "parent" par "then"??