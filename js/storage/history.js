const historyManager = {
    storageKey: 'conversion_history',

    getHistory() {
        const historyData = localStorage.getItem(this.storageKey);
        return historyData ? JSON.parse(historyData) : [];
    },

    addToHistory(conversion) {
        if (!conversion.type || !conversion.fromUnit || !conversion.toUnit ||
            conversion.fromValue === undefined || conversion.toValue === undefined) {
            throw new Error("Données de conversion incomplètes");
        }

        if (!conversion.timestamp) {
            conversion.timestamp = new Date().toISOString();
        }

        const history = this.getHistory();

        history.unshift(conversion);

        const limitedHistory = history.slice(0, 20);

        localStorage.setItem(this.storageKey, JSON.stringify(limitedHistory));

        return limitedHistory;
    },


    clearHistory() {
        localStorage.removeItem(this.storageKey);
        return [];
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = historyManager;
}