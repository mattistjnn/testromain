/**
 * Module de gestion des favoris
 * Utilise localStorage pour enregistrer les conversions favorites
 */

const favoritesManager = {
    /**
     * Clé utilisée pour le stockage dans localStorage
     */
    STORAGE_KEY: 'unit-converter-favorites',

    /**
     * Récupère la liste des favoris depuis le localStorage
     * @returns {Array} - Liste des favoris
     */
    getFavorites() {
        const favoritesJSON = localStorage.getItem(this.STORAGE_KEY);
        return favoritesJSON ? JSON.parse(favoritesJSON) : [];
    },

    /**
     * Ajoute une conversion aux favoris
     * @param {Object} conversion - Objet contenant les détails de la conversion
     * @returns {boolean} - true si ajouté avec succès, false si déjà existant
     */
    addFavorite(conversion) {
        const favorites = this.getFavorites();

        // Vérifier si cette conversion existe déjà dans les favoris
        const exists = favorites.some(fav =>
            fav.type === conversion.type &&
            fav.fromUnit === conversion.fromUnit &&
            fav.toUnit === conversion.toUnit
        );

        if (exists) {
            return false;
        }

        // Ajouter aux favoris
        favorites.push(conversion);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
        return true;
    },

    /**
     * Supprime une conversion des favoris
     * @param {number} index - Index de la conversion à supprimer
     * @returns {boolean} - true si supprimé avec succès
     */
    removeFavorite(index) {
        const favorites = this.getFavorites();

        if (index < 0 || index >= favorites.length) {
            return false;
        }

        favorites.splice(index, 1);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
        return true;
    },

    /**
     * Supprime tous les favoris
     */
    clearFavorites() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
};

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = favoritesManager;
}
