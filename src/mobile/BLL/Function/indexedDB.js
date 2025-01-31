

// export default function TextAreaWithDrfatState({idTextarea, contentInput, setContentInput}) {
    // const dbName = 'DraftDB';
    // const storeName = 'drafts';

    // Открываем или создаем базу данных
    export const openDB = (dbName, storeName) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    };

    // Сохраняем черновик в IndexedDB
    export const saveDraft = async (dbName, storeName, idTextarea, content) => {
        const db = await openDB(dbName, storeName);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put({ id: idTextarea, content });

        request.onsuccess = () => {
            console.log('Draft saved successfully');
        };

        request.onerror = (event) => {
            console.error('Error saving draft:', event.target.error);
        };
    };

    // Загружаем черновик из IndexedDB
    export const loadDraft = async (dbName, storeName, idTextarea, setContentInput) => {
        const db = await openDB(dbName, storeName);
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(idTextarea);

        request.onsuccess = (event) => {
            const draft = event.target.result;
            if (draft) {
                setContentInput(draft.content);
            }
        };

        request.onerror = (event) => {
            console.error('Error loading draft:', event.target.error);
        };
    };

    export const deleteDraft = async (dbName, storeName, idTextarea,) => {
        const db = await openDB(dbName, storeName);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(idTextarea);

        request.onsuccess = () => {
            console.log('Draft deleted successfully');
        };

        request.onerror = (event) => {
            console.error('Error deleting draft:', event.target.error);
        };
    };

    // Загружаем черновик при монтировании компонента
    // useEffect(() => {
    //     loadDraft();
    // }, []);

    // Сохраняем черновик при изменении текста
    // useEffect(() => {
    //     saveDraft(contentInput);
    // }, [contentInput]);

    // return (
    //     <textarea
    //     className={classes.textarea}
    //         id={idTextarea}
    //         value={contentInput}
    //         onChange={(e) => setContentInput(e.target.value)}
    //     />
    // );

