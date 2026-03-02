import {useParams} from "react-router-dom";
import classes from "./ViewProject.module.css";

import {useEffect} from "react";
import {useProjectForm} from "../../../../contexts/ProjectFormContext";
import {notEmpty} from '@helpers/helpers'

import {useRightPanel, usePanelPreset} from "@hooks";
import dayjs from 'dayjs';
import {useGetSingleProgram} from "../../../../hooks/Project/useGetSingleProgram";

const formatDate = (iso) => {
    if (!iso) return '';
    return dayjs(iso).format('DD.MM.YY');
};

const Task = ({title, task, date, people, post, index}) => {
    return (
        <>
            {
                title === "Продукт" ? (
                        <div className={classes.wrapper}>
                            <div className={classes.leftBlock}>
                                <span>{task}</span>
                            </div>
                            <div className={classes.rightBlock}>
                                <span>{date}</span>
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
                                <span>{date}</span>
                                <span>{people}</span>
                                <span className={classes.light}>{post}</span>
                            </div>
                        </div>
                    )
            }
        </>
    )
}

const TasksContainer = ({title, tasks, project}) => {
    return (
        <div className={classes.container}>
            <span className={`${classes.strong}`}>{title}:</span>
            {
                tasks?.map((item, index) => {
                    const user = item?.targetHolders?.[0]?.post?.user;
                    const people = user
                        ? `${user.firstName} ${user.lastName}`
                        : null;

                    return (
                        <Task
                            key={item.id}
                            title={title}
                            task={ project ? `"${item?.projectName}". Продукт: "${item?.targets?.[0]?.content}"` : item?.content}
                            date={formatDate(item.deadline)}
                            people={people}
                            post={item?.targetHolders?.[0]?.post?.postName}
                            index={index + 1}
                        />
                    );
                })
            }

        </div>
    )
}

const Information = ({title, content}) => {
    return (
        <div className={classes.container}>
            <span className={`${classes.strong}`}>{title}:</span>
            <span>{content}</span>
        </div>
    )
}


const order = ['Продукт', 'Метрика', 'Организационные мероприятия', 'Правила', 'Задача'];

export default function ViewProgram({contentRef}) {
    const {PRESETS} = useRightPanel()
    usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);
    const {programId} = useParams();
    const {
        currentProgram,
        currentProjects,
        targets,
        statusProgram
    } = useGetSingleProgram({selectedProgramId: programId});

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
        <div className={classes.main} ref={contentRef}>
            <h3 className={`${classes.strong} ${classes.margin}`}>{localStorage.getItem("name")}</h3>
            <span className={classes.strong}>Имя Фамилия</span>
            <span className={classes.margin}>Название поста</span>

            <h2 className={`${classes.strong} ${classes.center}  ${classes.margin}`}>{currentProgram?.type}</h2>
            <h2 className={`${classes.strong} ${classes.center}`}>{currentProgram?.projectName}</h2>
            {currentProgram?.content?.trim() && <Information title={"Информация"} content={currentProgram?.content}/>}
            {
                sortedTargets?.map((item) => <TasksContainer title={item.title} tasks={item.tasks}/>)
            }
            {
                currentProjects?.length > 0 && <TasksContainer title={"Проекты"} tasks={currentProjects} project={true}/>
            }
        </div>
    )
}
