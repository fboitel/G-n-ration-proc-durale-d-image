# Projet Génération Procédurale

- [Sujet du projet](https://www.labri.fr/perso/renault/working/teaching/projets/2020-21-S6-Scheme-Procedural.php)
- [Page sur thor](https://thor.enseirb-matmeca.fr/ruby/projects/projetss6-proc)

## Scripts

### Développement

`npm run dev-web`

* construction de la version web en mode watch (rebuild à chaque modification)
* démarrage d'un serveur pour afficher le site à l'adresse [http://localhost:1234](http://localhost:1234)
* remplacement à chaud (pas besoin de recharger la page pour afficher les modifications)
* source maps disponibles (le navigateur a connaissance des fichiers TypeScript : les stack traces indiquent les numéros de lignes dans les fichiers TypeScript)

`npm run dev-node`

* construction de la version Node.js en mode watch (rebuild à chaque modification)
* possibilité de lancer la version Node.js avec `npm run run-node`

### Build

`npm run build-web`

* construction de la version web optimisée et minimisée
* fichiers disponibles dans `build/web`

`npm run build-node`

* construction de la version Node.js optimisée et minimisée
* fichiers disponibles dans `build/node`

### Exécution

`npm run run-node`

* lancement de la version Node.js
* source maps disponibles (Node.js a connaissance des fichiers TypeScript : les stack traces indiquent les numéros de lignes dans les fichiers TypeScript)

## Dépendances

| nom         | raison                                                                  |
| :---------- | :---------------------------------------------------------------------- |
| @babel/core | dépendance paire de parcel                                              |
| @types/node | définition de types permettant de développer pour Node.js en typescript |
| canvas      | implémentation de l'API canvas avec Node.js                             |
| parcel      | bundler permettant de générer une version Web et Node.js                |
| postcss     | dépendance paire de parcel                                              |
| typescript  | transpileur permettant de compiler le code source                       |
