import React, { useEffect, useState } from 'react'
import classes from './Task.module.css'
import DetailsTaskModal from '../Modals/DetailsTaskModal/DetailsTaskModal'
import { formattedDate, notEmpty } from '@helpers/helpers'
import { useTargetsHook } from '@hooks'

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

        deleteTarget,

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


    const handleDeletionTarget = async () => {
        await deleteTarget({
            targetId: taskData.id,
        })
            .unwrap()
            .then(() => {
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    }

    return (
        <>
            <div className={`${classes.wrapper} ${taskData.targetState === 'Завершена' && !isArchive ? classes.completed : ''} ${taskData.targetState === 'Черновик' ? classes.draft : ''}`}>

                <div className={isOrder ? classes._body : classes.body}>
                    {taskData.targetState !== 'Черновик' && (<div className={classes.checkboxContainer} onClick={() => completeTask()} style={{
                        pointerEvents: isArchive || taskData.targetState === 'Завершена' ? 'none' : 'auto',
                        cursor: isArchive || taskData.targetState === 'Завершена' ? 'default' : 'pointer'
                    }}>
                        <input type="checkbox" checked={checkboxStatus} readOnly />
                    </div>)}
                    <div className={classes.titleContainer} onClick={() => setOpenDetailsTaskModal(true)}>
                        <div
                            className={classes.titleText}
                            style={{ 'color': isArchive ? '#00000040' : 'none' }}
                        >
                            {taskData.content}
                        </div>
                    </div>

                    <div className={classes.dateContainer} onClick={() => setOpenDetailsTaskModal(true)}>
                        <span>
                            {checkboxStatus ? transformDate(taskData.dateComplete) : transformDate(taskData.deadline)}
                        </span>
                    </div>
                    {taskData.targetState !== 'Завершена' && !isArchive && (
                        <div
                            className={classes.deleteButton}
                            onClick={() => handleDeletionTarget()}
                        >
                            ×
                        </div>
                    )}
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
