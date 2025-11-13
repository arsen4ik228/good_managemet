import React from 'react'
import classes from './WorkingPlanPage.module.css'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import Task from './Task/Task'
import { useTargetsHook } from '@hooks';
import WorkingPlanInput from './Input/WorkingPlanInput';


export default function WorkingPlanPage() {

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

    console.log(personalTargets)

    return (
        <>
            <MainContentContainer>
                <div className={classes.wrapper}>
                    <div className={classes.taskContainer}>

                        {personalTargets?.map((item, index) => (
                            <React.Fragment key={index}>
                                <Task item={item}
                                    content={item.content}
                                    deadline={item.deadline}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                    <div>
                        <WorkingPlanInput></WorkingPlanInput>
                    </div>
                </div>
            </MainContentContainer>
        </>
    )
}
