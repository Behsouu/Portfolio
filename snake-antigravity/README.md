# Snake Antigravity 🐍

Mini-projet recréant le mythique jeu Snake, développé purement en HTML5, CSS et JavaScript sans aucune dépendance, dans l'optique d'être intégré à un portfolio comme preuve de concept.

## 🌟 Fonctionnalités et Points Techniques

- **Moteur de jeu "maison" :** Boucle de jeu (Game Loop) basée sur `requestAnimationFrame` garantissant une fluidité optimale en synchronisation avec le taux de rafraîchissement de l'écran, avec gestion de `delta time` pour les 3 types de vitesses.
- **Rendu Canvas :** Dessin performant des éléments graphiques (serpent, grille, fruit) exclusivement via l'API Canvas 2D.
- **Paramétrable :** 
  - Mode Classique (Les murs causent un Game Over)
  - Mode Pacman (Wrap-around : passer à travers l'écran)
  - Différentes vitesses d'exécution.
- **Responsive & Mobile Friendly :** Le code recalcule dynamiquement la taille des cellules du jeu en fonction de la taille de l'écran local. Déplacements supportés via pavé directionnel mobile (D-Pad) et événements de type "Swipes".
- **Générateur Audio :** Les effets sonores sont générés mathématiquement via la fonction `AudioContext` de l'API Web Audio native du navigateur, permettant d'avoir de l'audio "bip retro" sans nécessiter le moindre chargement de fichier externe .mp3 ou .wav.
- **Haute intégration :** Reprend les codes couleurs "Beige / Terracotta" du Portfolio.

## 🚀 Comment Lancer

Absolument aucun Setup requis (Zéro backend). Double-cliquez simplement sur `index.html` ou ouvrez-le dans le navigateur de votre choix.

## 📝 Technologies

- **HTML5 :** Pour l'utilisation de `<canvas>`.
- **CSS :** Layouts structurés, thèmes sombres/clairs via variables locales et boutons de contrôles adaptés mobile.
- **JavaScript (ES6) :** Logique de collisions, Storage local, Algorithmes de matrices (tableaux).
