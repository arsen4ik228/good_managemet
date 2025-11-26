import classes from './DelegateModal.module.css'
import React, { useState, useRef, useEffect } from 'react';
import { Input, DatePicker, List, Avatar, Button } from 'antd';
import { baseUrl } from '@helpers/constants'

export default function DelegatePopup({
    onClose,
    triggerRef,
    convertTheme,
    setConvertTheme,
    modalDeadline,
    setModalDeadline,
    deadline,
    underPosts,
    reciverPostId,
    setReciverPostId,
    clickFunc
}) {

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const popupRef = useRef();


useEffect(() => {
    if (!triggerRef.current || !popupRef.current) return;

    const updatePosition = () => {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popup = popupRef.current;
        const popupWidth = 380; // Фиксированная ширина из CSS
        const popupHeight = 400; // Фиксированная высота из CSS

        console.log('Trigger position:', {
            top: triggerRect.top,
            bottom: triggerRect.bottom,
            windowHeight: window.innerHeight
        });

        let leftPosition = triggerRect.left - popupWidth - 10;
        
        // РАСЧЕТ ВЕРТИКАЛЬНОЙ ПОЗИЦИИ
        let topPosition;

        // Пробуем позиционировать СВЕРХУ от триггера
        const topAbove = triggerRect.top - popupHeight - 10;
        
        // Пробуем позиционировать СНИЗУ от триггера
        const topBelow = triggerRect.bottom + 10;

        // Проверяем, какая позиция лучше подходит
        if (topAbove >= 10) {
            // Если сверху достаточно места
            topPosition = topAbove;
            console.log('Positioning ABOVE trigger');
        } else if (topBelow + popupHeight <= window.innerHeight - 10) {
            // Если снизу достаточно места
            topPosition = topBelow;
            console.log('Positioning BELOW trigger');
        } else {
            // Если ни сверху, ни снизу нет места - прижимаем к краям
            if (triggerRect.top > window.innerHeight / 2) {
                // Триггер в нижней части экрана - показываем сверху
                topPosition = 10;
                console.log('Positioning TOP of screen');
            } else {
                // Триггер в верхней части экрана - показываем снизу
                topPosition = window.innerHeight - popupHeight - 10;
                console.log('Positioning BOTTOM of screen');
            }
        }

        // Горизонтальная корректировка
        if (leftPosition < 10) {
            leftPosition = triggerRect.right + 10;
            
            // Если и справа не хватает места
            if (leftPosition + popupWidth > window.innerWidth - 10) {
                leftPosition = 10;
            }
        }

        popup.style.position = 'fixed';
        popup.style.top = `${topPosition}px`;
        popup.style.left = `${leftPosition}px`;
        popup.style.zIndex = '1000';

        console.log('Final position:', { top: topPosition, left: leftPosition });
    };

    const timer = setTimeout(updatePosition, 10);
    return () => clearTimeout(timer);
}, [triggerRef]);

    // Закрытие при клике вне попапа
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Проверяем, что клик был не по элементам календаря
            const isCalendarElement = 
                event.target.closest('.ant-picker-panel') ||
                event.target.closest('.ant-picker-dropdown') ||
                event.target.closest('.ant-picker-cell') ||
                event.target.closest('.ant-picker-date-panel');

            if (popupRef.current && 
                !popupRef.current.contains(event.target) &&
                triggerRef.current && 
                !triggerRef.current.contains(event.target) &&
                !isCalendarElement) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, triggerRef]);


    return (
        <div ref={popupRef} className={classes.popupContainer}>
            {/* Заголовок */}
            <div className={classes.popupHeader}>
                <h3 className={classes.popupTitle}>Делегировать задачу</h3>
                <button className={classes.closeButton} onClick={onClose}>×</button>
            </div>

            <div className={classes.popupContent}>
                {/* Поле темы */}
                <div className={classes.inputSection}>
                    <Input
                        placeholder="Тема приказа"
                        value={convertTheme}
                        onChange={(e) => setConvertTheme(e.target.value)}
                        className={classes.themeInput}
                        size="large"
                    />
                </div>

                {/* Поле даты завершения */}
                {!deadline && (
                    <div className={classes.inputSection}>
                        <DatePicker
                            value={modalDeadline}
                            onChange={setModalDeadline}
                            className={classes.datePicker}
                            format="DD.MM.YYYY"
                            placeholder="Дата завершения"
                            size="large"
                            style={{ width: '100%' }}
                            getPopupContainer={trigger => trigger.parentNode} // Это может помочь
                        />
                    </div>
                )}

                {/* Список сотрудников */}
                <div className={classes.employeesSection}>
                    <div className={classes.sectionLabel}>Выберите сотрудника</div>
                    <div className={classes.employeesList}>
                        {underPosts.map((employee) => (
                            <div
                                key={employee.id}
                                className={`${classes.employeeItem} ${reciverPostId === employee.id ? classes.selected : ''
                                    }`}
                                onClick={() => setReciverPostId(employee.id)}
                            >
                                <Avatar src={`${baseUrl}${employee.user.avatar_url}`} size={40} />
                                <div className={classes.employeeInfo}>
                                    <div className={classes.employeeName}>{employee.user.firstName + ' ' + employee.user.lastName}</div>
                                    <div className={classes.employeePosition}>{employee.postName}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Кнопка отправки */}
                <div className={classes.footer}>
                    <Button
                        type="primary"
                        onClick={clickFunc}
                        disabled={!reciverPostId || !convertTheme}
                        className={classes.submitButton}
                        size="large"
                    >
                        Отправить
                    </Button>
                </div>
            </div>
        </div>
    );
}