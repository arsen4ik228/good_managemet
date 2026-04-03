import { useParams } from "react-router-dom";
import classes from "./ViewProject.module.css";

import { useEffect } from "react";
import { useProjectForm } from "../../../../contexts/ProjectFormContext";
import { notEmpty } from '@helpers/helpers'

import { useRightPanel, usePanelPreset } from "@hooks";
import dayjs from 'dayjs';
import { useGetSingleProgram } from "../../../../hooks/Project/useGetSingleProgram";
import { DocumentSkeleton } from "../../../DocumentSkeleton/DocumentSkeleton";
import {Tag} from "antd";

const formatDate = (iso) => {
    if (!iso) return '';
    return dayjs(iso).format('DD.MM.YY');
};

const Task = ({ title, task, date, people, post, index, status }) => {
    return (
        <>
            {
                title === "Продукт" ? (
                    <div className={classes.wrapper}>
                        <div className={classes.leftBlock}>
                            <span>{task}</span>
                        </div>
                        <div className={classes.rightBlock}>
                            <span>
                                   {
                                       status && (
                                           <Tag color={status === "Завершен" ? "green" : "red"} variant="outlined">
                                               {status}
                                           </Tag> )
                                   }
                                {date}
                                </span>
                            <span>{people}</span>
                            <span className={classes.light}>{post}</span>
                        </div>
                    </div>
                )
                    : (
                        <div className={classes.wrapperBorder}>
                            <div className={classes.leftBlock}>
                                <span className={classes.strong}>{index}</span>
                                <span>{task}</span>
                            </div>
                            <div className={classes.rightBlock}>
                                <span>
                                   {
                                       status && (
                                           <Tag color={status === "Завершена" ? "green" : "red"} variant="outlined">
                                               {status}
                                           </Tag> )
                                   }
                                    {date}
                                </span>
                                <span>{people}</span>
                                <span className={classes.light}>{post}</span>
                            </div>
                        </div>
                    )
            }
        </>
    )
}

const statusTarget = (target) => {
    let status = "";
    let date = "";

    const targetState = target.targetState;

    console.log("targetState", targetState);
    // сегодняшняя дата без времени
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (targetState) {
        case "Завершена":
            status = target.type === "Продукт" ? "Завершен" : "Завершена";
            date = formatDate(target?.dateComplete);
            break;

        case "Активная":
            if (target?.deadline) {
                const statusTarget = target.type === "Продукт" ? "Просрочен" : "Просрочена";
                status = target.isExpired ? statusTarget : null;
                date = formatDate(target.deadline);
            }
            break;

        default:
            status = null;
            date = formatDate(target.deadline);
            break;
    }

    console.log("date: ", date);
    console.log("status: ", status);
    console.log("target: ", target);

    return {
        status,
        date
    };
};

const TasksContainer = ({ title, tasks }) => {
    return (
        <div className={classes.container}>
            <span className={`${classes.strong}`}>{title}:</span>
            {
                tasks?.map((item, index) => {
                    const { status, date } = statusTarget(item);
                    const post = item?.targetHolders.find(t => t?.post?.id === item.holderPostId)?.post?.postName;
                    const user = item?.targetHolders.find(t => t?.post?.id === item.holderPostId)?.post?.user;
                    const people = user
                        ? `${user.firstName} ${user.lastName}`
                        : null;
                    return (
                        <Task
                            key={item.id}
                            title={title}
                            task={item?.content}
                            date={date}
                            people={people}
                            post={post}
                            index={index + 1}
                            status={status}
                        />
                    );
                })
            }

        </div>
    )
}

const TasksContainerProject = ({ title, tasks }) => {
    return (
        <div className={classes.container}>
            <span className={`${classes.strong}`}>{title}:</span>
            {
                tasks?.map((item, index) => {
                    const user = item?.targets[0]?.targetHolders?.[0]?.post?.user;
                    const people = user
                        ? `${user.firstName} ${user.lastName}`
                        : null;
                    const post = item?.targets[0]?.targetHolders?.[0]?.post?.postName
                    const { status, date } = statusTarget(item?.targets[0]);

                    return (
                        <Task
                            key={item.id}
                            title={title}
                            task={`"${item?.projectName}". Продукт: "${item?.targets?.[0]?.content}"`}
                            date={date}
                            people={people}
                            post={post}
                            index={index + 1}
                            status={status}
                        />
                    );
                })
            }

        </div>
    )
}

const Information = ({ title, content }) => {
    return (
        <div className={classes.container}>
            <span className={`${classes.strong}`}>{title}:</span>
            <span>{content}</span>
        </div>
    )
}


const order = ['Продукт', 'Метрика', 'Организационные мероприятия', 'Правила', 'Задача'];

export default function ViewProgram({ contentRef }) {
    const { PRESETS } = useRightPanel()
    usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);
    const { programId } = useParams();
    const {
        currentProgram,
        currentProjects,
        targets,
        statusProgram,
        isLoadingGetProgramId,
    } = useGetSingleProgram({ selectedProgramId: programId });

    const sortedTargets = targets
        ? [...targets].sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title))
        : [];

    const {
        projectName,
        setProjectName,
        setStrategyId
    } = useProjectForm();

    useEffect(() => {
        if (!notEmpty(currentProgram)) return

        setProjectName(currentProgram?.projectName)
        setStrategyId(currentProgram?.strategy?.id ? currentProgram?.strategy?.id : null)

    }, [currentProgram])

    console.log(currentProgram)

    return (
        <>
            {isLoadingGetProgramId ? (
                <>
                    <DocumentSkeleton></DocumentSkeleton>
                </>
            ) : (
                <div className={classes.main} ref={contentRef}>
                    <h3 className={`${classes.strong} ${classes.margin}`}>{localStorage.getItem("name")}</h3>
                    
                    {/*<span className={classes.strong}>Имя Фамилия</span>*/}
                    {/*<span className={classes.margin}>Название поста</span>*/}


                    <h2 className={`${classes.strong} ${classes.center}  ${classes.margin}`}>{currentProgram?.type}</h2>
                    <h2 className={`${classes.strong} ${classes.center}`}>{currentProgram?.projectName}</h2>
                    {currentProgram?.content?.trim() && <Information title={"Информация"} content={currentProgram?.content} />}
                    {
                        sortedTargets?.map((item) => <TasksContainer title={item.title} tasks={item.tasks} />)
                    }
                    {
                        currentProjects?.length > 0 && <TasksContainerProject title={"Проекты"} tasks={currentProjects} />
                    }
                </div>
            )}
        </>

    )
}
