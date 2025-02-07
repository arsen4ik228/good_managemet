const dbName = "ControlPanelDB";
let dbInstance = null;

// Функция для проверки существования хранилища
const doesStoreExist = (db, storeName) => {
  return db.objectStoreNames.contains(storeName);
};

// Инициализация базы данных
export const initDB = async (orgName) => {
  return new Promise((resolve, reject) => {
    // Если база данных уже открыта и хранилище существует, используем её
    if (dbInstance && doesStoreExist(dbInstance, orgName)) {
      resolve(dbInstance);
      return;
    }

    // Шаг 1: Открываем базу данных для проверки существования хранилища
    const checkRequest = indexedDB.open(dbName);

    checkRequest.onsuccess = (event) => {
      const db = event.target.result;

      // Проверяем, существует ли хранилище
      if (doesStoreExist(db, orgName)) {
        // Хранилище существует, возвращаем базу данных
        dbInstance = db;
        resolve(db);
      } else {
        // Хранилище не существует, увеличиваем версию базы данных
        const currentVersion = db.version;
        const newVersion = currentVersion + 1;

        // Закрываем текущее соединение
        db.close();

        // Шаг 2: Открываем базу данных с новой версией для создания хранилища
        const upgradeRequest = indexedDB.open(dbName, newVersion);

        upgradeRequest.onupgradeneeded = (event) => {
          const db = event.target.result;

          // Создаём новое хранилище, если его ещё нет
          if (!db.objectStoreNames.contains(orgName)) {
            db.createObjectStore(orgName, { keyPath: "id" });
            console.log(`Хранилище ${orgName} создано.`);
          }
        };

        upgradeRequest.onsuccess = (event) => {
          const db = event.target.result;
          dbInstance = db; // Сохраняем соединение
          resolve(db);
        };

        upgradeRequest.onerror = (event) => {
          reject(event.target.error);
        };
      }
    };

    checkRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Загрузка данных из IndexedDB
export const loadFromIndexedDB = async (orgName, callback) => {
  try {
    const db = await initDB(orgName);

    // Проверяем, существует ли хранилище перед выполнением транзакции
    if (!doesStoreExist(db, orgName)) {
      throw new Error(`Хранилище ${orgName} не существует.`);
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(orgName, "readonly");
      const store = transaction.objectStore(orgName);

      const getRequest = store.getAll();

      getRequest.onsuccess = () => {
        callback(getRequest.result || []);
        resolve();
      };

      getRequest.onerror = (event) => {
        console.error("Ошибка чтения из IndexedDB:", event.target.errorCode);
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Ошибка в loadFromIndexedDB:", error);
    throw error;
  }
};

// Сохранение данных в IndexedDB
export const saveToIndexedDB = async (orgName, dataArray, activeId) => {
  try {
    const db = await initDB(orgName);
    // Проверяем, существует ли хранилище перед выполнением транзакции
    if (!doesStoreExist(db, orgName)) {
      throw new Error(`Хранилище ${orgName} не существует.`);
    }
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(orgName, "readwrite");
      const store = transaction.objectStore(orgName);

      // Очищаем хранилище перед записью новых данных
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        // Добавляем каждый объект из массива
        dataArray.forEach((item) => {
          const newItem = {
            ...item,
            isActive: item.id === activeId,
          };
          store.add(newItem);
        });

        console.log("Данные успешно сохранены в IndexedDB");
        resolve();
      };

      clearRequest.onerror = (event) => {
        reject(event.target.errorCode);
      };
    });
  } catch (error) {
    console.error("Ошибка в saveToIndexedDB:", error);
    throw error;
  }
};

// Удаление данных из IndexedDB
export const deleteFromIndexedDB = async (orgName, id) => {
  try {
    const db = await initDB(orgName);

    // Проверяем, существует ли хранилище перед выполнением транзакции
    if (!doesStoreExist(db, orgName)) {
      throw new Error(`Хранилище ${orgName} не существует.`);
    }
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(orgName, "readwrite");
      const store = transaction.objectStore(orgName);

      // Удаляем объект по id
      const deleteRequest = store.delete(id);

      deleteRequest.onsuccess = () => {
        console.log(
          `Объект с id ${id} успешно удалён из ${orgName} в IndexedDB`
        );
        resolve();
      };

      deleteRequest.onerror = (event) => {
        reject(event.target.errorCode);
      };
    });
  } catch (error) {
    console.error("Ошибка в deleteFromIndexedDB:", error);
    throw error;
  }
};
