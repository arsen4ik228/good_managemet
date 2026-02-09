import {useState, useEffect, useRef} from 'react';
import {useParams} from "react-router-dom";
import s from './EditProject.module.css';
import Table from '../components/table/Table';
import {v4 as uuidv4} from 'uuid';
import {useRightPanel, usePanelPreset} from "@hooks";
import {useAllPosts} from '../../../../hooks/Post/useAllPosts';
import {useGetSingleProject} from "../../../../hooks/Project/useGetSingleProject";
import {useUpdateSingleProject} from "../../../../hooks/Project/useUpdateSingleProject";
import {message} from 'antd';
import TableInformation from "../components/table/TableInformation";
import debounce from "lodash/debounce";

const project = {
    projectName: 'projectName',
    targets: [
        {id: uuidv4(), type: 'Продукт', orderNumber: 1, content: 'Продукт', holderPostId: null, date: null},
        {id: uuidv4(), type: 'Задачи', orderNumber: 1, content: 'Задача 1', holderPostId: null, date: null},
        {id: uuidv4(), type: 'Задачи', orderNumber: 2, content: 'Задача 2', holderPostId: null, date: null},
        {id: uuidv4(), type: 'Показатели', orderNumber: 1, content: 'Показатели 1', holderPostId: null, date: null},
        {id: uuidv4(), type: 'Показатели', orderNumber: 2, content: 'Показатели 2', holderPostId: null, date: null},
        {
            id: uuidv4(),
            type: 'Правила и ограничения',
            orderNumber: 1,
            content: 'Правила и ограничения 1',
            holderPostId: null,
            date: null
        },
        {
            id: uuidv4(),
            type: 'Организационные мероприятия',
            orderNumber: 1,
            content: 'Организационные мероприятия 1',
            holderPostId: null,
            date: null
        },
    ],
};

const initialSections = [
    {name: 'Продукт'},
    {name: 'Метрика'},
    {name: 'Организационные мероприятия'},
    {name: 'Правила'},
    {name: 'Задача'},
];

export default function EditProject({sections}) {
    const {PRESETS} = useRightPanel()
    usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);

    const {projectId} = useParams();
    const debouncedSaveRef = useRef(null);
    const latestStateRef = useRef({});
    const [currentProjectId, setCurrentProjectId] = useState();

    const {allPosts} = useAllPosts();
    const {updateProject} = useUpdateSingleProject();
    const {currentProject, targets} = useGetSingleProject({selectedProjectId: currentProjectId});

    const [contentProject, setContentProject] = useState("");
    const [targetsByType, setTargetsByType] = useState({});
    const [focusTargetId, setFocusTargetId] = useState(null);

    const handleUpdateTarget = (type, id, field, value) => {
        setTargetsByType(prev => ({
            ...prev,
            [type]: prev[type].map(t => t.id === id
                ?
                {
                    ...t,
                    ...(t.isCreated ? {} : {isChanged: true}),
                    [field]: value
                }
                : t
            ),
        }));
        debouncedSaveRef.current();
    };

    const handleAddTarget = (type) => {
        if (type === "Продукт") return
        const newTarget = {
            id: uuidv4(),
            type,
            orderNumber: (targetsByType[type]?.length ?? 0) + 1,
            content: '',
            holderPostId: null,
            deadline: null,
            isCreated: true,
        };
        setTargetsByType(prev => ({
            ...prev,
            [type]: [...prev[type], newTarget],
        }));
        setFocusTargetId(newTarget.id);
    };

    const handleUpdateOrder = (type, newOrderIds) => {
        setTargetsByType(prev => ({
            ...prev,
            [type]: newOrderIds.map(id => prev[type].find(t => t.id === id)),
        }));
        debouncedSaveRef.current();
    };

    const handleSave = async () => {
        const {contentProject, targetsByType, projectId} = latestStateRef.current;
        const productState = Object.values(targetsByType)
            .flat()
            .find(t => t.type === "Продукт")?.targetState

        const targetCreateDtos = Object.values(targetsByType)
            .flat()
            .filter(t => t.isCreated && t.content.trim() !== '')
            .map(({id, isCreated, ...rest}) => rest);

        const targetUpdateDtos = Object.values(targetsByType)
            .flat()
            .filter(t => t.isChanged)
            .map(({id, date, isCreated, isChanged, ...rest}) => ({
                _id: id,
                ...rest
            }));

        console.log("productState = ", productState);
        console.log("targetsByType = ", targetsByType);

        if (productState === "Активная") {
            const holderProductPostId = Object.values(targetsByType)
                .flat()
                .find(t => t.type === "Продукт")?.holderPostId;

            const targetActive = targetCreateDtos.map((t) => ({...t, targetState: "Активная"}));
            const targetUpdate = targetUpdateDtos.filter((t) => t.type === "Черновик" && t.type !== "Продукт")?.map((t) => ({
                ...t,
                targetState: "Активная"
            }));
            try {
                const response = await updateProject({
                    projectId: projectId,
                    _id: projectId,
                    holderProductPostId,
                    content: contentProject,
                    ...(targetActive.length > 0 ? {targetCreateDtos: targetActive} : {}),
                    ...(targetUpdate.length > 0 ? {targetUpdateDtos: targetUpdate} : {}),
                }).unwrap();
                setCurrentProjectId(response?.id);
                message.success("Проект обновлен");
            } catch (error) {
                message.error("Ошибка при обновлении проектов")
            }
        } else {
            try {
                const response = await updateProject({
                    projectId: projectId,
                    _id: projectId,
                    content: contentProject,
                    ...(targetCreateDtos.length > 0 ? {targetCreateDtos} : {}),
                    ...(targetUpdateDtos.length > 0 ? {targetUpdateDtos} : {}),
                }).unwrap();
                setCurrentProjectId(response?.id);
                message.success("Проект обновлен");
            } catch (error) {
                message.error("Ошибка при обновлении проектов")
            }
        }

    };

    const handleTargetsInActive = async () => {
        //targetState(pin):"Активная"
        //targetState(pin):"Завершена"
        const targetCreateDtos = Object.values(targetsByType)
            .flat()
            .filter(t => t.isCreated && t.content.trim() !== '')
            .map(({id, isCreated, ...rest}) => ({...rest, targetState: "Активная"}));

        const targetUpdateDtos = Object.values(targetsByType)
            .flat()
            .filter(t => !t.isCreated)
            .map(({id, date, isCreated, isChanged, ...rest}) => ({
                _id: id,
                ...rest,
                targetState: "Активная"
            }));

        const holderProductPostId = Object.values(targetsByType)
            .flat()
            .find(t => t.type === "Продукт")?.holderPostId

        try {
            const response = await updateProject({
                projectId: projectId,
                _id: projectId,
                holderProductPostId,
                ...(targetCreateDtos.length > 0 ? {targetCreateDtos} : {}),
                ...(targetUpdateDtos.length > 0 ? {targetUpdateDtos} : {}),
            }).unwrap();
            setCurrentProjectId(response?.id);
            message.success("Проект активный");
        } catch (error) {
            message.error("Ошибка при обновлении проектов")
        }
    };

    // для открытия нового проекта
    useEffect(() => {
        if (!projectId) return;
        setCurrentProjectId(projectId);
    }, [projectId]);

    // для новых данных в проекте
    useEffect(() => {
        if (!targets) return;

        // 1. Группируем то, что пришло с бэка
        const grouped = targets.reduce((acc, group) => {
            acc[group.title] = group.tasks.map(task => ({
                id: task.id,
                type: group.title,
                orderNumber: task.orderNumber || 1,
                targetState: task.targetState || "Черновик",
                content: task.content || '',
                holderPostId: task.holderPostId || null,
                deadline: task.deadline || null,
                isCreated: false,
            }));
            return acc;
        }, {});

        // 2. Гарантируем наличие всех разделов
        initialSections.forEach(({name}) => {
            if (!grouped[name]) {
                grouped[name] = [
                    {
                        id: uuidv4(),
                        type: name,
                        orderNumber: 1,
                        content: '',
                        targetState: "Черновик",
                        holderPostId: null,
                        deadline: null,
                        isCreated: true,
                    },
                ];
            }
        });

        setContentProject(currentProject?.content);
        setTargetsByType(grouped);
    }, [targets, currentProject]);

    // заполняется переменная ref latestStateRef для handleSave
    useEffect(() => {
        latestStateRef.current = {
            contentProject,
            targetsByType,
            projectId,
        };
    }, [contentProject, targetsByType, projectId]);

    // создается debounce
    useEffect(() => {
        debouncedSaveRef.current = debounce(handleSave, 25000);
        return () => debouncedSaveRef.current.flush();
    }, []);

    return (
        <div className={s.main}>
            <div className={s.wrapper}>
                <button onClick={handleTargetsInActive}> handleTargetsInActive</button>
                <button onClick={handleSave}> update</button>
                {sections
                    .filter(section => section.isView) // только видимые
                    .map(section => {
                        if (section.name === "Информация") {
                            return (
                                <TableInformation
                                    key={section.name}
                                    title={section.name}
                                    content={contentProject}
                                    updateContent={(value) =>
                                        setContentProject(value)
                                    }
                                />
                            )
                        }
                        const targets = targetsByType[section.name] || [];
                        return (
                            <Table
                                key={section.name}
                                title={section.name}
                                targets={targets}
                                posts={allPosts}
                                updateTarget={(id, field, value) =>
                                    handleUpdateTarget(section.name, id, field, value)
                                }
                                addTarget={() => handleAddTarget(section.name)}
                                updateOrder={(newOrderIds) =>
                                    handleUpdateOrder(section.name, newOrderIds)
                                }
                                focusTargetId={focusTargetId}
                            />
                        );
                    })}
            </div>
        </div>
    );
}
