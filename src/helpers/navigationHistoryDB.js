// helpers/navigationHistoryDB.js
class NavigationHistoryDB {
    constructor() {
        this.dbName = 'NavigationHistoryDB';
        this.storeName = 'navigation_history';
        this.version = 1;
        this.db = null;
        this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'sectionKey' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async savePath(sectionKey, path) {
        await this.ensureDBReady();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const record = {
                sectionKey,
                path,
                timestamp: Date.now()
            };

            const request = store.put(record);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getPath(sectionKey) {
        await this.ensureDBReady();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            
            const request = store.get(sectionKey);

            request.onsuccess = () => {
                resolve(request.result?.path || null);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getAllHistory() {
        await this.ensureDBReady();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async ensureDBReady() {
        if (!this.db) {
            await this.initDB();
        }
    }
}

// Синглтон экземпляр
const navigationHistoryDB = new NavigationHistoryDB();
export default navigationHistoryDB;