import React, { useEffect, useState } from 'react'
import classes from './Task.module.css'
import { formattedDate, notEmpty } from '@helpers/helpers'
import { useNavigate } from 'react-router-dom'

export default function Task({ taskData, isArchive }) {

    const navigate = useNavigate()
    const [checkboxStatus, setCheckboxStatus] = useState(false)


    const transformDate = (dateString) => {

        if (!dateString) return ' ОШИБКА '

        const dayWithMounth = formattedDate(dateString).slice(0, 5)
        const dayOfWeek = {
            0: 'вс',
            1: 'пн',
            2: 'вт',
            3: 'ср',
            4: 'чт',
            5: 'пт',
            6: 'сб',
        };

        let dateObj;

        // Попытка создать Date из строки
        dateObj = new Date(dateString);

        // Если создание Date не удалось, попробуем извлечь дату из строки
        if (!dateObj || isNaN(dateObj.getTime())) {
            // Удаляем время и миллисекунды
            const dateWithoutTime = dateString.split('T')[0];
            // Создаем Date из полученной даты без времени
            dateObj = new Date(dateWithoutTime);
        }

        // Если все еще не удалось создать Date, возвращаем null
        if (!dateObj || isNaN(dateObj.getTime())) {
            return null;
        }


        return dayWithMounth + ' ' + dayOfWeek[dateObj.getDay()];
    }

    console.log(taskData)

    return (
        <>
            <div className={classes.wrapper}>

                <div className={classes.body}>
                    <div className={classes.checkboxContainer}>
                        <input type="checkbox" checked={checkboxStatus} disabled={isArchive} readOnly />
                    </div>
                    <div className={classes.titleContainer} onClick={() => navigate(taskData.convertId)}>
                        <div
                            className={classes.titleText}
                            style={{ 'color': isArchive ? '#00000040' : 'none' }}
                        >
                            {taskData.convertTheme}
                        </div>
                    </div>
                    <div className={classes.dateContainer}>
                        {checkboxStatus ? 'Завершено' : 'Завершить:'}
                        <span>
                            {/* {checkboxStatus ? transformDate(taskData.dateComplete) : transformDate(taskData.deadline)} */}
                        </span>
                    </div>
                </div>
            </div>

        </>
    )
}
