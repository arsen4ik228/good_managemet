import React from 'react'
import CustomList from '../../CustomList/CustomList'
import icon_task from '@image/icon _ task.svg'
import icon_task_finished from '@image/icon _ post (1).svg'
import ListElem from '../../CustomList/ListElem'
import { useNavigate } from 'react-router-dom'

export default function WorlingPlanList() {

    const navigate = useNavigate()

    const listElems = [
        {icon: icon_task, upperText: 'Все задачи', linkSegment: 'allTasks'},
        {icon: icon_task, upperText: 'Мои текущие задачи', linkSegment: 'currentTasks'},
        {icon: icon_task, upperText: 'Все мои приказы', linkSegment: ''},
        {icon: icon_task, upperText: 'Текущие приказы', linkSegment: 'currentOrders'},
        {icon: icon_task_finished, upperText: 'Завершенные задачи', linkSegment: 'archiveTasks', isActive: false},
        {icon: icon_task_finished, upperText: 'Выполненные приказы', linkSegment: '', isActive: false},
    ]

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
