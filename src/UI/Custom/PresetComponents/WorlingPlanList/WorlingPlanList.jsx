import React from 'react'
import CustomList from '../../CustomList/CustomList'
import icon_task from '@image/icon _ task.svg'
import icon_task_finished from '@image/icon _ post (1).svg'
import ListElem from '../../CustomList/ListElem'
import { useNavigate } from 'react-router-dom'
import ListAddButtom from '../../ListAddButton/ListAddButtom'
import { useWorkingPlanForm } from '../../../../contexts/WorkingPlanContext'
import dayjs from 'dayjs';

export default function WorlingPlanList() {

    const navigate = useNavigate()

        const {
            // dateStart,
            setDateStart,
            // deadline,
            setDeadline,
            senderPost,
            setSenderPost,
            setContentInput,
            userPostsInAccount,
            setIsEdit,
            taskId,
            setTaskId
        } = useWorkingPlanForm();

    const listElems = [
        { icon: icon_task, upperText: 'Все задачи', linkSegment: 'allTasks' },
        { icon: icon_task, upperText: 'Мои текущие задачи', linkSegment: 'currentTasks' },
        { icon: icon_task, upperText: 'Отправленные приказы', linkSegment: 'myOrder' },
        { icon: icon_task, upperText: 'Текущие приказы', linkSegment: 'currentOrders' },
        { icon: icon_task_finished, upperText: 'Завершенные задачи', linkSegment: 'archiveTasks', isActive: false },
        // { icon: icon_task_finished, upperText: 'Выполненные приказы', linkSegment: '', isActive: false },
    ]

    const createTarget = () => {
        setTaskId(null)
        setIsEdit(false)
        setContentInput('')
        setDateStart(dayjs())
        setDeadline(null)
    }

    const clickFunc = (link) => {
        navigate(`helper/workingPlan/${link}`)
    }

    return (
        <>
            <CustomList
                title={'Задачи'}
            // isFilter={true}
            // setOpenFilter={setOpenFilter}
            // searchValue={seacrhUsersSectionsValue}
            // searchFunc={setSeacrhUsersSectionsValue}
            >
                <ListAddButtom
                    textButton={"Создать задачу"}
                    clickFunc={() => createTarget()}
                />
                {listElems.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={item?.icon}
                            upperText={item.upperText}
                            linkSegment={item.linkSegment}
                            clickFunc={() => clickFunc(item.linkSegment)}
                            isActive={item?.isActive}
                        />
                    </React.Fragment>
                ))}
            </CustomList>
        </>
    )
}
