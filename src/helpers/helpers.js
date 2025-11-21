import React from 'react';
import { userId } from './constants'
import { useLocation } from 'react-router-dom';

export const formattedDate = (date) => {
  if (!date) return '';

  return date.slice(0, 10)
    .split('-')
    .reverse()
    .map((part, index) => index === 2 ? part.slice(-2) : part)
    .join('.');
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

// export function formatDateTime(isoString) {
//     const date = new Date(isoString);
    
//     // Получаем компоненты даты
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = String(date.getFullYear()).slice(-2); // Последние 2 цифры года
    
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
    
//     return `${day}.${month}.${year} ${hours}:${minutes}`;
// }

export function formatDateTime(isoString) {
    const date = new Date(isoString);
    
    // Используем UTC методы для получения правильного времени
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2); // Последние 2 цифры года
    
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}


export function extractHoursMinutes(timestamp) {
  // Разделяем строку по символу 'T' и берем вторую часть
  const timePart = timestamp.split('T')[1];

  // Разделяем оставшуюся часть по символу ':' и берем часы и минуты
  const [hours, minutes] = timePart.split(':');

  return hours + ":" + minutes;
}

export const getPostIdRecipientSocketMessage = (host, recepient) => {
  if (!notEmpty(host) || !notEmpty(recepient)) return

  const hostUserID = host.user.id
  const recepientUserId = recepient.user.id

  const userParticipantOfAgreement = userId !== hostUserID && userId !== recepientUserId
  if (userParticipantOfAgreement || userId === recepientUserId)
    return host.id

  if (userId === hostUserID)
    return recepient.id
}

export const transformToString = (arr) => {
  let string = ''
  arr.forEach(element => {
    string += `${element} \n\n`
  });
  return string
}



export const compareStringArray = (arr1, arr2) => {

  if (arr1.length !== arr2.length) return true

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return true
    }
  }
}


export const useFindPathSegment = (link) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  if (link)
    return pathParts.find(segment => segment === link);
};

export const findSelectedChild = (children, selectedItemId) => {
  if (!children || !selectedItemId) return null;

  const findInChildren = (child) => {
    // Проверяем, есть ли у элемента props с идентификатором
    if (child.props && child.props.id === selectedItemId) {
      return child;
    }

    // Если это React Fragment, ищем в его детях
    if (child.type === React.Fragment && child.props.children) {
      const fragmentChildren = Array.isArray(child.props.children)
        ? child.props.children
        : [child.props.children];

      for (const fragmentChild of fragmentChildren) {
        const found = findInChildren(fragmentChild);
        if (found) return found;
      }
    }

    // Рекурсивно проверяем детей
    if (child.props && child.props.children) {
      const nestedChildren = Array.isArray(child.props.children)
        ? child.props.children
        : [child.props.children];

      for (const nestedChild of nestedChildren) {
        const found = findInChildren(nestedChild);
        if (found) return found;
      }
    }

    return null;
  };

  const childrenArray = Array.isArray(children) ? children : [children];

  for (const child of childrenArray) {
    const found = findInChildren(child);
    if (found) return found;
  }

  return null;
};


export function formatDateWithDay(dateString) {
  try {
    const date = new Date(dateString);
    
    // Проверка валидности даты
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayOfWeek = daysOfWeek[date.getDay()];
    
    return `${day}.${month} ${dayOfWeek}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}
