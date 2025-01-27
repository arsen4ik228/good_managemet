import React, { useEffect, useState } from 'react'
import classes from './Task.module.css'
import DetailsTaskModal from '../Modals/DetailsTaskModal/DetailsTaskModal'
import { formattedDate, notEmpty } from '../../../BLL/constans'
import { useTargetsHook } from '../../../hooks/useTargetsHook'

export default function Task({ taskData, userPosts, isArchive }) {

    const [openDetailsTaskModal, setOpenDetailsTaskModal] = useState(false)
    const [checkboxStatus, setCheckboxStatus] = useState(false)

    const isOrder = taskData?.type === 'Приказ'

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

    const {
        updateTargets,
        isLoadingUpdateTargetsMutation,
        isSuccessUpdateTargetsMutation,
        isErrorUpdateTargetsMutation,
        ErrorUpdateTargetsMutation,

    } = useTargetsHook()

    const completeTask = () => {
        if (isArchive) return

        if (isOrder) setOpenDetailsTaskModal(true)

        updateTask()
    }

    const updateTask = async () => {

        await updateTargets({
            _id: taskData.id,
            type: taskData.type,
            targetState: taskData.targetState === 'Активная' ? 'Завершена' : 'Активная'
        })
            .unwrap()
            .then(() => {
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    }



    useEffect(() => {
        if (!notEmpty(taskData)) return

        setCheckboxStatus(taskData?.targetState === 'Завершена' ? true : false)
    }, [taskData])

    return (
        <>
            <div className={classes.wrapper}>

                <div className={isOrder ? classes._body : classes.body}>
                    <div className={classes.checkboxContainer} onClick={() => completeTask()}>
                        <input type="checkbox" checked={checkboxStatus} disabled={isArchive} readOnly />
                    </div>
                    <div className={classes.titleContainer} onClick={() => setOpenDetailsTaskModal(true)}>
                        <div
                            className={classes.titleText}
                            style={{ 'color': isArchive ? '#00000040' : 'none' }}
                        >
                            {taskData.content}
                        </div>
                    </div>
                    <div className={classes.dateContainer} onClick={() => setOpenDetailsTaskModal(true)}>
                        {checkboxStatus ? 'Завершено' : 'Завершить:'}
                        <span>
                            {checkboxStatus ? transformDate(taskData.dateComplete) : transformDate(taskData.deadline)}
                        </span>
                    </div>
                </div>
            </div>

            {openDetailsTaskModal && (
                <DetailsTaskModal
                    setOpenModal={setOpenDetailsTaskModal}
                    taskData={taskData}
                    userPosts={userPosts}
                ></DetailsTaskModal>
            )}

        </>
    )
}
