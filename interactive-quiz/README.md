# Quiz Interactif 🧠

Un quiz interactif simple, moderne et rapide, conçu pour être facilement intégré dans n'importe quel portfolio ou site web personnel afin de démontrer des compétences en développement Frontend pur.

## 🌟 Fonctionnalités Principales

- **Développement 100% Vanille :** Aucun framework ni bibliothèque (ni React, ni Tailwind). Du HTML sémantique, du CSS moderne (Variables, Flexbox) et du JavaScript ES6+.
- **UX/UI Soignée :** Mode sombre / clair persistant via `localStorage`, transitions fluides et animations de validation des réponses.
- **Paramétrable :** Choix de la catégorie, de la difficulté et bascule de chronomètre optionnel.
- **Score et Résumé :** Sauvegarde du "High score" en local, et récapitulatif détaillé à la fin de la partie.
- **Accessible (A11y) :** Focus visible au clavier, structure ARIA respectée, `aria-live` pour indiquer aux lecteurs d'écran quand le temps est écoulé ou quand une réponse est validée.

## 🛠️ Principes Appliqués

1. **KISS & YAGNI :** Le code est concis et direct. Aucune complication inutile, une seule boucle logique.
2. **DRY :** Les fonctions utilitaires (comme `switchScreen`, `announceToScreenReader`, `shuffleArray`) évitent la duplication de code.
3. **Clean Code :** Les noms de variables sont en anglais et explicites, et chaque fonction possède des responsabilités limitées.

## 🚀 Comment le lancer ?

Ce projet ne dépend d'aucun backend. 
- Ouvrez simplement le fichier `index.html` dans n'importe quel navigateur moderne (Chrome, Firefox, Safari, Edge).

## 🔌 Intégration Portfolio

Deux méthodes idéales :
1. **Lien direct :** Ajoutez un projet dans votre portfolio pointant vers `interactive-quiz/index.html`.
2. **Iframe :** Intégrez le quiz directement au sein de votre site web pour permettre aux utilisateurs de tester le module sans quitter votre page :
```html
<iframe src="interactive-quiz/index.html" width="100%" height="600" style="border:none; border-radius:12px;"></iframe>
```
Pensez simplement à vérifier son affichage sur mobile !

---

_Créé pour démontrer les compétences côté Frontend et le respect des bonnes pratiques de Clean Code._
