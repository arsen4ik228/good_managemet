import React, { useState } from 'react'
import classes from './MainWorkingPlan.module.css'
import Input from './Input'
import Header from '@Custom/CustomHeader/Header'
import Task from './TaskContainer/Task'
import { useTargetsHook } from '@hooks'
import HandlerQeury from "@Custom/HandlerQeury.jsx";

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
                    <div key={'un'} className={classes.archiveButton} >
                        <span className={classes.archiveButtonSpan} onClick={() => setIsViewArchive(!isViewArchive)}>
                            Показать {isViewArchive ? 'текущие' : 'архивные'} задачи
                        </span>
                    </div>
                    {isErrorGetArchiveTargets || isErrorGetTargets ?
                        (
                            <>
                                <HandlerQeury Error={isErrorGetArchiveTargets || isErrorGetTargets}></HandlerQeury>
                            </>
                        ) :
                        (

                            <div className={classes.tasksContainer}>
                                <HandlerQeury
                                    Loading={isLoadingGetArchiveTargets || isLoadingGetTargets}
                                ></HandlerQeury>
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
                            </div>)}

                </div>
                <Input
                    userPosts={userPosts}
                >
                </Input>
            </div>
        </>
    )
}
