export const formattedDate = (date) => {
  return date?.slice(0, 10).split('-').reverse().join('.')
}

export const resizeTextarea = (id) => {
  const textarea = document.getElementById(id);
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 2 + 'px';
  }
};

export const notEmpty = (object) => {
  if (Array.isArray(object))
    return object.length > 0
  else if (typeof object === 'object' && object !== null)
    return Object.keys(object).length > 0

  return false
}


export const transformArraiesForRequset = (array) => {
  const updatedArray = array.map((item, index) => {
    return {
      _id: item?.id,
      orderNumber: index + 1,
      content: item?.content,
      dateStart: item?.dateStart,
      deadline: item?.deadline,
      targetState: item?.targetState,
      type: item?.type,
      ...(item.holderUserIdchange !== item.holderUserId && {
        holderUserId: item?.holderUserId,
      })
    }
  }
  )
  return updatedArray; // Явно возвращаем массив
}

export const getDateFormatSatatistic = (date, typeGraphic) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const monthIndex = dateObj.getMonth();

  const months = [
    "янв",
    "фев",
    "март",
    "апр",
    "май",
    "июнь",
    "июль",
    "авг",
    "сент",
    "окт",
    "нояб",
    "дек",
  ];

  if (typeGraphic === "Ежемесячный") {
    return `${months[monthIndex]}-${year}`;
  }

  if (typeGraphic === "Ежегодовой") {
    return `${year}`;
  }

  // Формат по умолчанию
  return dateObj.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export function compareArraysWithObjects(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    // Сравниваем все поля объекта
    if (
      typeof obj1 === 'object' &&
      typeof obj2 === 'object' &&
      JSON.stringify(obj1) !== JSON.stringify(obj2)
    ) {
      return false;
    }
  }

  return true;
}

export function extractHoursMinutes(timestamp) {
  // Разделяем строку по символу 'T' и берем вторую часть
  const timePart = timestamp.split('T')[1];

  // Разделяем оставшуюся часть по символу ':' и берем часы и минуты
  const [hours, minutes] = timePart.split(':');

  return hours + ":" + minutes;
}