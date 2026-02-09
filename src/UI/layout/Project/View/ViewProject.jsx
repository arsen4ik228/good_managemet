import {useParams} from "react-router-dom";
import {useGetSingleProject} from "../../../../hooks/Project/useGetSingleProject";
import classes from "./ViewProject.module.css";

import {useEffect} from "react";
import {useProjectForm} from "../../../../contexts/ProjectFormContext";
import {notEmpty} from '@helpers/helpers'

import {useRightPanel, usePanelPreset} from "@hooks";
import dayjs from 'dayjs';

const arrayTasks = [
    {
        title: "Продукт",
        tasks: [{
            task: "Автоматизированная линия розлива жидких продуктов производительностью 3 000 ед./час с системой контроля качества и маркировкой.",
            date: "24.01.2024",
            people: "Андрей Тыртышный",
            post: "Начальник службы заказов"
        }]

    },
    {
        title: "Задачи",
        tasks: [
            {
                task: "Заключить договор на покупку станка ВР-350 ТЕ",
                date: "19.11.2023",
                people: "Андрей Тыртышный",
                post: "Начальник службы заказов"
            },
            {
                task: "Подготовить место в цехе №2 для установки станка ВР-350 ТЕ",
                date: "27.11.2023",
                people: "Андрей Макаров",
                post: "Начальник цеха №2"
            },
            {
                task: "Провести кабель питания до места усановки станка ВР-350 ТЕ",
                date: "19.11.2023",
                people: "Алксей Любимов",
                post: "Электрик"
            },
        ],
    },
    {
        title: "Показатели",
        tasks: [
            {
                task: "Заключить договор на покупку станка ВР-350 ТЕ",
                date: "19.11.2023",
                people: "Андрей Тыртышный",
                post: "Начальник службы заказов"
            },
            {
                task: "Подготовить место в цехе №2 для установки станка ВР-350 ТЕ",
                date: "27.11.2023",
                people: "Андрей Макаров",
                post: "Начальник цеха №2"
            },
            {
                task: "Провести кабель питания до места усановки станка ВР-350 ТЕ",
                date: "19.11.2023",
                people: "Алксей Любимов",
                post: "Электрик"
            },
        ],
    },
];

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

const TasksContainer = ({title, tasks}) => {
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
                            task={item.content}
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

export default function ViewProject() {
    const {PRESETS} = useRightPanel()
    usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);
    const {projectId} = useParams();
    const {currentProject, targets} = useGetSingleProject({selectedProjectId: projectId});

    const sortedTargets = targets
        ? [...targets].sort((a, b) => {
            if (a.title === 'Продукт') return -1;
            if (b.title === 'Продукт') return 1;
            return 0;
        })
        : [];

    const {
        projectName,
        setProjectName
    } = useProjectForm();

    useEffect(() => {
        if (!notEmpty(currentProject)) return

        setProjectName(currentProject?.projectName)

    }, [currentProject])

    return (
        <div className={classes.main}>
            <h3 className={`${classes.strong} ${classes.margin}`}>{localStorage.getItem("name")}</h3>
            <span className={classes.strong}>Имя Фамилия</span>
            <span className={classes.margin}>Название поста</span>

            <h2 className={`${classes.strong} ${classes.center}  ${classes.margin}`}>{currentProject?.type}</h2>
            <h2 className={`${classes.strong} ${classes.center}`}>{currentProject?.projectName}</h2>
            {
                sortedTargets?.map((item) => <TasksContainer title={item.title} tasks={item.tasks}/>)
            }

            {currentProject?.content && <Information title={"Информация"} content={currentProject?.content}/>}

        </div>
    )
}
