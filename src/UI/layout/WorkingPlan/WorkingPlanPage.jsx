import React, { useEffect, useState } from 'react'
import classes from './WorkingPlanPage.module.css'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import Task from './Task/Task'
import { useTargetsHook, useRightPanel, usePanelPreset } from '@hooks';
import { useLocation } from 'react-router-dom';
import WorkingPlanInput from './Input/WorkingPlanInput';


export default function WorkingPlanPage() {

    const [path, setPath] = useState()


    const { PRESETS } = useRightPanel();

    usePanelPreset(PRESETS["WORKINGPLAN"]);

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

    const location = useLocation();

    useEffect(() => {
        const getLastPathSegment = (pathname) => {
            const pathSegments = pathname.split('/').filter(segment => segment !== '');
            return pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
        };

        const lastPathSegment = getLastPathSegment(location.pathname);
        setPath(lastPathSegment);

    }, [location.pathname])

    console.log(personalTargets, orderTargets, projectTragets, futureTargets)

    return (
        <>
            <MainContentContainer>
                <div className={classes.wrapper}>
                    <div className={classes.taskContainer}>

                        {((path === 'allTasks')
                        ) && (
                                futureTargets.map((elem, elemIndex) => (
                                    <>
                                        <div key={elemIndex} className={classes.dayContainer}>
                                            <div>Начать: {elem.date}</div>
                                        </div>
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
                                    </>
                                ))
                            )}

                        <div className={classes.dayContainer}>
                            <div>ТЕКУЩИЕ</div>
                        </div>

                        {((path === 'currentTasks') ||
                            (path === 'currentOrders') ||
                            (path === 'allTasks')
                        ) && (
                                orderTargets?.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <Task

                                            content={item.content}
                                            deadline={item.deadline}
                                            type={item.type}
                                        />
                                    </React.Fragment>
                                ))
                            )}

                        {((path === 'currentTasks') ||
                            (path === 'allTasks')
                        ) && (
                                personalTargets?.map((item, index) => (
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
            </MainContentContainer>
        </>
    )
}
