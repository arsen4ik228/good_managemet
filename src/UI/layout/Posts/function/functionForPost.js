
 export const formatPhone = (phone) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, ""); // оставляем только цифры
    if (digits.length === 11) {
        return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    }
    return phone; // если формат не подходит, возвращаем как есть
};