import React, { useEffect, useRef, useState } from 'react'
import classes from './WorkingPlanPage.module.css'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import Task from './Task/Task'
import { useTargetsHook, useRightPanel, usePanelPreset } from '@hooks';
import { useLocation } from 'react-router-dom';
import WorkingPlanInput from './Input/WorkingPlanInput';


export default function WorkingPlanPage() {

    const [path, setPath] = useState()
    const containerRef = useRef(null);


    const { PRESETS } = useRightPanel();

    usePanelPreset(PRESETS["WORKINGPLAN"]);

    const {
        personalTargets,
        orderTargets,
        projectTragets,
        futureTargets,
        sendedTargets,
        userPosts,
        isLoadingGetTargets,
        isErrorGetTargets,


        archivePersonalTargets,
        archiveOrdersTargets,
        archiveProjectTragets,
        isLoadingGetArchiveTargets,
        isErrorGetArchiveTargets,

    } = useTargetsHook()

    const location = useLocation();

    useEffect(() => {
        const getLastPathSegment = (pathname) => {
            const pathSegments = pathname.split('/').filter(segment => segment !== '');
            return pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
        };

        const lastPathSegment = getLastPathSegment(location.pathname);
        setPath(lastPathSegment);

    }, [location.pathname])


    useEffect(() => {
        // Скроллим к низу при монтировании компонента
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, []);

    console.log(personalTargets, orderTargets, projectTragets, futureTargets, sendedTargets)

    return (
        <>
            <MainContentContainer>
                <div className={classes.wrapper}>
                    <div ref={containerRef} className={classes.taskContainer}>

                        {((path === 'currentTasks') ||
                            (path === 'allTasks')
                        ) && (
                                personalTargets?.slice().reverse().map((item, index) => (
                                    <React.Fragment key={index}>
                                        <Task
                                            id={item.id}
                                            content={item.content}
                                            deadline={item.deadline}
                                            type={item.type}
                                            state={item.targetState}
                                            completeDate={item.dateComplete}
                                            dateStart={item.dateStart}
                                            holderPostId={item.holderPostId}
                                        />
                                    </React.Fragment>
                                ))
                            )}

                        {((path === 'currentTasks') ||
                            (path === 'currentOrders') ||
                            (path === 'allTasks')
                        ) && (
                                <>  {/* Используем Fragment вместо лишнего div */}


                                    {orderTargets?.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <Task
                                                id={item.id}
                                                content={item.content}
                                                deadline={item.deadline}
                                                type={item.type}
                                                convertId={item.convert.id}
                                                contactId={item.convert.host.user.id}
                                            />
                                        </React.Fragment>
                                    ))}

                                    <div className={classes.dayContainer}>
                                        <div>ТЕКУЩИЕ</div>
                                    </div>
                                </>
                            )}

                        {((path === 'allTasks')
                        ) && (
                                futureTargets.map((elem, elemIndex) => (
                                    <>
                                        {elem?.items?.map((item, index) => (
                                            <Task
                                                id={item.id}
                                                content={item.content}
                                                deadline={item.deadline}
                                                type={item.type}
                                                state={item.targetState}
                                                completeDate={item.dateComplete}
                                                dateStart={item.dateStart}
                                                holderPostId={item.holderPostId}
                                            ></Task>
                                        ))}
                                        <div key={elemIndex} className={classes.dayContainer}>
                                            <div>Начать: {elem.date}</div>
                                        </div>
                                    </>
                                ))
                            )}


                        {((path === 'myOrder')) &&
                            (
                                sendedTargets?.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <Task
                                            id={item.id}

                                            content={item.content}
                                            deadline={item.deadline}
                                            type={item.type}
                                            convertId={item.convert.id}
                                            contactId={item.convert.host.user.id}
                                        />
                                    </React.Fragment>
                                ))
                            )}

                        {((path === 'archiveTasks')
                        ) && (
                                archivePersonalTargets?.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <Task
                                            id={item.id}
                                            content={item.content}
                                            deadline={item.deadline}
                                            type={item.type}
                                            state={item.targetState}
                                            completeDate={item.dateComplete}
                                        />
                                    </React.Fragment>
                                ))
                            )}
                    </div>
                    <div>
                        <WorkingPlanInput></WorkingPlanInput>
                    </div>
                </div>
            </MainContentContainer >
        </>
    )
}
