/**
 * Module de gestion de l'historique des conversions
 * Utilise localStorage pour la persistance des données
 */
const historyManager = {
    // Clé utilisée pour le stockage dans localStorage
    storageKey: 'conversion_history',

    /**
     * Récupère l'historique complet depuis localStorage
     * @returns {Array} - Liste des conversions enregistrées
     */
    getHistory() {
        const historyData = localStorage.getItem(this.storageKey);
        return historyData ? JSON.parse(historyData) : [];
    },

    /**
     * Ajoute une conversion à l'historique
     * @param {Object} conversion - Objet contenant les détails de la conversion
     * @param {string} conversion.type - Type de conversion (longueur, température, etc.)
     * @param {string} conversion.fromUnit - Unité source
     * @param {number} conversion.fromValue - Valeur source
     * @param {string} conversion.toUnit - Unité cible
     * @param {number} conversion.toValue - Valeur convertie
     * @param {string} conversion.timestamp - Horodatage de la conversion
     */
    addToHistory(conversion) {
        // Vérification que tous les paramètres requis sont présents
        if (!conversion.type || !conversion.fromUnit || !conversion.toUnit ||
            conversion.fromValue === undefined || conversion.toValue === undefined) {
            throw new Error("Données de conversion incomplètes");
        }

        // Ajout d'un horodatage si non fourni
        if (!conversion.timestamp) {
            conversion.timestamp = new Date().toISOString();
        }

        // Récupération de l'historique existant
        const history = this.getHistory();

        // Ajout de la nouvelle conversion au début de l'historique (plus récente en premier)
        history.unshift(conversion);

        // Limiter l'historique à 20 entrées pour éviter de surcharger le localStorage
        const limitedHistory = history.slice(0, 20);

        // Sauvegarde dans localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(limitedHistory));

        return limitedHistory;
    },

    /**
     * Efface tout l'historique des conversions
     */
    clearHistory() {
        localStorage.removeItem(this.storageKey);
        return [];
    }
};

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = historyManager;
}