import React, { useState } from 'react'
import classes from './MainWorkingPlan.module.css'
import InputTextContainer from './ContainerForInputText/InputTextContainer'
import Header from '../Custom/CustomHeader/Header'
import Task from './TaskContainer/Task'
import { useTargetsHook } from '@hooks'

export default function MobileMainWorkingPlan() {

    const [isViewArchive, setIsViewArchive] = useState(false)

    const {
        personalTargets,
        orderTargets,
        projectTragets,
        futureTargets,
        userPosts,
        isLoadingGetTargets,
        isErrorGetTargets,


        archivePersonalTargets,
        archiveOrdersTargets,
        archiveProjectTragets,
        isLoadingGetArchiveTargets,
        isErrorGetArchiveTargets,

    } = useTargetsHook()

    return (
        <>
            <div className={classes.wrapper}>

                <>
                    <Header
                        title={"Рабочий план"}
                    >
                        Личный помощник
                    </Header>
                </>
                <div className={classes.body}>
                    <div key={'un'} className={classes.archiveButton} onClick={() => setIsViewArchive(!isViewArchive)}>
                        {isViewArchive ? 'Скрыть ' : 'Показать'} завершенные задачи
                    </div>
                    <div className={classes.tasksContainer}>
                        {!isViewArchive ? (
                            <>
                                {futureTargets?.map((elem, elemIndex) => (
                                    <>
                                        <div key={elemIndex} className={classes.dayContainer}>
                                            <span>Начать {elem.date}</span>
                                        </div>
                                        {elem?.items?.map((item, index) => (
                                            <Task
                                                key={index}
                                                taskData={item}
                                                userPosts={userPosts}
                                            ></Task>
                                        ))}
                                    </>
                                ))}
                                {/* {otherPersonalTargets.map((elem, elemIndex) => (
                                    <>
                                        <div key={elemIndex} className={classes.dayContainer}>
                                            <span>Начать {elem.date}</span>
                                        </div>
                                        {elem?.items?.map((item, index) => (
                                            <Task
                                                key={index}
                                                taskData={item}
                                                userPosts={userPosts}
                                            ></Task>
                                        ))}
                                    </>
                                ))} */}
                                <div className={classes.dayContainer}>
                                    <span>Текущие</span>
                                </div>
                                {orderTargets?.map((item, index) => (
                                    <Task
                                        key={index}
                                        taskData={item}
                                        userPosts={userPosts}
                                    ></Task>
                                ))}

                                {personalTargets?.map((item, index) => (
                                    <Task
                                        key={index}
                                        taskData={item}
                                        userPosts={userPosts}
                                    ></Task>
                                ))}

                            </>
                        ) : (
                            <>
                                {archivePersonalTargets?.map((item, index) => (
                                    <Task
                                        key={index}
                                        taskData={item}
                                        userPosts={userPosts}
                                        isArchive={true}
                                    ></Task>
                                ))}
                            </>
                        )}
                    </div>

                </div>
                <InputTextContainer
                    userPosts={userPosts}
                >
                </InputTextContainer>
            </div>
        </>
    )
}
