import React, { useState } from 'react'
import classes from './MainWorkingPlam.module.css'
import Headers from "@Custom/Headers/Headers";
import Task from '@app/WorkingPlanPage/mobile/TaskContainer/Task';
import InputTextContainer from '@Custom/ContainerForInputText/InputTextContainer';
import { useTargetsHook } from '@hooks';
import { ConfigProvider, Tour } from "antd";
import ruRU from "antd/locale/ru_RU";
import Input from './mobile/Input';
import icon from "@image/iconHeader.svg";
import HandlerQeury from "@Custom/HandlerQeury.jsx";

export default function MainWorkingPlan() {


    const [isViewArchive, setIsViewArchive] = useState(false)
    const [open, setOpen] = useState(false)

    const steps = [
        {
            title: "Выбор поста",
            description: "Выберите Пост отправителя",
            target: () => document.querySelector('[data-tour="current-post"]'),
        },
        {
            title: "Выбор даты",
            description: "Выберите дату начала и завершения задачи",
            target: () => document.querySelector('[data-tour="date-for-task"]'),
        },
        {
            title: "Вложения",
            description: "Прикрепите файлы к задаче",
            target: () => document.querySelector('[data-tour="files-attachment"]'),
        },
        {
            title: "Отправить задачу",
            description: "Нажмите для создания личной задачи",
            target: () => document.querySelector('[data-tour="send-message"]'),
        },
        {
            title: "Создать приказ",
            description: "Нажмите для отправки приказа",
            target: () => document.querySelector('[data-tour="share-icon"]'),
        },
    ].filter((step) => !step.disabled);

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
            <Headers name={"Рабочий План"} funcActiveHint={() => setOpen(true)}>
                {/* <BottomHeaders></BottomHeaders> */}
            </Headers>

            <div className={classes.main}>
                <ConfigProvider locale={ruRU}>
                    <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
                </ConfigProvider>
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

                                <>
                                    
                                </>
                            </div>
                        )}

                </div>
            </div>
            <Input
                userPosts={userPosts}
            >
            </Input>
        </div>
    )
}
