
import React, { useState } from 'react';
import classes from './Task.module.css';
import { useNavigate } from 'react-router-dom';
import { formattedDate } from '@helpers/helpers'

export default function Task({ taskData, isArchive }) {
    const navigate = useNavigate();
    const [checkboxStatus, setCheckboxStatus] = useState(false);


    const getBeforeClass = () => {
        const typeClassMap = {
            'Приказ': classes.bodyType1,
            'Заявка': classes.bodyType2,
            'Копия': classes.bodyType3,
        };

        // Возвращаем класс по умолчанию, если convertType отсутствует или неизвестен
        return `${classes.body} ${typeClassMap[taskData.convertType] || ''}`;
    };

    return (
        <div className={+taskData.unseenMessagesCount !== 0 ? `${classes.wrapper} ${classes.unSeenWrapper}` : `${classes.wrapper}`}>
            <div className={getBeforeClass()}>
                <div className={classes.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={checkboxStatus}
                        disabled={isArchive}
                        readOnly
                    />
                </div>
                <div
                    className={classes.titleContainer}
                    onClick={() => navigate(taskData.convertId)}
                >
                    <div
                        className={`${classes.titleText} ${isArchive ? classes.titleTextArchive : ''}`}
                    >
                        {taskData.convertTheme}
                    </div>
                </div>
                <div className={classes.dateContainer}>
                    {/* {checkboxStatus ? 'Завершено' : 'Завершить:'} */}
                    <span>
                        {formattedDate(taskData.dateStart)}
                    </span>
                </div>
            </div>
        </div>
    );
}
