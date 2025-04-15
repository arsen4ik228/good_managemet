
import React, { useState } from 'react';
import classes from './Task.module.css';
import { useNavigate } from 'react-router-dom';
import { formattedDate } from '@helpers/helpers'
import { isMobile } from 'react-device-detect';

export default function Task({ taskData, isArchive }) {
    const navigate = useNavigate();
    const [checkboxStatus, setCheckboxStatus] = useState(false);


    const getBeforeClass = () => {
        const typeClassMap = {
            'Приказ': classes.bodyType1,
            'Согласование': classes.bodyType2,
            'Копия': classes.bodyType3,
        };

        // Возвращаем класс по умолчанию, если convertType отсутствует или неизвестен
        return `${classes.body} ${typeClassMap[taskData.convertType] || ''}`;
    };

    const handleNavigateClick = (link) => {
        if ((!taskData.convertStatus || isArchive) && taskData.convertType !== 'Копия') return navigate('archive/' + link)
        if (taskData.convertType === 'Копия') return navigate('watcher/' + link)
        if (taskData.convertType === 'Согласование') return navigate('agreement/' + link)

        navigate(link)
    }

    console.log(taskData)

    return (
        <div
            className={+taskData.unseenMessagesCount !== 0 ?
                `${classes.wrapper} ${classes.unSeenWrapper}` :
                `${classes.wrapper}`}
            style={{ width: !isMobile ? '700px' : 'none' }}
        >
            <div className={getBeforeClass()}>
                <div className={classes.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={!taskData.convertStatus}
                        // disabled={isArchive}
                        readOnly
                    />
                </div>
                <div
                    className={classes.titleContainer}
                    onClick={() => handleNavigateClick(taskData.id)}
                >
                    <div
                        className={`${classes.titleText} ${!taskData.convertStatus ? classes.titleTextArchive : ''}`}
                    >
                        {taskData.convertTheme}
                    </div>
                </div>
                <div className={classes.dateContainer}>
                    {/* {checkboxStatus ? 'Завершено' : 'Завершить:'} */}
                    <span>
                        {formattedDate(taskData.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
}
