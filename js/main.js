/**
 * Module principal de l'application
 * Initialise tous les composants nécessaires
 */
document.addEventListener('DOMContentLoaded', function () {
    // Initialise l'interface utilisateur
    UI.init();

    // Active l'entrée au clavier pour la conversion
    document.getElementById('from-value').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            UI.performConversion();
        }
    });

    // Par défaut, lance la conversion initiale si une valeur est présente
    const defaultValue = document.getElementById('from-value').value;
    if (defaultValue && !isNaN(parseFloat(defaultValue))) {
        UI.performConversion();
    }

    console.log('Application de conversion initialisée');
});