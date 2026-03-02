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

const Task = ({title, task, date, people, post, index, status}) => {
    return (
        <>
            {
                title === "Продукт" ? (
                        <div className={classes.wrapper}>
                            <div className={classes.leftBlock}>
                                <span>{task}</span>
                            </div>
                            <div className={classes.rightBlock}>
                                <span>{status} {date}</span>
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
                                <span>{status} {date}</span>
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

    // сегодняшняя дата без времени
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (targetState) {
        case "Завершена":
            status = "Завершена";
            date = formatDate(target?.dateComplete);
            break;

        case "Активная":
            if (target?.deadline) {
                const deadlineDate = new Date(target.deadline);
                deadlineDate.setHours(0, 0, 0, 0); // нормализуем дату

                // сравнение только по день/месяц/год
                status = deadlineDate >= today ? null : "Просрочена";
                date = formatDate(target.deadline);
            }
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
                    const {status, date} = statusTarget(item);

                    return (
                        <Task
                            key={item.id}
                            title={title}
                            task={item.content}
                            date={date}
                            people={people}
                            post={item?.targetHolders?.[0]?.post?.postName}
                            index={index + 1}
                            status={status}
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

export default function ViewProject({contentRef}) {
    const {PRESETS} = useRightPanel()
    usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);
    const {projectId} = useParams();
    const {currentProject, targets} = useGetSingleProject({selectedProjectId: projectId});

    const sortedTargets = targets
        ? [...targets].sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title))
        : [];

    const {
        projectName,
        setProjectName,
        setStrategyId
    } = useProjectForm();

    useEffect(() => {
        if (!notEmpty(currentProject)) return

        setProjectName(currentProject?.projectName)
        setStrategyId(currentProject?.strategy?.id ? currentProject?.strategy?.id : null)

    }, [currentProject])

    console.log(currentProject)

    return (
        <div className={classes.main} ref={contentRef}>
            <h3 className={`${classes.strong} ${classes.margin}`}>{localStorage.getItem("name")}</h3>
            <span className={classes.strong}>Имя Фамилия</span>
            <span className={classes.margin}>Название поста</span>

            <h2 className={`${classes.strong} ${classes.center}  ${classes.margin}`}>{currentProject?.type}</h2>
            <h2 className={`${classes.strong} ${classes.center}`}>{currentProject?.projectName}</h2>
            {currentProject?.content?.trim() && <Information title={"Информация"} content={currentProject?.content}/>}
            {
                sortedTargets?.map((item) => <TasksContainer title={item.title} tasks={item.tasks}/>)
            }
        </div>
    )
}
