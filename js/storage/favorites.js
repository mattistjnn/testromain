const favoritesManager = {

    STORAGE_KEY: 'unit-converter-favorites',

    getFavorites() {
        const favoritesJSON = localStorage.getItem(this.STORAGE_KEY);
        return favoritesJSON ? JSON.parse(favoritesJSON) : [];
    },

    addFavorite(conversion) {
        const favorites = this.getFavorites();

        const exists = favorites.some(fav =>
            fav.type === conversion.type &&
            fav.fromUnit === conversion.fromUnit &&
            fav.toUnit === conversion.toUnit
        );

        if (exists) {
            return false;
        }

        favorites.push(conversion);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
        return true;
    },

    removeFavorite(index) {
        const favorites = this.getFavorites();

        if (index < 0 || index >= favorites.length) {
            return false;
        }

        favorites.splice(index, 1);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
        return true;
    },

    clearFavorites() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = favoritesManager;
}
