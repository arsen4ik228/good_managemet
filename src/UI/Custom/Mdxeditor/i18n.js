import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
      ru: {
        translation: {
          "toolbar.undo": "Отменить",
          "toolbar.redo": "Вернуть",

          "toolbar.bold": "Жирный",
          "toolbar.removeBold": "Убрать жирный",
          "toolbar.italic": "Курсив",
          "toolbar.underline": "Подчеркнутый",
          
          "toolbar.bulletedList": "Маркированный список",
          "toolbar.numberedList": "Нумерованный список",
          "toolbar.checkList": "Контрольный список",

          "toolbar.image": "Вставить изображение",
          "toolbar.table": "Вставить таблицу",
          "toolbar.link": "Создать ссылку",

          "table.rowMenu": "Меню строк",
          "table.columnMenu": "Меню столбцов",

          "table.alignRight": "Выравнивание справа",
          "table.alignCenter": "Выравнивание по центру",
          "table.alignLeft": "Выравнивание слева",

          "table.insertColumnRight": "Добавить столбец справа",
          "table.insertColumnLeft": "Добавить столбец слева",

          "table.deleteColumn": "Удалить столбец",
          "table.deleteRow": "Удалить строку",

          "table.deleteTable": "Удалить таблицу",
          "table.insertRowAbove": "Добавить строку сверху",
          "table.insertRowBelow": "Добавить строку снизу",


          "uploadImage.dialogTitle": "Загрузка изображения",
          "uploadImage.addViaUrlInstructionsNoUpload": "Добавление изображения по URL-адресу:",
          "uploadImage.alt": "Текст когда изображение не загрузилось",
          "uploadImage.title": "Подпись",
          "uploadImage.uploadInstructions": "Загрузите изображение со своего устройства:",
          "uploadImage.addViaUrlInstructions": "Или добавьте изображение с URL-адреса:",
          
          "imageEditor.deleteImage": "Удалить",
          "imageEditor.editImage": "Изменить",

          "dialogControls.save": "Сохранить",
          "dialogControls.cancel": "Отменить",

          "createLink.url": "Ссылка",
          "createLink.title": "Название",
    
          "linkPreview.open": "Открыть",
          "linkPreview.remove": "Удалить",
          "linkPreview.edit": "Изменить",
          "linkPreview.copyToClipboard": "Скопировать ссылку",
        },
      },
    },
    lng: "ru",
    fallbackLng: "en",
    // debug: true, 
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
