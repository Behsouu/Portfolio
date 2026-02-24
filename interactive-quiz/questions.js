const quizQuestions = [
    {
        id: 1,
        category: "Mélange Web",
        difficulty: "Easy",
        question: "Que signifie l'acronyme HTML ?",
        choices: [
            "HyperText Markup Language",
            "HighText Machine Language",
            "HyperLoop Machine Language",
            "Helicopters Terminals Motorboats Lamborghinis"
        ],
        answerIndex: 0,
        explanation: "HTML (HyperText Markup Language) est le langage de balisage conçu pour représenter les pages web."
    },
    {
        id: 2,
        category: "Mélange Web",
        difficulty: "Easy",
        question: "Quelle propriété CSS est utilisée pour changer la couleur de fond ?",
        choices: ["color", "bgcolor", "background-color", "bg-color"],
        answerIndex: 2,
        explanation: "La propriété background-color définit la couleur de fond d'un élément HTML."
    },
    {
        id: 3,
        category: "Mélange Web",
        difficulty: "Easy",
        question: "Quel balise est utilisée pour insérer du JavaScript dans une page HTML ?",
        choices: ["<javascript>", "<scripting>", "<js>", "<script>"],
        answerIndex: 3,
        explanation: "La balise <script> est utilisée pour intégrer le code exécutable ou les données d'un script en HTML."
    },
    {
        id: 4,
        category: "Mélange Web",
        difficulty: "Medium",
        question: "En JavaScript, quel sera le résultat de : '5' + 3 ?",
        choices: ["8", "53", "Erreur", "NaN"],
        answerIndex: 1,
        explanation: "En JavaScript, le signe '+' avec une string fait une concaténation. Donc '5' (string) + 3 (nombre converti en string) donne '53'."
    },
    {
        id: 5,
        category: "Mélange Web",
        difficulty: "Medium",
        question: "Que signifie l'acronyme CSS ?",
        choices: [
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Creative Style Sheets",
            "Colorful Style Sheets"
        ],
        answerIndex: 1,
        explanation: "CSS signifie 'Cascading Style Sheets' (Feuilles de style en cascade)."
    },
    {
        id: 6,
        category: "Mélange Web",
        difficulty: "Medium",
        question: "Comment déclare-t-on une variable qui ne peut pas être réaffectée en JS (ES6) ?",
        choices: ["var", "let", "const", "static"],
        answerIndex: 2,
        explanation: "Le mot-clé `const` crée une référence en lecture seule vers une valeur. Elle ne peut pas être réassignée."
    },
    {
        id: 7,
        category: "Mélange Web",
        difficulty: "Hard",
        question: "Quelle méthode HTTP est qualifiée d'idempotente ?",
        choices: ["POST", "PUT", "PATCH", "Aucune des trois"],
        answerIndex: 1,
        explanation: "La méthode PUT est idempotente : une requête répétée aura toujours le même effet (remplacer la ressource), contrairement à POST."
    },
    {
        id: 8,
        category: "Mélange Web",
        difficulty: "Hard",
        question: "Quel est l'avantage principal du SSR (Server-Side Rendering) ?",
        choices: [
            "Une exécution JavaScript plus rapide sur le client",
            "Une consommation mémoire réduite côté backend",
            "Un meilleur référencement SEO initial et un FCP (First Contentful Paint) rapide",
            "Une réduction des requêtes HTTP"
        ],
        answerIndex: 2,
        explanation: "Le SSR envoie le HTML entièrement construit au navigateur, ce qui est très utile pour le SEO et l'affichage initial, sans attendre que le JS client s'exécute."
    },
    {
        id: 9,
        category: "JavaScript",
        difficulty: "Medium",
        question: "Que retourne 'typeof null' en JavaScript ?",
        choices: ["null", "undefined", "object", "string"],
        answerIndex: 2,
        explanation: "C'est un bug historique bien connu de JavaScript. L'opérateur typeof sur null retourne 'object'."
    },
    {
        id: 10,
        category: "JavaScript",
        difficulty: "Easy",
        question: "Combien d'éléments contient ce tableau : `[1, 2,, 4]` ?",
        choices: ["3", "4", "5", "Erreur de syntaxe"],
        answerIndex: 1,
        explanation: "Le tableau contient 4 éléments, mais le 3ème élément (à l'index 2) sera 'undefined' (un élément vide, ou trou)."
    }
];
