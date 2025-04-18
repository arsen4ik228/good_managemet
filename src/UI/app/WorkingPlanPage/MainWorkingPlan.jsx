import React, { useState } from 'react'
import classes from './MainWorkingPlam.module.css'
import Headers from "@Custom/Headers/Headers";
import Task from '@app/WorkingPlanPage/mobile/TaskContainer/Task';
import InputTextContainer from '@Custom/ContainerForInputText/InputTextContainer';
import { useTargetsHook } from '@hooks';
import Input from './mobile/Input';

export default function MainWorkingPlan() {


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
        <div className={classes.dialog}>
            <Headers name={"Рабочий План"}>
                {/* <BottomHeaders></BottomHeaders> */}
            </Headers>

            <div className={classes.main}>
                <div className={classes.body}>
                    <div key={'un'} className={classes.archiveButton} onClick={() => setIsViewArchive(!isViewArchive)}>
                        {isViewArchive ? 'Скрыть ' : 'Показать'} завершенные задачи
                    </div>
                    <div className={classes.tasksContainer}>
                        {!isViewArchive ? (
                            <>
                                {futureTargets.map((elem, elemIndex) => (
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
                                {orderTargets.map((item, index) => (
                                    <Task
                                        key={index}
                                        taskData={item}
                                        userPosts={userPosts}
                                    ></Task>
                                ))}

                                {personalTargets.map((item, index) => (
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
            </div>
            <Input
                userPosts={userPosts}
            >
            </Input>
        </div>
    )
}
