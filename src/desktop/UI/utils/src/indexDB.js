const dbName = "ControlPanelDB";

// Функция для получения текущей версии базы данных
const getCurrentDBVersion = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const version = db.version;
      db.close(); // Закрываем соединение
      resolve(version || 0); // Если база данных не существует, версия будет 0
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Функция для инициализации базы данных
export const initDB = async (orgName) => {
  try {
    const currentVersion = await getCurrentDBVersion();
    const newVersion = currentVersion + 1;
  
    const request = indexedDB.open(dbName, newVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Создаём объектное хранилище для каждой организации
      if (!db.objectStoreNames.contains(orgName)) {
        db.createObjectStore(orgName, { keyPath: "id" }); // "id" будет ключом
      }
    };

    request.onerror = (event) => {
      console.error("Ошибка инициализации базы данных:", event.target.error);
    };

    return request;
  } catch (error) {
    console.error("Ошибка при получении текущей версии базы данных:", error);
    throw error;
  }
};

export const loadFromIndexedDB = async (orgName, callback) => {
  try {
    const request = await initDB(orgName); // Ожидаем завершения initDB

    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(orgName, "readonly");
      const store = transaction.objectStore(orgName);

      const getRequest = store.getAll();

      getRequest.onsuccess = () => {
        callback(getRequest.result || []);
      };

      getRequest.onerror = (event) => {
        console.error("Ошибка чтения из IndexedDB:", event.target.errorCode);
      };
    };

    request.onerror = (event) => {
      console.error("Ошибка при открытии базы данных:", event.target.error);
    };
  } catch (error) {
    console.error("Ошибка в loadFromIndexedDB:", error);
  }
};

export const saveToIndexedDB = async (orgName, dataArray, activeId) => {
  try {
    const request = await initDB(orgName);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const db = event.target.result;

        // Создаем транзакцию для конкретного хранилища
        const transaction = db.transaction(orgName, "readwrite");
        const store = transaction.objectStore(orgName);

        // Очищаем хранилище перед записью новых данных
        const clearRequest = store.clear();

        clearRequest.onsuccess = () => {
          // Добавляем каждый объект из массива
          dataArray.forEach((item) => {
            const newItem = {
              ...item,
              isActive: item.id === activeId, // Устанавливаем `active` в true, если id совпадает
            };
            store.add(newItem); // "item" должен содержать поля "id" и "orderNumber"
          });

          console.log("Данные успешно сохранены в IndexedDB");
          resolve();
        };

        clearRequest.onerror = (event) => {
          reject(event.target.errorCode);
        };
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Ошибка в saveToIndexedDB:", error);
    throw error;
  }
};

export const deleteFromIndexedDB = async (orgName, id) => {
  try {
    const request = await initDB(orgName);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const db = event.target.result;

        // Создаем транзакцию для конкретного хранилища
        const transaction = db.transaction(orgName, "readwrite");
        const store = transaction.objectStore(orgName);

        // Удаляем объект по id
        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = () => {
          console.log(`Объект с id ${id} успешно удалён из ${orgName} в IndexedDB`);
          resolve();
        };

        deleteRequest.onerror = (event) => {
          reject(event.target.errorCode);
        };
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Ошибка в deleteFromIndexedDB:", error);
    throw error;
  }
};

// indexedDB.deleteDatabase("ControlPanelDB")
